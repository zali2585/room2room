import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const categories = ['Furniture', 'Bedding', 'Electronics', 'Kitchen', 'Books', 'Decor', 'Toiletries'];

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoBox}>R2R</span> Room2Room
          </Link>
          <div className={styles.links}>
            <Link to="/search">Browse</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/post-listing">Sell an Item</Link>
          </div>
        </div>

        <div className={styles.center}>
          <form className={styles.searchBar} onSubmit={handleSearch}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search for dorm supplies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>

        <div className={styles.right}>
          {user ? (
            <>
              <Link to="/messages" className={styles.msgIcon} title="Messages">💬</Link>
              <Link to="/profile" className={styles.avatar} title={`${user.firstName} ${user.lastName}`}>
                {user.initials}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.login}>Log In</Link>
              <Link to="/create-account" className={styles.getStarted}>Get Started</Link>
            </>
          )}
        </div>
      </nav>

      <div className={styles.categoryBar}>
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/search?cat=${encodeURIComponent(cat)}`}
            className={styles.catLink}
          >
            {cat}
          </Link>
        ))}
      </div>
    </header>
  );
}
