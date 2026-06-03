import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, isUCLAEmail } from '../context/AuthContext';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const clearError = () => { if (error) setError(''); };

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!isUCLAEmail(email)) {
      setError('Only @g.ucla.edu or @ucla.edu emails are allowed.');
      return;
    }
    const err = login(email, password);
    if (err) { setError(err); return; }
    navigate('/');
  }

  function handleGoogleSignIn() {
    setError('Google sign-in is not available in demo mode. Use email and password.');
  }

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
            Buy &amp; Sell Dorm Essentials with Fellow Bruins.
          </h1>
          <p className={styles.subtext}>
            Join thousands of UCLA students exchanging furniture, bedding,
            electronics, and more — all for free.
          </p>

          <div className={styles.socialProof}>
            <div className={styles.avatarRow}>
              {['E', 'M', 'K', 'J', 'A', 'T'].map((letter, i) => (
                <div key={i} className={styles.avatar} style={{ zIndex: 6 - i }}>
                  {letter}
                </div>
              ))}
            </div>
            <div className={styles.stats}>
              <p className={styles.statCount}>2,400+ Bruins already on Room2Room</p>
              <p className={styles.statRating}>
                <span className={styles.stars}>★★★★★</span> 4.9/5 from students
              </p>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className={styles.circleTopRight} />
        <div className={styles.circleBottomLeft} />
      </div>

      {/* Right Panel */}
      <div className={styles.right}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Welcome back 👋</h2>
          <p className={styles.formSubtitle}>Sign in to your Bruin account</p>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.googleBtn} type="button" onClick={handleGoogleSignIn}>
            🔑 Continue with Google (.edu)
          </button>

          <div className={styles.divider}>
            <span>or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>UCLA Email</label>
              <input
                className={styles.input}
                type="email"
                placeholder="yourname@g.ucla.edu"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                required
              />
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Password</label>
                </div>
              <input
                className={styles.input}
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                required
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submitBtn}>
              Sign In
            </button>
          </form>

          <p className={styles.switchAuth}>
            Don't have an account?{' '}
            <Link to="/create-account" className={styles.switchLink}>
              Create a free account →
            </Link>
          </p>

          {/* <div className={styles.notice}>
            <span className={styles.noticeIcon}>🎓</span>
            <div>
              <p className={styles.noticeTitle}>Demo accounts available</p>
              <p className={styles.noticeText}>
                Try <strong>jane@g.ucla.edu</strong> or <strong>alex@g.ucla.edu</strong> with password <strong>password123</strong>
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
