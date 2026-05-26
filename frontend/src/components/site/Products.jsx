import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useI18n } from '../../i18n/I18nContext';
import { PRODUCTS, pricePerTree, totalPrice } from '../../lib/site';
import CheckoutModal from './CheckoutModal';

function ProductCard({ product, lang, t, onOrder }) {
  const [qty, setQty] = useState(1);
  const price = pricePerTree(qty);
  const total = totalPrice(qty);

  const name = lang === 'hu' ? product.nameHu : product.nameEn;
  const origin = lang === 'hu' ? product.originHu : product.originEn;
  const desc = lang === 'hu'
    ? t.products[product.id]?.descShort
    : t.products[product.id]?.descShort;

  return (
    <div
      className="card"
      data-testid={`product-card-${product.id}`}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '320px', overflow: 'hidden', background: '#f0ede8' }}>
        <img
          src={product.image}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }}
        />
        {/* Origin badge */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: '100px',
          padding: '6px 14px',
          fontSize: '0.8rem',
          fontWeight: 700,
          boxShadow: 'var(--shadow-sm)',
        }}>
          {product.originFlag} {origin}
        </div>
        {/* Gift badge */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'var(--color-accent)',
          color: '#fff',
          borderRadius: '100px',
          padding: '5px 12px',
          fontSize: '0.72rem',
          fontWeight: 700,
        }}>
          {t.products.giftBadge}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '28px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '8px', color: 'var(--color-dark)' }}>
            {name}
          </h3>
          <p style={{ color: 'var(--color-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>{desc}</p>
        </div>

        {/* Specs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
        }}>
          {[
            { label: t.products.specSize, value: product.size },
            { label: t.products.specAge, value: product.age },
            { label: t.products.specCold, value: product.cold },
          ].map(spec => (
            <div key={spec.label} style={{
              padding: '10px',
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>
                {spec.label}
              </div>
              <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>
                {spec.value}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing tiers */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            {t.products.qtyLabel}
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {t.products.tiers.map((tier, i) => (
              <span key={i} style={{
                padding: '4px 10px',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: 'var(--color-bg-alt)',
                color: 'var(--color-primary)',
                border: '1px solid transparent',
              }}>
                {tier.label}: <strong>€{tier.price}</strong>
              </span>
            ))}
          </div>

          {/* Qty selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button
              data-testid={`qty-decrement-${product.id}`}
              onClick={() => setQty(q => Math.max(1, q - 1))}
              style={{
                width: '36px', height: '36px',
                borderRadius: '50%',
                border: '1.5px solid var(--color-primary)',
                background: 'transparent',
                color: 'var(--color-primary)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.background = 'var(--color-primary)'; e.target.style.color = '#fff'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--color-primary)'; }}
            >
              −
            </button>
            <span style={{ fontWeight: 700, fontSize: '1.2rem', minWidth: '24px', textAlign: 'center' }}>
              {qty}
            </span>
            <button
              data-testid={`qty-increment-${product.id}`}
              onClick={() => setQty(q => Math.min(50, q + 1))}
              style={{
                width: '36px', height: '36px',
                borderRadius: '50%',
                border: '1.5px solid var(--color-primary)',
                background: 'transparent',
                color: 'var(--color-primary)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.background = 'var(--color-primary)'; e.target.style.color = '#fff'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--color-primary)'; }}
            >
              +
            </button>

            {/* Price display */}
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                €{price} {t.products.perTree}
              </div>
              <div
                data-testid={`total-price-${product.id}`}
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-accent)', lineHeight: 1 }}
              >
                €{total}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>{t.products.total}</div>
            </div>
          </div>
        </div>

        {/* Stock note */}
        <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600 }}>
          {t.products.stockNote}
        </div>

        {/* Order button */}
        <button
          data-testid={`order-button-${product.id}`}
          onClick={() => onOrder(product, qty)}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}
        >
          🫒 {t.products.orderBtn}
        </button>
      </div>
    </div>
  );
}

export default function Products() {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [checkout, setCheckout] = useState(null); // { product, qty }

  return (
    <section id="products" className="section" ref={ref}
      style={{ background: 'var(--color-bg-alt)' }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <span className="eyebrow">{t.products.eyebrow}</span>
          <h2 className="section-title">{t.products.title}</h2>
          <p style={{ color: 'var(--color-muted)', maxWidth: '580px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
            {t.products.sub}
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              <ProductCard
                product={product}
                lang={lang}
                t={t}
                onOrder={(p, q) => setCheckout({ product: p, qty: q })}
              />
            </motion.div>
          ))}
        </div>

        {/* "Not sure?" CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{ textAlign: 'center', marginTop: '48px', color: 'var(--color-muted)', fontSize: '1rem' }}
        >
          {t.products.notSure}{' '}
          <a
            href="#contact"
            onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            style={{ color: 'var(--color-accent)', fontWeight: 700, textDecoration: 'underline' }}
          >
            {t.products.contactCta}
          </a>
        </motion.div>
      </div>

      {checkout && (
        <CheckoutModal
          product={checkout.product}
          initialQty={checkout.qty}
          onClose={() => setCheckout(null)}
        />
      )}
    </section>
  );
}

