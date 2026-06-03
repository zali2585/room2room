import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getListingById } from '../utils/listingsStore';
import styles from './PaymentPage.module.css';

const paymentMethods = [
  { id: 'cash', label: 'Cash (In-Person)', desc: 'Agree on cash payment at meetup — most popular!', icon: '💵' },
  { id: 'venmo', label: 'Venmo', desc: 'Send payment via Venmo before or at meetup', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Secure online payment via Stripe', icon: '💳' },
];

const steps = ['Product', 'Meetup', 'Payment', 'Confirm'];

const FALLBACK_ITEM = { id: 3, title: 'Mini Fridge 1.7cu ft', price: 80, condition: 'Good', meetup: 'Dorm Lobby or On Campus (flexible)', sellerEmail: 'alex@g.ucla.edu', seller: { name: 'Alex B.', initials: 'AB', rating: 4.9, dorm: 'De Neve Hall' } };

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [payment, setPayment] = useState('cash');
  const [message, setMessage] = useState('');

  const itemId = location.state?.itemId;
  const item = (itemId && getListingById(itemId)) || FALLBACK_ITEM;

  const paymentLabel = paymentMethods.find((p) => p.id === payment)?.label || 'Cash at meetup';

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <Link to={`/product/${item.id}`} className={styles.backLink}>← Back to listing</Link>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.steps}>
          {steps.map((step, i) => {
            const done = i < 2;
            const active = i === 2;
            return (
              <div key={step} className={`${styles.step} ${active ? styles.stepActive : ''} ${done ? styles.stepDone : ''}`}>
                <div className={styles.stepCircle}>{done ? '✓' : i + 1}</div>
                <span className={styles.stepLabel}>{step}</span>
                {i < steps.length - 1 && <div className={styles.stepLine} />}
              </div>
            );
          })}
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.leftCol}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Item Summary</h3>
              <div className={styles.itemRow}>
                <div className={styles.itemImg}>📷</div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.title}</p>
                  <p className={styles.itemMeta}>Condition: {item.condition} &nbsp;·&nbsp; Seller: {item.seller.name} &nbsp;·&nbsp; {item.seller.dorm}</p>
                </div>
                <span className={styles.itemPrice}>${item.price}.00</span>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Payment Method</h3>
              {paymentMethods.map((pm) => (
                <div key={pm.id} className={`${styles.paymentOption} ${payment === pm.id ? styles.paymentSelected : ''}`} onClick={() => setPayment(pm.id)}>
                  <span className={styles.pmIcon}>{pm.icon}</span>
                  <div className={styles.pmText}>
                    <p className={styles.pmLabel}>{pm.label}</p>
                    <p className={styles.pmDesc}>{pm.desc}</p>
                  </div>
                  <div className={`${styles.radio} ${payment === pm.id ? styles.radioSelected : ''}`} />
                </div>
              ))}
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Meetup Details</h3>
              <div className={styles.meetupRow}>
                <div className={styles.meetupField}>
                  <p className={styles.meetupFieldLabel}>📍 Location</p>
                  <p className={styles.meetupFieldVal}>{item.meetup}</p>
                </div>
                <div className={styles.meetupField}>
                  <p className={styles.meetupFieldLabel}>🕐 Proposed Time</p>
                  <p className={styles.meetupFieldVal}>To be arranged with seller</p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>💬 Message to seller (optional)</h3>
              <textarea className={styles.msgInput} value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Say hi, ask questions, or confirm the meetup..." />
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.summaryCard}>
              <h3 className={styles.cardTitle}>Order Summary</h3>
              <div className={styles.summaryRow}>
                <span>Item Price</span>
                <span>${item.price}.00</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Platform Fee</span>
                <span className={styles.free}>FREE 🎉</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Buyer Protection</span>
                <span className={styles.included}>Included ✓</span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total Due</span>
                <span className={styles.totalVal}>${item.price}.00</span>
              </div>

              <div className={styles.sellerBox}>
                <p className={styles.sellerBoxLabel}>Seller</p>
                <div className={styles.sellerRow}>
                  <div className={styles.sellerAvatar}>{item.seller.initials}</div>
                  <div>
                    <p className={styles.sellerName}>{item.seller.name}</p>
                    <p className={styles.sellerMeta}>⭐ {item.seller.rating} · Verified Student</p>
                  </div>
                </div>
                <div className={styles.s2sNote}>
                  <span className={styles.s2sIcon}>🎓</span>
                  <div>
                    <p className={styles.s2sTitle}>Student-to-student transaction</p>
                    <p className={styles.s2sDesc}>Both parties are verified UCLA students</p>
                  </div>
                </div>
              </div>

              <button
                className={styles.confirmBtn}
                onClick={() => navigate('/order-confirmation', { state: { item, paymentLabel } })}
              >
                ✅ Confirm &amp; Request Meetup
              </button>
              <p className={styles.confirmNote}>{item.seller.name} will be notified and can confirm or suggest a different time.</p>
              <button className={styles.cancelLink} onClick={() => navigate(-1)}>Cancel and go back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
