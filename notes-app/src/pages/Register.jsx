import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiFeather, FiCheckCircle } from 'react-icons/fi';
import { registerUser } from '../services/auth';
import { useToast } from '../context/ToastContext';
import { Spinner } from '../components/Loader';
import './Auth.css';

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['#b3462c', '#c97a3c', '#d99a3d', '#7a9a4c', '#2f6f4e'];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const strength = useMemo(() => getStrength(password), [password]);

  function validate() {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required.';
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email.';
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 8) errs.password = 'Use at least 8 characters.';
    if (confirmPassword !== password) errs.confirmPassword = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser({ name: name.trim(), email: email.trim(), password });
      setSuccess(true);
      showToast('Registration successful. Please log in.', 'success');
      setTimeout(() => navigate('/login'), 1400);
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not create account. Try a different email.';
      setServerError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <motion.div className="auth-bg__blob auth-bg__blob--1" animate={{ y: [0, 30, 0], x: [0, 20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="auth-bg__blob auth-bg__blob--2" animate={{ y: [0, -24, 0], x: [0, -18, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="auth-bg__lines" />
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              className="auth-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="auth-success__icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
              >
                <FiCheckCircle />
              </motion.div>
              <h2>Account created</h2>
              <p>Taking you to the login page...</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="auth-card__brand">
                <span className="auth-card__brand-icon"><FiFeather /></span>
                <span>Marginalia</span>
              </div>

              <h1 className="auth-card__title">Create your account</h1>
              <p className="auth-card__subtitle">Start your own notebook in under a minute.</p>

              {serverError && (
                <motion.div className="auth-card__error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {serverError}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                <div className="auth-field">
                  <label htmlFor="name">Full name</label>
                  <div className={`auth-input ${errors.name ? 'auth-input--error' : ''}`}>
                    <FiUser />
                    <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" autoComplete="name" />
                  </div>
                  {errors.name && <span className="auth-field__error">{errors.name}</span>}
                </div>

                <div className="auth-field">
                  <label htmlFor="reg-email">Email</label>
                  <div className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}>
                    <FiMail />
                    <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
                  </div>
                  {errors.email && <span className="auth-field__error">{errors.email}</span>}
                </div>

                <div className="auth-field">
                  <label htmlFor="reg-password">Password</label>
                  <div className={`auth-input ${errors.password ? 'auth-input--error' : ''}`}>
                    <FiLock />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                    />
                    <button type="button" className="auth-input__toggle" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility">
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {password && (
                    <div className="strength-meter">
                      <div className="strength-meter__bars">
                        {[0, 1, 2, 3].map((i) => (
                          <span
                            key={i}
                            className="strength-meter__bar"
                            style={{ background: i < strength ? STRENGTH_COLORS[strength] : 'var(--rule)' }}
                          />
                        ))}
                      </div>
                      <span className="strength-meter__label" style={{ color: STRENGTH_COLORS[strength] }}>
                        {STRENGTH_LABELS[strength]}
                      </span>
                    </div>
                  )}
                  {errors.password && <span className="auth-field__error">{errors.password}</span>}
                </div>

                <div className="auth-field">
                  <label htmlFor="confirm-password">Confirm password</label>
                  <div className={`auth-input ${errors.confirmPassword ? 'auth-input--error' : ''}`}>
                    <FiLock />
                    <input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                    />
                  </div>
                  {errors.confirmPassword && <span className="auth-field__error">{errors.confirmPassword}</span>}
                </div>

                <motion.button whileTap={{ scale: 0.97 }} type="submit" className="auth-submit" disabled={loading}>
                  {loading ? <Spinner size={18} /> : 'Create account'}
                </motion.button>
              </form>

              <p className="auth-card__footer">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
