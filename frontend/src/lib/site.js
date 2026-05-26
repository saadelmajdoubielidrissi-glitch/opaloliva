// Site-wide constants for OpalOliva
export const SITE = {
  name: "OpalOliva",
  ownerName: "Lovei Péter",
  phone: "+36 30 312 2522",
  phonePretty: "+36 30 312 2522",
  phoneLink: "tel:+36303122522",
  whatsapp: "https://wa.me/36303122522",
  whatsappPrefilled: "https://wa.me/36303122522?text=Szia%20Péter%2C%20érdeklődnék%20az%20olajfákkal%20kapcsolatban!",
  email: "lovei.peter888@icloud.com",
  emailLink: "mailto:lovei.peter888@icloud.com",
  location: "Kecskemét, Magyarország",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  currency: "€",
  domain: "opaloliva.hu",
};

// Server-side mirrors this exactly — do NOT rely on these for checkout
export function pricePerTree(qty) {
  if (qty >= 5) return 15;
  if (qty >= 3) return 20;
  return 25;
}

export function totalPrice(qty) {
  return pricePerTree(qty) * qty;
}

export const PRODUCTS = [
  {
    id: "ziziolera",
    nameHu: "Ziziolera Olajfa",
    nameEn: "Ziziolera Olive Tree",
    originFlag: "🇮🇹",
    originHu: "Olasz",
    originEn: "Italian",
    size: "1,4 – 1,6 m",
    age: "2 éves",
    cold: "–12 °C",
    image: "/images/ziziolera.png",
    accentColor: "#c8853a",
  },
  {
    id: "puntolino",
    nameHu: "Puntolino Olajfa",
    nameEn: "Puntolino Olive Tree",
    originFlag: "🇭🇷",
    originHu: "Horvát",
    originEn: "Croatian",
    size: "1,4 – 1,6 m",
    age: "2 éves",
    cold: "–12 °C",
    image: "/images/puntolino.png",
    accentColor: "#4a5c3a",
  },
];

export const IMAGES = {
  hero: "/images/hero-bg.png",
  story: "/images/story.png",
  about: "/images/about.png",
  galleryTerrace: "/images/gallery-terrace.png",
  galleryGarden: "/images/gallery-garden.png",
};
