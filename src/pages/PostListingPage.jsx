import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { postListing } from '../utils/listingsStore';
import styles from './PostListingPage.module.css';

const CATEGORIES = ['Furniture', 'Bedding', 'Electronics', 'Kitchen', 'Books', 'Decor', 'Toiletries', 'Clothing', 'Other'];
const CONDITIONS = ['Like New', 'Good', 'Fair', 'Poor'];
const MEETUP_OPTIONS = ['On Campus', 'Dorm Lobby', 'Off Campus', 'Buyer Decides'];
const STEPS = ['Photos', 'Details', 'Pricing', 'Review'];

export default function PostListingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [meetup, setMeetup] = useState('On Campus');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '', category: '', price: '', condition: 'Like New', description: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.title.trim()) errs.title    = 'Title is required.';
    if (!form.category)     errs.category = 'Please select a category.';
    return errs;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) errs.price = 'Enter a valid price.';
    return errs;
  };

  const handleNext = () => {
    if (step === 2) {
      const errs = validateStep2();
      if (Object.keys(errs).length) { setErrors(errs); return; }
    }
    if (step === 3) {
      const errs = validateStep3();
      if (Object.keys(errs).length) { setErrors(errs); return; }
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handlePublish = () => {
    const errs = { ...validateStep2(), ...validateStep3() };
    if (Object.keys(errs).length) { setErrors(errs); setStep(2); return; }

    postListing({
      title:          form.title.trim(),
      category:       form.category,
      price:          form.price,
      condition:      form.condition,
      description:    form.description.trim(),
      meetup,
      sellerEmail:    user.email,
      sellerName:     `${user.firstName} ${user.lastName[0]}.`,
      sellerInitials: user.initials,
      sellerDorm:     user.dorm,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.successWrap}>
          <div className={styles.successCard}>
            <div className={styles.successIconWrap}>
              <span className={styles.successIcon}>🎉</span>
            </div>
            <h2 className={styles.successTitle}>Listing Posted!</h2>
            <p className={styles.successSub}>Your item is now live for other Bruins to see.</p>

            <div className={styles.successItem}>
              <div className={styles.successThumb}>📷</div>
              <div className={styles.successItemInfo}>
                <p className={styles.successItemTitle}>{form.title}</p>
                <p className={styles.successItemPrice}>${Number(form.price).toFixed(2)}</p>
                <span className={styles.successItemBadge}>{form.condition}</span>
              </div>
            </div>

            <div className={styles.successActions}>
              <button className={styles.primaryBtn} onClick={() => navigate('/profile')}>View My Listings</button>
              <button className={styles.secondaryBtn} onClick={() => navigate('/search')}>Browse All Items</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Post a New Item</h1>
          <p className={styles.subtitle}>Fill in the details below to list your item for sale.</p>
        </div>

        {/* Step indicator */}
        <div className={styles.steps}>
          {STEPS.map((label, i) => {
            const num = i + 1;
            const done = num < step;
            const active = num === step;
            return (
              <div key={label} className={`${styles.step} ${active ? styles.stepActive : ''} ${done ? styles.stepDone : ''}`}>
                <div className={styles.stepCircle}>{done ? '✓' : num}</div>
                <span className={styles.stepLabel}>{label}</span>
                {i < STEPS.length - 1 && <div className={styles.stepLine} />}
              </div>
            );
          })}
        </div>

        {/* Step 1: Photos */}
        {step === 1 && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Photos</h2>
            <p className={styles.cardSub}>Add up to 8 photos. First photo is the cover.</p>
            <div className={styles.uploadZone}>
              <span className={styles.uploadIcon}>📷</span>
              <p className={styles.uploadText}>Drop photos here or click to upload</p>
              <p className={styles.uploadHint}>PNG, JPG up to 10MB each</p>
            </div>
            <div className={styles.thumbnails}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={styles.thumbEmpty} />
              ))}
            </div>
            <div className={styles.photoTips}>
              <p className={styles.tipsTitle}>📸 Photo Tips</p>
              <p className={styles.tipsText}>Use good lighting · Show any flaws clearly · Include all pieces · Multiple angles</p>
            </div>
            <div className={styles.navRow}>
              <span />
              <button className={styles.primaryBtn} onClick={handleNext}>Next: Details →</button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Item Details</h2>

            <div className={styles.field}>
              <label className={styles.label}>Title *</label>
              <input className={`${styles.input} ${errors.title ? styles.inputError : ''}`} name="title" value={form.title} onChange={handleChange} placeholder="e.g. IKEA Kallax Shelf, Twin XL Mattress Pad..." />
              {errors.title && <p className={styles.fieldError}>{errors.title}</p>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Category *</label>
              <div className={styles.selectWrap}>
                <select className={`${styles.select} ${errors.category ? styles.inputError : ''}`} name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select a category...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {errors.category && <p className={styles.fieldError}>{errors.category}</p>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.textarea} name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe your item — age, any damage, original price, why you're selling..." />
            </div>

            <div className={styles.navRow}>
              <button className={styles.backBtn} onClick={handleBack}>← Back</button>
              <button className={styles.primaryBtn} onClick={handleNext}>Next: Pricing →</button>
            </div>
          </div>
        )}

        {/* Step 3: Pricing */}
        {step === 3 && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Pricing &amp; Meetup</h2>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Price *</label>
                <div className={styles.priceWrap}>
                  <span className={styles.priceDollar}>$</span>
                  <input className={`${styles.priceInput} ${errors.price ? styles.inputError : ''}`} name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" />
                </div>
                {errors.price && <p className={styles.fieldError}>{errors.price}</p>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Condition</label>
                <div className={styles.selectWrap}>
                  <select className={styles.select} name="condition" value={form.condition} onChange={handleChange}>
                    {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Preferred Meetup Location</label>
              <div className={styles.meetupOptions}>
                {MEETUP_OPTIONS.map((opt) => (
                  <button key={opt} type="button" className={`${styles.meetupBtn} ${meetup === opt ? styles.meetupActive : ''}`} onClick={() => setMeetup(opt)}>{opt}</button>
                ))}
              </div>
            </div>

            <div className={styles.navRow}>
              <button className={styles.backBtn} onClick={handleBack}>← Back</button>
              <button className={styles.primaryBtn} onClick={handleNext}>Next: Review →</button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Review Your Listing</h2>
            <p className={styles.cardSub}>Make sure everything looks good before publishing.</p>

            <div className={styles.reviewBox}>
              <div className={styles.reviewThumb}>📷</div>
              <div className={styles.reviewDetails}>
                <div className={styles.reviewBadgeRow}>
                  {form.condition && <span className={styles.reviewBadge}>{form.condition}</span>}
                  {form.category && <span className={styles.reviewCat}>{form.category}</span>}
                </div>
                <p className={styles.reviewTitle}>{form.title || '(no title)'}</p>
                <p className={styles.reviewPrice}>${Number(form.price || 0).toFixed(2)}</p>
                {form.description && <p className={styles.reviewDesc}>{form.description}</p>}
              </div>
            </div>

            <div className={styles.reviewMeta}>
              <div className={styles.reviewMetaItem}>
                <span className={styles.reviewMetaLabel}>📍 Meetup</span>
                <span className={styles.reviewMetaVal}>{meetup}</span>
              </div>
              <div className={styles.reviewMetaItem}>
                <span className={styles.reviewMetaLabel}>📦 Condition</span>
                <span className={styles.reviewMetaVal}>{form.condition}</span>
              </div>
              <div className={styles.reviewMetaItem}>
                <span className={styles.reviewMetaLabel}>🏷️ Category</span>
                <span className={styles.reviewMetaVal}>{form.category || '—'}</span>
              </div>
            </div>

            <div className={styles.navRow}>
              <button className={styles.backBtn} onClick={handleBack}>← Back</button>
              <button className={styles.publishBtn} onClick={handlePublish}>🚀 Publish Listing</button>
            </div>
            <button className={styles.draftBtn} onClick={() => navigate('/profile')}>Save as Draft</button>
          </div>
        )}
      </div>
    </div>
  );
}
