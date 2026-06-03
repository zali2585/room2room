import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { addReview } from '../utils/reviews';
import styles from './OrderConfirmationPage.module.css';

const FALLBACK = {
  item: { id: 3, title: 'Mini Fridge 1.7cu ft', price: 80, meetup: 'Dorm Lobby or On Campus (flexible)', sellerEmail: 'alex@g.ucla.edu', seller: { name: 'Alex B.', initials: 'AB' } },
  paymentLabel: 'Cash at meetup',
};

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [hovered, setHovered] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const { item, paymentLabel } = location.state || FALLBACK;
  const orderId = `R2R-${item.id}-${Date.now().toString().slice(-6)}`;

  const meetupDetails = [
    { label: '📦 Item', value: `${item.title} — $${item.price}.00` },
    { label: '👤 Seller', value: `${item.seller.name} (Verified)` },
    { label: '📍 Location', value: item.meetup },
    { label: '🕐 Proposed Time', value: 'To be arranged with seller' },
    { label: '💵 Payment', value: paymentLabel },
  ];

  const handleSubmitReview = () => {
    if (!rating) return;
    addReview({
      subjectEmail: item.sellerEmail,
      reviewerName: user ? `${user.firstName} ${user.lastName[0]}.` : 'Anonymous',
      reviewerInitials: user?.initials || '??',
      rating,
      comment: comment.trim(),
      itemTitle: item.title,
    });
    setReviewSubmitted(true);
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successBanner}>
            <div className={styles.checkCircle}>✓</div>
          </div>
          <div className={styles.body}>
            <h1 className={styles.title}>Request Sent! 🎉</h1>
            <p className={styles.desc}>Your meetup request has been sent to {item.seller.name}.</p>
            <p className={styles.desc}>You&apos;ll get an email at <strong>{user?.email || 'yourname@g.ucla.edu'}</strong> once they confirm.</p>

            <div className={styles.detailsBox}>
              <h3 className={styles.detailsTitle}>Meetup Details</h3>
              {meetupDetails.map((d) => (
                <div key={d.label} className={styles.detailRow}>
                  <span className={styles.detailLabel}>{d.label}</span>
                  <span className={styles.detailValue}>{d.value}</span>
                </div>
              ))}
            </div>

            <div className={styles.rateBox}>
              <p className={styles.rateTitle}>⭐ Rate your experience after the meetup</p>
              <p className={styles.rateSubtitle}>Leaving reviews builds trust in the Bruin community!</p>
              {reviewSubmitted ? (
                <p style={{ color: 'var(--blue)', fontWeight: 700, marginTop: 12 }}>Thanks for your review! ✓</p>
              ) : (
                <>
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className={styles.star}
                        style={{ cursor: 'pointer', color: n <= (hovered || rating) ? '#f59e0b' : '#d1d5db', fontSize: 28 }}
                        onMouseEnter={() => setHovered(n)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(n)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  {rating > 0 && (
                    <>
                      <textarea
                        style={{ width: '100%', marginTop: 12, padding: '10px 12px', border: '1.5px solid var(--gray-200)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                        rows={3}
                        placeholder="Share your experience with this seller..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button
                        style={{ marginTop: 10, padding: '10px 24px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                        onClick={handleSubmitReview}
                      >
                        Submit Review
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            <button className={styles.msgBtn} onClick={() => navigate('/messages', { state: { toEmail: item.sellerEmail, itemId: item.id } })}>💬 Open Message Thread with {item.seller.name}</button>
            <button className={styles.homeBtn} onClick={() => navigate('/')}>🏠 Back to Home</button>

            <p className={styles.orderId}>Order #{orderId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
