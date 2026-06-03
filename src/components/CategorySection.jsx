import { Link } from 'react-router-dom';
import styles from './CategorySection.module.css';

const categories = [
  { name: 'Furniture', count: 340, icon: '🪑' },
  { name: 'Bedding', count: 210, icon: '🛏️' },
  { name: 'Kitchen', count: 175, icon: '🍳' },
  { name: 'Electronics', count: 320, icon: '💻' },
  { name: 'Decor', count: 270, icon: '🖼️' },
  { name: 'Books', count: 445, icon: '📚' },
  { name: 'Chairs', count: 130, icon: '🪑' },
  { name: 'Toiletries', count: 88, icon: '🧴' },
];

export default function CategorySection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>Shop by Category</h2>
          <p className={styles.sub}>Find exactly what you need for your dorm</p>
        </div>
        <div className={styles.grid}>
          {categories.map((cat) => (
            <Link key={cat.name} to="/search" className={styles.card}>
              <div className={styles.iconWrap}>
                <span className={styles.icon}>{cat.icon}</span>
              </div>
              <span className={styles.name}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
