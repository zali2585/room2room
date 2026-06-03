import { Link } from 'react-router-dom';
import { getAllListings } from '../utils/listingsStore';
import { conditionColor } from '../data/listings';
import styles from './RecentListings.module.css';

function ListingCard({ listing }) {
  return (
    <Link to={`/product/${listing.id}`} className={styles.card}>
      <div className={styles.imageWrap} style={{ background: listing.color }}>
        <span className={styles.imagePlaceholder}>📦</span>
      </div>
      <div className={styles.info}>
        <span
          className={styles.badge}
          style={{
            color: conditionColor[listing.condition] || '#6b7280',
            background: `${conditionColor[listing.condition]}18`,
          }}
        >
          {listing.condition}
        </span>
        <p className={styles.title}>{listing.title}</p>
        <p className={styles.price}>${listing.price}</p>
        <p className={styles.category}>{listing.category}</p>
      </div>
    </Link>
  );
}

export default function RecentListings() {
  const recent = getAllListings().slice(0, 6);
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              <span className={styles.fire}>🔥</span> Recent Listings
            </h2>
            <p className={styles.sub}>Fresh items posted by Bruins on campus</p>
          </div>
          <Link to="/search" className={styles.viewAll}>View all →</Link>
        </div>
        <div className={styles.grid}>
          {recent.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </div>
    </section>
  );
}
