import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useI18n } from '../../i18n/I18nContext';
import { pricePerTree, totalPrice, SITE } from '../../lib/site';

const API = import.meta.env.VITE_BACKEND_URL || '';

export default function CheckoutModal({ product, initialQty, onClose }) {
  const { lang, t } = useI18n();
  const [qty, setQty] = useState(initialQty || 1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const name = lang === 'hu' ? product.nameHu : product.nameEn;
  const price = pricePerTree(qty);
  const total = totalPrice(qty);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address) {
      setError('Kérjük töltsd ki az összes kötelező mezőt!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/checkout/session`, {
        product_id: product.id,
        quantity: qty,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        delivery_address: form.address,
        origin_url: window.location.origin,
        language: lang,
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || 'Hiba történt. Kérjük próbáld újra.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="overlay"
        onClick={onClose}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 100 }}
      >
        <motion.div
          data-testid="checkout-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            width: '100%',
            maxWidth: '580px',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div style={{
            background: 'var(--color-dark)',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {t.checkout.title}
              </div>
              <div style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, marginTop: '4px' }}>
                {name}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Order summary */}
            <div style={{ background: 'var(--color-bg-alt)', borderRadius: 'var(--radius)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-dark)' }}>{name} × {qty}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>€{price} / fa</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                €{total}
              </div>
            </div>

            {/* Qty selector in modal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-muted)' }}>{t.checkout.title}:</span>
              <button type="button" onClick={() => setQty(q => Math.max(1, q-1))}
                style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1.5px solid var(--color-primary)', background: 'transparent', cursor: 'pointer', fontWeight: 700, color: 'var(--color-primary)' }}>
                −
              </button>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: '20px', textAlign: 'center' }}>{qty}</span>
              <button type="button" onClick={() => setQty(q => Math.min(50, q+1))}
                style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1.5px solid var(--color-primary)', background: 'transparent', cursor: 'pointer', fontWeight: 700, color: 'var(--color-primary)' }}>
                +
              </button>
            </div>

            {/* Form fields */}
            <div className="form-group">
              <label className="form-label">{t.checkout.nameLabel} *</label>
              <input
                data-testid="checkout-name"
                className="form-input"
                type="text"
                placeholder={t.checkout.namePlaceholder}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.checkout.emailLabel} *</label>
              <input
                data-testid="checkout-email"
                className="form-input"
                type="email"
                placeholder={t.checkout.emailPlaceholder}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.checkout.phoneLabel}</label>
              <input
                className="form-input"
                type="tel"
                placeholder={t.checkout.phonePlaceholder}
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.checkout.addressLabel} *</label>
              <input
                className="form-input"
                type="text"
                placeholder={t.checkout.addressPlaceholder}
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                required
              />
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: '#fef2f2', borderRadius: 'var(--radius)', color: '#c0392b', fontSize: '0.9rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button
              data-testid="checkout-submit"
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '18px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '⏳ Feldolgozás...' : t.checkout.submitBtn}
            </button>

            <div style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.8rem' }}>
              {t.checkout.secureNote}
            </div>

            <button type="button" onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>
              {t.checkout.cancel}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

