import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllListings, getListingById } from '../utils/listingsStore';
import { conditionColor, conditionBg } from '../data/listings';
import styles from './ProductDetailPage.module.css';

function getSavedIds() {
  try { return JSON.parse(localStorage.getItem('r2r_wishlist') || '[]'); }
  catch { return []; }
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [saved, setSaved] = useState(() => getSavedIds().includes(Number(id)));

  const item = getListingById(id);

  if (!item) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.notFound}>
          <h2>Item not found</h2>
          <button onClick={() => navigate('/search')}>Browse listings</button>
        </div>
      </div>
    );
  }

  const similar = getAllListings()
    .filter((l) => l.category === item.category && l.id !== item.id)
    .slice(0, 4);

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link to="/" className={styles.breadLink}>Home</Link>
          <span className={styles.breadSep}>›</span>
          <Link to="/search" className={styles.breadLink}>{item.category}</Link>
          <span className={styles.breadSep}>›</span>
          <span className={styles.breadCurrent}>{item.title}</span>
        </nav>

        <div className={styles.mainGrid}>
          <div className={styles.gallery}>
            <div className={styles.mainImg} style={{ background: item.color }}>📷</div>
            <div className={styles.thumbRow}>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`${styles.galleryThumb} ${selectedThumb === i ? styles.thumbActive : ''}`}
                  style={{ background: item.color }}
                  onClick={() => setSelectedThumb(i)}
                >
                  📷
                </div>
              ))}
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.badges}>
              <span
                className={styles.condBadge}
                style={{ background: conditionBg[item.condition], color: conditionColor[item.condition] }}
              >
                ✓ {item.condition}
              </span>
              <span className={styles.catBadge}>{item.category}</span>
              <span className={styles.timeBadge}>📅 Posted recently</span>
            </div>

            <h1 className={styles.itemTitle}>{item.title}</h1>
            <div className={styles.priceRow}>
              <span className={styles.price}>${item.price}</span>
              {item.originalPrice && (
                <span className={styles.originalPrice}>Original retail: ~${item.originalPrice}</span>
              )}
            </div>

            <div className={styles.sellerCard}>
              <div className={styles.sellerAvatar}>{item.seller.initials}</div>
              <div className={styles.sellerInfo}>
                <div className={styles.sellerName}>{item.seller.name}</div>
                <div className={styles.sellerMeta}>
                  ⭐ {item.seller.rating} · {item.seller.sales} sales · {item.seller.dorm}
                </div>
              </div>
              <div className={styles.sellerRight}>
                <span className={styles.verifiedBadge}>✓ Verified</span>
                <Link to="/profile" className={styles.viewProfile}>View profile</Link>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Description</h3>
              <p className={styles.description}>{item.description}</p>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>📍 Preferred Meetup</h3>
              <p className={styles.meetupText}>{item.meetup}</p>
            </div>

            <button className={styles.buyBtn} onClick={() => navigate('/checkout', { state: { itemId: item.id } })}>
              Buy Now — ${item.price}
            </button>
            <button className={styles.msgBtn} onClick={() => navigate('/messages', { state: { toEmail: item.sellerEmail, itemId: item.id } })}>
              ✉️ Message Seller
            </button>
            <button
              className={styles.saveWish}
              onClick={() => {
                const ids = getSavedIds();
                const numId = Number(id);
                const next = saved ? ids.filter((x) => x !== numId) : [...ids, numId];
                localStorage.setItem('r2r_wishlist', JSON.stringify(next));
                setSaved(!saved);
              }}
              style={{ color: saved ? '#dc2626' : undefined }}
            >
              {saved ? '♥ Saved!' : '♡ Save to wishlist'}
            </button>
          </div>
        </div>

        {similar.length > 0 && (
          <div className={styles.similarSection}>
            <h2 className={styles.similarTitle}>Similar Items</h2>
            <div className={styles.similarGrid}>
              {similar.map((s) => (
                <div
                  key={s.id}
                  className={styles.similarCard}
                  onClick={() => navigate(`/product/${s.id}`)}
                >
                  <div className={styles.similarImg} style={{ background: s.color }}>📷</div>
                  <div className={styles.similarBody}>
                    <p className={styles.similarName}>{s.title}</p>
                    <p className={styles.similarPrice} style={{ color: conditionColor[s.condition] || 'var(--blue)' }}>
                      ${s.price}
                    </p>
                    <p className={styles.similarCond} style={{ color: conditionColor[s.condition] }}>
                      {s.condition}
                    </p>
                    <p className={styles.similarSeller}>by {s.seller.name}</p>
                    <button className={styles.viewBtn}>View →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
