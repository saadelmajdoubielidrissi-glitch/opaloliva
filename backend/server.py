import os
import logging
from datetime import datetime
from typing import Optional

import stripe
from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr

load_dotenv()

# ── Logging ────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("opaloliva")

# ── Stripe ─────────────────────────────────────────────────────────────────
stripe.api_key = os.getenv("STRIPE_API_KEY", "sk_test_emergent")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

# ── MongoDB ─────────────────────────────────────────────────────────────────
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "opaloliva")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ── FastAPI ─────────────────────────────────────────────────────────────────
app = FastAPI(title="OpalOliva API", version="1.0.0")

cors_origins_raw = os.getenv("CORS_ORIGINS", "*")
cors_origins = [o.strip() for o in cors_origins_raw.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Pricing logic (server-side, never trust frontend) ──────────────────────
PRODUCTS = {
    "ziziolera": {
        "id": "ziziolera",
        "name_hu": "Ziziolera Olajfa",
        "name_en": "Ziziolera Olive Tree",
        "origin": "🇮🇹 Olasz",
        "description_hu": "Eredeti olasz kertekből származó, hidegálló fajta.",
        "description_en": "Cold-hardy variety from original Italian gardens.",
        "size": "1.4–1.6 m",
        "age": "2 év",
    },
    "puntolino": {
        "id": "puntolino",
        "name_hu": "Puntolino Olajfa",
        "name_en": "Puntolino Olive Tree",
        "origin": "🇭🇷 Horvát",
        "description_hu": "Eredeti horvát (dalmáciai) kertekből, erős télállóság.",
        "description_en": "From original Croatian (Dalmatian) gardens, strong cold hardiness.",
        "size": "1.4–1.6 m",
        "age": "2 év",
    },
}

PRICE_TIERS = [
    {"min_qty": 1,  "max_qty": 2,  "price_eur": 25, "price_cents": 2500},
    {"min_qty": 3,  "max_qty": 4,  "price_eur": 20, "price_cents": 2000},
    {"min_qty": 5,  "max_qty": 999, "price_eur": 15, "price_cents": 1500},
]


def price_per_tree_cents(qty: int) -> int:
    """Server-side pricing — frontend amount is NEVER trusted."""
    if qty >= 5:
        return 1500
    if qty >= 3:
        return 2000
    return 2500


def serialize_doc(doc: dict) -> dict:
    """Convert MongoDB ObjectId to string for JSON serialization."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# ── Pydantic models ─────────────────────────────────────────────────────────
class ContactMessage(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    message: str
    language: Optional[str] = "hu"


class NewsletterSubscribe(BaseModel):
    email: str
    language: Optional[str] = "hu"


class CheckoutRequest(BaseModel):
    product_id: str
    quantity: int
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = ""
    delivery_address: str
    origin_url: str
    language: Optional[str] = "hu"


# ── Routes ──────────────────────────────────────────────────────────────────

@app.get("/api/")
async def health():
    return {"message": "OpalOliva API", "status": "ok", "version": "1.0.0"}


@app.get("/api/pricing")
async def get_pricing():
    products_list = []
    for product in PRODUCTS.values():
        tiers = []
        for t in PRICE_TIERS:
            tiers.append({
                "min_qty": t["min_qty"],
                "max_qty": t["max_qty"],
                "price_eur": t["price_eur"],
                "price_cents": t["price_cents"],
            })
        products_list.append({**product, "tiers": tiers})
    return {"products": products_list, "currency": "EUR"}


# ── Contact ─────────────────────────────────────────────────────────────────
@app.post("/api/contact")
async def submit_contact(msg: ContactMessage):
    doc = {
        **msg.model_dump(),
        "created_at": datetime.utcnow(),
        "read": False,
    }
    result = await db["contact_messages"].insert_one(doc)
    return {"success": True, "id": str(result.inserted_id)}


@app.get("/api/contact")
async def list_contacts():
    docs = []
    async for doc in db["contact_messages"].find().sort("created_at", -1).limit(200):
        docs.append(serialize_doc(doc))
    return {"messages": docs, "total": len(docs)}


# ── Newsletter ───────────────────────────────────────────────────────────────
@app.post("/api/newsletter")
async def subscribe_newsletter(sub: NewsletterSubscribe):
    existing = await db["newsletter"].find_one({"email": sub.email})
    if existing:
        return {"success": True, "message": "Already subscribed", "new": False}
    doc = {
        **sub.model_dump(),
        "created_at": datetime.utcnow(),
    }
    await db["newsletter"].insert_one(doc)
    return {"success": True, "message": "Subscribed successfully", "new": True}


@app.get("/api/newsletter")
async def list_newsletter():
    docs = []
    async for doc in db["newsletter"].find().sort("created_at", -1).limit(500):
        docs.append(serialize_doc(doc))
    return {"subscribers": docs, "total": len(docs)}


# ── Stripe Checkout ──────────────────────────────────────────────────────────
@app.post("/api/checkout/session")
async def create_checkout_session(req: CheckoutRequest):
    # Validate product
    if req.product_id not in PRODUCTS:
        raise HTTPException(status_code=400, detail="Invalid product_id")
    if req.quantity < 1 or req.quantity > 100:
        raise HTTPException(status_code=400, detail="Quantity must be 1–100")

    product = PRODUCTS[req.product_id]

    # ── Server-side price calculation (NEVER trust frontend) ──
    unit_price_cents = price_per_tree_cents(req.quantity)
    total_cents = unit_price_cents * req.quantity

    product_name = product["name_hu"] if req.language == "hu" else product["name_en"]
    origin_url = req.origin_url.rstrip("/")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "eur",
                        "unit_amount": unit_price_cents,
                        "product_data": {
                            "name": f"{product_name} × {req.quantity}",
                            "description": f"{product['size']} | {product['age']} | {product['origin']}",
                        },
                    },
                    "quantity": req.quantity,
                }
            ],
            mode="payment",
            customer_email=req.customer_email,
            success_url=f"{origin_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{origin_url}/#products",
            metadata={
                "product_id": req.product_id,
                "quantity": str(req.quantity),
                "customer_name": req.customer_name,
                "customer_phone": req.customer_phone,
                "delivery_address": req.delivery_address,
                "language": req.language,
            },
        )
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=502, detail=f"Stripe error: {str(e)}")

    # Persist transaction
    transaction = {
        "session_id": session.id,
        "product_id": req.product_id,
        "product_name": product_name,
        "quantity": req.quantity,
        "unit_price_cents": unit_price_cents,
        "total_cents": total_cents,
        "currency": "eur",
        "customer_name": req.customer_name,
        "customer_email": req.customer_email,
        "customer_phone": req.customer_phone,
        "delivery_address": req.delivery_address,
        "language": req.language,
        "payment_status": "initiated",
        "stripe_status": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    await db["payment_transactions"].insert_one(transaction)

    return {"url": session.url, "session_id": session.id}


@app.get("/api/checkout/status/{session_id}")
async def get_checkout_status(session_id: str):
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        stripe_status = session.payment_status  # "paid", "unpaid", "no_payment_required"

        payment_status = {
            "paid": "completed",
            "unpaid": "pending",
            "no_payment_required": "completed",
        }.get(stripe_status, "pending")

        # Update transaction idempotently
        await db["payment_transactions"].update_one(
            {"session_id": session_id},
            {
                "$set": {
                    "payment_status": payment_status,
                    "stripe_status": stripe_status,
                    "updated_at": datetime.utcnow(),
                }
            },
        )
        return {
            "session_id": session_id,
            "payment_status": payment_status,
            "stripe_status": stripe_status,
            "amount_total": session.amount_total,
            "currency": session.currency,
            "customer_email": session.customer_email,
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=502, detail=str(e))


@app.post("/api/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    if STRIPE_WEBHOOK_SECRET:
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")
    else:
        import json
        event = json.loads(payload)

    if event["type"] == "checkout.session.completed":
        session_obj = event["data"]["object"]
        await db["payment_transactions"].update_one(
            {"session_id": session_obj["id"]},
            {
                "$set": {
                    "payment_status": "completed",
                    "stripe_status": "paid",
                    "updated_at": datetime.utcnow(),
                }
            },
        )
        logger.info(f"✅ Payment completed: {session_obj['id']}")

    return {"received": True}


@app.get("/api/transactions")
async def list_transactions():
    docs = []
    async for doc in db["payment_transactions"].find().sort("created_at", -1).limit(500):
        docs.append(serialize_doc(doc))
    return {"transactions": docs, "total": len(docs)}
