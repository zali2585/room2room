import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllListings } from '../utils/listingsStore';
import { conditionColor, conditionBg } from '../data/listings';
import styles from './SearchResultsPage.module.css';

const ALL_CATEGORIES = ['Furniture', 'Bedding', 'Electronics', 'Kitchen', 'Books', 'Decor', 'Toiletries'];
const CONDITIONS = ['Any', 'Like New', 'Good', 'Fair'];

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get('q') || '';
  const urlCat   = searchParams.get('cat') || '';

  const [query, setQuery] = useState(urlQuery);
  const [selectedCategories, setSelectedCategories] = useState(urlCat ? [urlCat] : []);
  const [condition, setCondition] = useState('Any');
  const [maxPrice, setMaxPrice] = useState(200);
  const [sortBy, setSortBy] = useState('Most Recent');

  useEffect(() => {
    setQuery(urlQuery);
    if (urlCat) setSelectedCategories([urlCat]);
  }, [urlQuery, urlCat]);

  const toggleCategory = (cat) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (query.trim()) params.q = query.trim();
    setSearchParams(params);
    setSelectedCategories([]);
  };

  const filtered = getAllListings().filter((item) => {
    const q = urlQuery.toLowerCase();
    const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
    const matchesCat   = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const matchesCond  = condition === 'Any' || item.condition === condition;
    const matchesPrice = item.price <= maxPrice;
    return matchesQuery && matchesCat && matchesCond && matchesPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    return b.id - a.id;
  });

  const clearFilters = () => {
    setSelectedCategories([]);
    setCondition('Any');
    setMaxPrice(200);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.searchBanner}>
        <div className={styles.searchBannerInner}>
          <form className={styles.searchBarWrap} onSubmit={handleSearch}>
            <div className={styles.searchBar}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                className={styles.searchInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for dorm supplies..."
              />
            </div>
            <button type="submit" className={styles.searchBtn}>Search</button>
          </form>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.resultsHeader}>
          <p className={styles.resultsCount}>
            {sorted.length} result{sorted.length !== 1 ? 's' : ''}
            {urlQuery ? ` for "${urlQuery}"` : urlCat ? ` in ${urlCat}` : ''}
          </p>
          <div className={styles.sortWrap}>
            <span className={styles.sortLabel}>Sort by:</span>
            <select className={styles.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option>Most Recent</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className={styles.mainGrid}>
          <aside className={styles.filters}>
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Category</h3>
              {ALL_CATEGORIES.map((cat) => (
                <label key={cat} className={styles.checkLabel}>
                  <input type="checkbox" className={styles.checkbox} checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} />
                  <span className={`${styles.checkBox} ${selectedCategories.includes(cat) ? styles.checkBoxActive : ''}`} />
                  <span>{cat}</span>
                </label>
              ))}
            </div>

            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Max Price: ${maxPrice}</h3>
              <input type="range" className={styles.slider} min="0" max="200" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
              <p className={styles.priceRange}>$0 — ${maxPrice}</p>
            </div>

            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Condition</h3>
              <div className={styles.conditionPills}>
                {CONDITIONS.map((c) => (
                  <button key={c} className={`${styles.condPill} ${condition === c ? styles.condPillActive : ''}`} onClick={() => setCondition(c)}>{c}</button>
                ))}
              </div>
            </div>

            <button className={styles.clearBtn} onClick={clearFilters}>Clear all filters</button>
          </aside>

          <div className={styles.resultsGrid}>
            {sorted.length === 0 ? (
              <p className={styles.noResults}>No items match your search.</p>
            ) : sorted.map((item) => (
              <div key={item.id} className={styles.card} onClick={() => navigate(`/product/${item.id}`)}>
                <div className={styles.cardImg} style={{ background: item.color }}>
                  <span className={styles.condBadge} style={{ background: conditionBg[item.condition], color: conditionColor[item.condition] }}>
                    {item.condition}
                  </span>
                  📷
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardTitle}>{item.title}</p>
                  <p className={styles.cardPrice} style={{ color: conditionColor[item.condition] || 'var(--blue)' }}>${item.price}</p>
                  <p className={styles.cardSeller}>by {item.seller.name}</p>
                  <div className={styles.cardActions}>
                    <button className={styles.viewBtn} onClick={(e) => { e.stopPropagation(); navigate(`/product/${item.id}`); }}>
                      View Item →
                    </button>
                    <button className={styles.saveBtn} onClick={(e) => e.stopPropagation()}>♡</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
