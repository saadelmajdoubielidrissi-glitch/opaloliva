import { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { SITE } from '../../lib/site';

export default function Navbar() {
  const { lang, setLang, t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: t.nav.trees, href: '#products' },
    { label: t.nav.gallery, href: '#gallery' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.faq, href: '#faq' },
    { label: t.nav.contact, href: '#contact' },
  ];

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        data-testid="site-navbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.4s ease',
          background: scrolled ? 'rgba(26, 34, 20, 0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Logo */}
          <button
            data-testid="logo-button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <img src="/logo.jpg?v=3" alt="OpalOliva Logo" style={{ height: '48px', width: '48px', borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}>
              OpalOliva
            </span>
          </button>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden-mobile">
            {navLinks.map(link => (
              <a
                key={link.href}
                data-testid={`nav-link-${link.href.slice(1)}`}
                href={link.href}
                onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  letterSpacing: '0.03em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.85)'}
              >
                {link.label}
              </a>
            ))}

            {/* Language toggle */}
            <div style={{ display: 'flex', gap: '4px', padding: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px' }}>
              <button
                data-testid="lang-switch-hu"
                onClick={() => setLang('hu')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: lang === 'hu' ? '#fff' : 'transparent',
                  color: lang === 'hu' ? 'var(--color-dark)' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.2s',
                }}
              >
                🇭🇺 HU
              </button>
              <button
                data-testid="lang-switch-en"
                onClick={() => setLang('en')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: lang === 'en' ? '#fff' : 'transparent',
                  color: lang === 'en' ? 'var(--color-dark)' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.2s',
                }}
              >
                🇬🇧 EN
              </button>
            </div>

            <a
              data-testid="nav-cta-order"
              href="#products"
              onClick={e => { e.preventDefault(); scrollTo('#products'); }}
              className="btn btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.85rem' }}
            >
              {t.nav.cta}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              flexDirection: 'column',
              gap: '5px',
            }}
            className="show-mobile"
            aria-label="Menu"
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block',
                width: '24px',
                height: '2px',
                background: '#fff',
                borderRadius: '2px',
                transition: 'all 0.3s',
                transform: mobileOpen && i === 0 ? 'rotate(45deg) translate(5px, 5px)' :
                            mobileOpen && i === 2 ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                opacity: mobileOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            background: 'rgba(26, 34, 20, 0.98)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '20px 24px 30px',
          }}>
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.85)',
                  padding: '12px 0',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {link.label}
              </a>
            ))}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
              <button data-testid="lang-switch-hu" onClick={() => { setLang('hu'); setMobileOpen(false); }}
                style={{ padding: '8px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.3)', background: lang==='hu'?'#fff':'transparent', color: lang==='hu'?'#1a2214':'#fff', cursor: 'pointer', fontWeight: 700 }}>
                🇭🇺 Magyar
              </button>
              <button data-testid="lang-switch-en" onClick={() => { setLang('en'); setMobileOpen(false); }}
                style={{ padding: '8px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.3)', background: lang==='en'?'#fff':'transparent', color: lang==='en'?'#1a2214':'#fff', cursor: 'pointer', fontWeight: 700 }}>
                🇬🇧 English
              </button>
            </div>
            <a href="#products" onClick={e => { e.preventDefault(); scrollTo('#products'); }}
              className="btn btn-primary"
              style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
              {t.nav.cta}
            </a>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}

