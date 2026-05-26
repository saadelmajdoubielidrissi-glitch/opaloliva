import { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL || '';

function Tab({ label, active, onClick, testid }) {
  return (
    <button
      data-testid={testid}
      onClick={onClick}
      style={{
        padding: '10px 24px',
        borderRadius: '100px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '0.9rem',
        background: active ? 'var(--color-primary)' : 'transparent',
        color: active ? '#fff' : 'var(--color-muted)',
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );
}

export default function Admin() {
  const [tab, setTab] = useState('contacts');
  const [contacts, setContacts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newsletter, setNewsletter] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [c, o, n] = await Promise.all([
          axios.get(`${API}/api/contact`),
          axios.get(`${API}/api/transactions`),
          axios.get(`${API}/api/newsletter`),
        ]);
        setContacts(c.data.messages || []);
        setOrders(o.data.transactions || []);
        setNewsletter(n.data.subscribers || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const fmtDate = (d) => d ? new Date(d).toLocaleString('hu-HU') : '–';
  const fmtEur = (cents) => cents ? `€${(cents / 100).toFixed(2)}` : '–';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '2rem' }}>🫒</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-dark)' }}>
              OpalOliva Admin
            </h1>
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: '#fef3cd',
            borderRadius: 'var(--radius)',
            fontSize: '0.8rem',
            color: '#856404',
            fontWeight: 600,
          }}>
            ⚠️ Unauthenticated — add auth before production
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '32px',
        }}>
          {[
            { label: 'Messages', value: contacts.length, icon: '📧' },
            { label: 'Orders', value: orders.length, icon: '🛒' },
            { label: 'Newsletter', value: newsletter.length, icon: '📰' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#fff',
              borderRadius: 'var(--radius)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              <span style={{ fontSize: '1.8rem' }}>{stat.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-dark)', lineHeight: 1 }}>
                  {loading ? '…' : stat.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: 600 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '4px',
          background: '#fff',
          borderRadius: '100px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '24px',
          width: 'fit-content',
        }}>
          <Tab testid="admin-tab-contacts" label={`📧 Messages (${contacts.length})`} active={tab === 'contacts'} onClick={() => setTab('contacts')} />
          <Tab testid="admin-tab-orders" label={`🛒 Orders (${orders.length})`} active={tab === 'orders'} onClick={() => setTab('orders')} />
          <Tab testid="admin-tab-newsletter" label={`📰 Newsletter (${newsletter.length})`} active={tab === 'newsletter'} onClick={() => setTab('newsletter')} />
        </div>

        {/* Content */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-muted)' }}>⏳ Loading...</div>
          ) : (
            <>
              {/* Contacts */}
              {tab === 'contacts' && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-alt)' }}>
                      {['Name', 'Email', 'Phone', 'Message', 'Date'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>No messages yet</td></tr>
                    ) : contacts.map((c, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--color-bg-alt)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--color-muted)' }}>{c.email}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--color-muted)' }}>{c.phone || '–'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.85rem', maxWidth: '300px' }}>{c.message}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{fmtDate(c.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Orders */}
              {tab === 'orders' && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-alt)' }}>
                      {['Product', 'Qty', 'Total', 'Customer', 'Status', 'Date'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>No orders yet</td></tr>
                    ) : orders.map((o, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--color-bg-alt)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem' }}>{o.product_name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.9rem' }}>{o.quantity}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-accent)' }}>{fmtEur(o.total_cents)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.85rem' }}>
                          <div>{o.customer_name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>{o.customer_email}</div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: '100px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: o.payment_status === 'completed' ? 'rgba(74,92,58,0.12)' : o.payment_status === 'initiated' ? 'rgba(200,133,58,0.12)' : 'rgba(200,58,58,0.12)',
                            color: o.payment_status === 'completed' ? 'var(--color-primary)' : o.payment_status === 'initiated' ? 'var(--color-accent)' : '#c03a3a',
                          }}>
                            {o.payment_status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{fmtDate(o.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Newsletter */}
              {tab === 'newsletter' && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-alt)' }}>
                      {['Email', 'Language', 'Date'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {newsletter.length === 0 ? (
                      <tr><td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>No subscribers yet</td></tr>
                    ) : newsletter.map((n, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--color-bg-alt)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem' }}>{n.email}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.85rem' }}>{n.language === 'hu' ? '🇭🇺' : '🇬🇧'} {n.language?.toUpperCase()}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--color-muted)' }}>{fmtDate(n.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
