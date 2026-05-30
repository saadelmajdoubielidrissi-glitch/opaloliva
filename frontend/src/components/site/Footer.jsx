import { useI18n } from '../../i18n/I18nContext';
import { SITE } from '../../lib/site';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: 'var(--color-dark)',
      color: 'rgba(255,255,255,0.6)',
      paddingTop: '64px',
      paddingBottom: '32px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          marginBottom: '48px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img src="/logo.jpg?v=3" alt="OpalOliva Logo" style={{ height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
                OpalOliva
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '240px' }}>
              {t.footer.tagline}
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', transition: 'background 0.2s', color: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >📸</a>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer"
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', transition: 'background 0.2s', color: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >👍</a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '16px' }}>
              {t.footer.quickLinks}
            </h4>
            {[
              { label: 'Fáink', id: 'products' },
              { label: 'Galéria', id: 'gallery' },
              { label: 'Rólam', id: 'about' },
              { label: 'GYIK', id: 'faq' },
              { label: 'Kapcsolat', id: 'contact' },
            ].map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  display: 'block',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  padding: '6px 0',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s',
                  textAlign: 'left',
                }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '16px' }}>
              {t.footer.legal}
            </h4>
            {[t.footer.gdpr, t.footer.cookie, t.footer.terms].map(label => (
              <a key={label} href="#"
                style={{ display: 'block', color: 'rgba(255,255,255,0.6)', padding: '6px 0', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Contact info */}
          <div>
            <h4 style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '16px' }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <a href={SITE.phoneLink} style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                📞 {SITE.phonePretty}
              </a>
              <a href={SITE.emailLink} style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                📧 {SITE.email}
              </a>
              <span>📍 {SITE.location}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '24px',
          textAlign: 'center',
          fontSize: '0.82rem',
        }}>
          {t.footer.copy}
        </div>
      </div>
    </footer>
  );
}

