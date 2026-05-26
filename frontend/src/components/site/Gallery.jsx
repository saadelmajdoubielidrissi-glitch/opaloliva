import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useI18n } from '../../i18n/I18nContext';
import { IMAGES } from '../../lib/site';

const galleryItems = [
  { id: 0, src: '/images/ziziolera.png', alt: 'Ziziolera Olajfa', tag: 'Ziziolera' },
  { id: 1, src: '/images/puntolino.png', alt: 'Puntolino Olajfa', tag: 'Puntolino' },
  { id: 2, src: IMAGES.galleryTerrace, alt: 'Olajfa teraszon', tag: 'Teraszon' },
  { id: 3, src: IMAGES.galleryGarden, alt: 'Olajfa kertben', tag: 'Kertben' },
  { id: 4, src: IMAGES.story, alt: 'Mediterrán olajfa részlet', tag: 'Ziziolera' },
  { id: 5, src: IMAGES.about, alt: 'Olajfák a kertben', tag: 'Kertben' },
  { id: 6, src: '/images/ziziolera.png', alt: 'Ziziolera közelről', tag: 'Teraszon' },
  { id: 7, src: '/images/puntolino.png', alt: 'Puntolino terasz', tag: 'Puntolino' },
];

export default function Gallery() {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeFilter, setActiveFilter] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  const filterKeys = ['Mind', 'Ziziolera', 'Puntolino', 'Kertben', 'Teraszon'];
  const currentFilter = filterKeys[activeFilter];
  const filtered = activeFilter === 0 ? galleryItems : galleryItems.filter(i => i.tag === currentFilter);

  return (
    <section id="gallery" className="section section-dark" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <span className="eyebrow">{t.gallery.eyebrow}</span>
          <h2 className="section-title section-title-light">{t.gallery.title}</h2>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
            {t.gallery.filters.map((filter, i) => (
              <button
                key={i}
                data-testid={`gallery-filter-${filter.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => setActiveFilter(i)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '100px',
                  border: `1.5px solid ${activeFilter === i ? 'var(--color-accent)' : 'rgba(255,255,255,0.2)'}`,
                  background: activeFilter === i ? 'var(--color-accent)' : 'transparent',
                  color: activeFilter === i ? '#fff' : 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Masonry grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                data-testid={`gallery-item-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => setLightbox(item)}
                style={{
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  cursor: 'zoom-in',
                  aspectRatio: i % 3 === 0 ? '3/4' : '1/1',
                  position: 'relative',
                  background: 'rgba(255,255,255,0.05)',
                }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '12px',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{item.alt}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <motion.div
          data-testid="gallery-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            cursor: 'zoom-out',
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              fontSize: '1.5rem',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src={lightbox.src}
            alt={lightbox.alt}
            style={{ maxHeight: '85vh', maxWidth: '90vw', borderRadius: 'var(--radius)', objectFit: 'contain' }}
            onClick={e => e.stopPropagation()}
          />
        </motion.div>
      )}
    </section>
  );
}

