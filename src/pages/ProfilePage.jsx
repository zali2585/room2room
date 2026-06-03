import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getAllListings, deleteUserListing } from '../utils/listingsStore';
import { conditionColor } from '../data/listings';
import { getReviewsFor, getAverageRating } from '../utils/reviews';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');

  const [, forceUpdate] = useState(0);
  const myListings = getAllListings().filter((l) => l.sellerEmail === user?.email);
  const myReviews = getReviewsFor(user?.email);
  const avgRating = getAverageRating(user?.email);

  const savedIds = (() => { try { return JSON.parse(localStorage.getItem('r2r_wishlist') || '[]'); } catch { return []; } })();
  const savedListings = getAllListings().filter((l) => savedIds.includes(l.id));
  const initials = user?.initials || '??';
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Bruin';

  const handleDelete = (id) => {
    deleteUserListing(id);
    forceUpdate((n) => n + 1);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.heroInfo}>
            <h1 className={styles.name}>{fullName}</h1>
            <p className={styles.sub}>
              {user?.dorm || 'UCLA'} &nbsp;·&nbsp; {user?.year || 'UCLA'} &nbsp;·&nbsp; UCLA
            </p>
            <div className={styles.verifiedRow}>
              <span className={styles.verifiedBadge}>⭐ Verified</span>
              <span className={styles.emailSub}>{user?.email}</span>
            </div>
          </div>
          <div className={styles.heroActions}>
            <button className={styles.editBtn} onClick={() => navigate('/post-listing')}>✏️ Post Item</button>
            <button className={styles.messageBtn} onClick={() => navigate('/messages')}>✉️ Messages</button>
          </div>
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}><span className={styles.statVal}>{myListings.length}</span><span className={styles.statLabel}>Active Listings</span></div>
        <div className={styles.statDivider} />
        <div className={styles.stat}><span className={styles.statVal}>{user?.email === 'jane@g.ucla.edu' ? 5 : 0}</span><span className={styles.statLabel}>Items Sold</span></div>
        <div className={styles.statDivider} />
        <div className={styles.stat}><span className={styles.statVal}>{avgRating ? `${avgRating} ⭐` : 'New ⭐'}</span><span className={styles.statLabel}>Rating</span></div>
        <div className={styles.statDivider} />
        <div className={styles.stat}><span className={styles.statVal} style={{ color: 'var(--blue)', fontSize: user?.dorm && user.dorm.length > 10 ? 13 : undefined }}>{user?.dorm || 'UCLA'}</span><span className={styles.statLabel}>Dorm</span></div>
        <div className={styles.statDivider} />
        <div className={styles.stat}><span className={styles.statVal} style={{ color: 'var(--blue)' }}>{user?.year || 'UCLA'}</span><span className={styles.statLabel}>Year</span></div>
      </div>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <p className={styles.sidebarTitle}>Account</p>
          <nav className={styles.sidebarNav}>
            <button className={`${styles.sidebarItem} ${activeTab === 'listings' ? styles.active : ''}`} onClick={() => setActiveTab('listings')}>📋 Active Listings</button>
            <button className={`${styles.sidebarItem} ${activeTab === 'sold'     ? styles.active : ''}`} onClick={() => setActiveTab('sold')}>✅ Sold Items</button>
            <button className={`${styles.sidebarItem} ${activeTab === 'saved'    ? styles.active : ''}`} onClick={() => setActiveTab('saved')}>❤️ Saved Items</button>
            <button className={`${styles.sidebarItem} ${activeTab === 'reviews'  ? styles.active : ''}`} onClick={() => setActiveTab('reviews')}>⭐ Reviews</button>
            <button className={`${styles.sidebarItem} ${styles.logout}`} onClick={handleLogout}>🚪 Log Out</button>
          </nav>
        </aside>

        <main className={styles.content}>
          {activeTab === 'listings' && (
            <>
              <div className={styles.contentHeader}>
                <h2 className={styles.contentTitle}>
                  {myListings.length > 0 ? `Your Listings (${myListings.length})` : 'Your Listings'}
                </h2>
                <Link to="/post-listing" className={styles.viewAll}>+ Post New Item</Link>
              </div>
              {myListings.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyIcon}>📦</p>
                  <p className={styles.emptyText}>You haven't posted any listings yet.</p>
                  <button className={styles.browseBtn} onClick={() => navigate('/post-listing')}>Post Your First Item</button>
                </div>
              ) : (
                <div className={styles.grid}>
                  {myListings.map((item) => (
                    <div key={item.id} className={styles.card} onClick={() => navigate(`/product/${item.id}`)}>
                      <div className={styles.cardImg} style={{ background: item.color }}>📷</div>
                      <div className={styles.cardBody}>
                        <p className={styles.cardTitle}>{item.title}</p>
                        <p className={styles.cardPrice} style={{ color: conditionColor[item.condition] || 'var(--blue)' }}>${item.price}</p>
                        <p className={styles.cardCondition}>{item.condition}</p>
                        <div className={styles.cardActions}>
                          <button className={styles.editCardBtn} onClick={(e) => { e.stopPropagation(); navigate('/post-listing'); }}>✏️ Edit</button>
                          <button className={styles.deleteCardBtn} onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>🗑 Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {activeTab === 'sold' && (
            <>
              <div className={styles.contentHeader}>
                <h2 className={styles.contentTitle}>
                  {user?.email === 'jane@g.ucla.edu' ? 'Sold Items (5)' : 'Sold Items'}
                </h2>
              </div>
              {user?.email !== 'jane@g.ucla.edu' ? (
                <div className={styles.emptyState}><p className={styles.emptyIcon}>📦</p><p className={styles.emptyText}>No sold items yet.</p></div>
              ) : (
                <div className={styles.grid}>
                  {[
                    { id: 's1', title: 'Noise-Cancelling Headphones', price: 35, color: '#e0e7ff', condition: 'Good', buyer: 'Alex B.', date: 'Apr 28' },
                    { id: 's2', title: 'Twin XL Comforter', price: 22, color: '#fce7f3', condition: 'Like New', buyer: 'Maya C.', date: 'Apr 20' },
                    { id: 's3', title: 'Calculus Textbook', price: 18, color: '#fef9c3', condition: 'Good', buyer: 'Sam K.', date: 'Apr 12' },
                    { id: 's4', title: 'Portable Bluetooth Speaker', price: 28, color: '#dcfce7', condition: 'Like New', buyer: 'Jordan W.', date: 'Mar 30' },
                    { id: 's5', title: 'Over-Door Organizer', price: 14, color: '#f0fdf4', condition: 'Good', buyer: 'Riley T.', date: 'Mar 18' },
                  ].map((item) => (
                    <div key={item.id} className={styles.card}>
                      <div className={styles.cardImg} style={{ background: item.color }}>📷</div>
                      <div className={styles.cardBody}>
                        <p className={styles.cardTitle}>{item.title}</p>
                        <p className={styles.cardPrice} style={{ color: conditionColor[item.condition] || 'var(--blue)' }}>${item.price}</p>
                        <p className={styles.cardCondition}>{item.condition}</p>
                        <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>Sold to {item.buyer} · {item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {activeTab === 'saved' && (
            <>
              <div className={styles.contentHeader}>
                <h2 className={styles.contentTitle}>
                  {savedListings.length > 0 ? `Saved Items (${savedListings.length})` : 'Saved Items'}
                </h2>
              </div>
              {savedListings.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyIcon}>❤️</p>
                  <p className={styles.emptyText}>No saved items yet.</p>
                  <button className={styles.browseBtn} onClick={() => navigate('/search')}>Browse Listings</button>
                </div>
              ) : (
                <div className={styles.grid}>
                  {savedListings.map((item) => (
                    <div key={item.id} className={styles.card} onClick={() => navigate(`/product/${item.id}`)}>
                      <div className={styles.cardImg} style={{ background: item.color }}>📷</div>
                      <div className={styles.cardBody}>
                        <p className={styles.cardTitle}>{item.title}</p>
                        <p className={styles.cardPrice} style={{ color: conditionColor[item.condition] || 'var(--blue)' }}>${item.price}</p>
                        <p className={styles.cardCondition}>{item.condition}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {activeTab === 'reviews' && (
            <>
              <div className={styles.contentHeader}>
                <h2 className={styles.contentTitle}>
                  Reviews {myReviews.length > 0 && `(${myReviews.length})`}
                </h2>
                {avgRating && <span style={{ fontWeight: 700, color: 'var(--blue)' }}>{avgRating} ⭐ avg</span>}
              </div>
              {myReviews.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyIcon}>⭐</p>
                  <p className={styles.emptyText}>No reviews yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {myReviews.map((r) => (
                    <div key={r.id} style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: 12, padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{r.reviewerInitials}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>{r.reviewerName}</p>
                          <p style={{ fontSize: 12, color: 'var(--gray-500)', margin: 0 }}>{r.date} · {r.itemTitle}</p>
                        </div>
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--gray-700)', fontSize: 14, lineHeight: 1.6 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
