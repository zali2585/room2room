import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, isUCLAEmail } from '../context/AuthContext';
import styles from './CreateAccountPage.module.css';

const DORMS = [
  'Hedrick Hall', 'Sproul Hall', 'Rieber Hall', 'Dykstra Hall',
  'Hitch Suites', 'Gayley Heights', 'Saxon Suites', 'De Neve',
  'Sunset Village', 'The Hill Apartments', 'Other',
];

const YEARS = ['Class of 2025', 'Class of 2026', 'Class of 2027', 'Class of 2028', 'Graduate Student'];

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirmPassword: '', dorm: '', year: '', agreed: false,
  });
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!isUCLAEmail(form.email)) {
      setError('Please use a @g.ucla.edu or @ucla.edu email address.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.dorm) { setError('Please select your dorm or housing.'); return; }
    if (!form.year) { setError('Please select your year.'); return; }
    const err = register({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      dorm: form.dorm,
      year: form.year,
    });
    if (err) { setError(err); return; }
    navigate('/');
  }

  function handleGoogleSignUp() {
    setError('Google sign-up is not available in demo mode. Use email and password.');
  }

  const steps = [
    { num: '1', title: 'Create your account', sub: 'Use your UCLA email', done: true },
    { num: '2', title: 'Verify your identity', sub: "We confirm you're a Bruin", done: false },
    { num: '3', title: 'Start buying & selling', sub: 'Browse or post instantly', done: false },
  ];

  return (
    <div className={styles.page}>
      {/* Left Panel */}
      <div className={styles.left}>
        <Link to="/" className={styles.brand}>
          <div className={styles.logoBox}>
            <span className={styles.logoText}>R2R</span>
          </div>
          <span className={styles.brandName}>Room2Room</span>
        </Link>

        <div className={styles.leftContent}>
          <h1 className={styles.headline}>
            Join the UCLA Dorm Marketplace.
          </h1>
          <p className={styles.subtext}>
            Connect with verified Bruins. Buy what you need, sell what you don't.
          </p>

          <div className={styles.steps}>
            {steps.map((step) => (
              <div key={step.num} className={styles.step}>
                <div className={`${styles.stepDot} ${step.done ? styles.stepDotDone : ''}`}>
                  {step.num}
                </div>
                <div>
                  <p className={styles.stepTitle}>{step.title}</p>
                  <p className={styles.stepSub}>{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative circles */}
        <div className={styles.circleTopRight} />
        <div className={styles.circleBottomLeft} />
      </div>

      {/* Right Panel */}
      <div className={styles.right}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Create your account</h2>
          <p className={styles.formSubtitle}>Start buying and selling with Bruins today.</p>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.googleBtn} type="button" onClick={handleGoogleSignUp}>
            🔑 Sign up with Google (.edu)
          </button>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>First Name</label>
                <input
                  className={styles.input}
                  type="text"
                  name="firstName"
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Last Name</label>
                <input
                  className={styles.input}
                  type="text"
                  name="lastName"
                  placeholder="Bruin"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>UCLA Email</label>
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="yourname@g.ucla.edu"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <input
                  className={styles.input}
                  type="password"
                  name="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Confirm Password</label>
                <input
                  className={styles.input}
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Dorm / Housing</label>
                <select
                  className={styles.select}
                  name="dorm"
                  value={form.dorm}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select your dorm...</option>
                  {DORMS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Year</label>
                <select
                  className={styles.select}
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                >
                  <option value="" disabled>Class of 2026 *</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.notice}>
              <span className={styles.noticeIcon}>🎓</span>
              <div>
                <p className={styles.noticeTitle}>UCLA email required — @ucla.edu or @g.ucla.edu</p>
                <p className={styles.noticeText}>Only verified UCLA students can join Room2Room</p>
              </div>
            </div>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="agreed"
                checked={form.agreed}
                onChange={handleChange}
                className={styles.checkbox}
                required
              />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>

            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submitBtn}>
              Create Account →
            </button>
          </form>

          <p className={styles.switchAuth}>
            Already have an account?{' '}
            <Link to="/login" className={styles.switchLink}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
