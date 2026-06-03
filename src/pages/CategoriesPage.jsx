import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllListings } from '../utils/listingsStore';
import styles from './CategoriesPage.module.css';

const CATEGORIES = [
  { name: 'Furniture',   icon: '🪑', color: '#e0e7ff' },
  { name: 'Bedding',     icon: '🛏️', color: '#dcfce7' },
  { name: 'Electronics', icon: '💻', color: '#dbeafe' },
  { name: 'Kitchen',     icon: '🍳', color: '#fce7f3' },
  { name: 'Books',       icon: '📚', color: '#fef9c3' },
  { name: 'Decor',       icon: '🖼️', color: '#f0fdf4' },
  { name: 'Toiletries',  icon: '🧴', color: '#f3e8ff' },
  { name: 'Clothing',    icon: '👕', color: '#fff7ed' },
];

export default function CategoriesPage() {
  const navigate = useNavigate();
  const allListings = getAllListings();

  const countFor = (cat) => allListings.filter((l) => l.category === cat).length;

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Shop by Category</h1>
          <p className={styles.sub}>Find exactly what you need for your dorm room</p>
        </div>

        <div className={styles.grid}>
          {CATEGORIES.map((cat) => {
            const count = countFor(cat.name);
            return (
              <button
                key={cat.name}
                className={styles.card}
                style={{ '--card-color': cat.color }}
                onClick={() => navigate(`/search?cat=${encodeURIComponent(cat.name)}`)}
              >
                <div className={styles.iconWrap} style={{ background: cat.color }}>
                  <span className={styles.icon}>{cat.icon}</span>
                </div>
                <span className={styles.name}>{cat.name}</span>
                <span className={styles.count}>{count} listing{count !== 1 ? 's' : ''}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
