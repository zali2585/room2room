import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';

export default function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    else navigate('/search');
  };

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <h1 className={styles.headline}>
            The Easiest Way to<br />
            <span>Buy &amp; Sell Dorm</span><br />
            Essentials
          </h1>
          <p className={styles.sub}>
            Room2Room connects UCLA Bruins to buy, sell, and trade dorm
            supplies — furniture, bedding, electronics, kitchen gear, and more.
            Verified students only. <span className={styles.sun}>☀️</span>
          </p>

          <form className={styles.searchRow} onSubmit={handleSearch}>
            <div className={styles.searchBar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Search for anything — fridge, chair, ..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <button type="submit" className={styles.searchBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </div>
          </form>

          <div className={styles.pills}>
            {['Furniture', 'Bedding', 'Electronics', 'Kitchen', 'Books', 'Decor'].map((c) => (
              <button key={c} className={styles.pill} onClick={() => navigate(`/search?cat=${encodeURIComponent(c)}`)}>{c}</button>
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.trustCard}>
            <div className={styles.trustTop}>
              <span className={styles.trustTitle}>Trusted by Bruins 🐻</span>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>2,400+</span>
                <span className={styles.statLabel}>Active Listings</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>1,800+</span>
                <span className={styles.statLabel}>Verified Students</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>
                  <span className={styles.star}>⭐</span> 4.9
                </span>
                <span className={styles.statLabel}>Avg. Seller Rating</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>Free</span>
                <span className={styles.statLabel}>No Platform Fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
