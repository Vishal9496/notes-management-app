import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiFeather, FiArrowRight } from 'react-icons/fi';
import { loginUser } from '../services/auth';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { Spinner } from '../components/Loader';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  function validate() {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email.';
    if (!password) errs.password = 'Password is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await loginUser({ email: email.trim(), password });
      login(data);
      showToast('Login successful. Welcome back!', 'success');
      const dest = location.state?.from?.pathname || '/dashboard';
      navigate(dest, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
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
        <div className="auth-card__brand">
          <span className="auth-card__brand-icon"><FiFeather /></span>
          <span>Marginalia</span>
        </div>

        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">Pick up your notebook right where you left off.</p>

        {serverError && (
          <motion.div className="auth-card__error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {serverError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <div className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}>
              <FiMail />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="auth-field__error">{errors.email}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className={`auth-input ${errors.password ? 'auth-input--error' : ''}`}>
              <FiLock />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
              />
              <button type="button" className="auth-input__toggle" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span className="auth-field__error">{errors.password}</span>}
          </div>

          <div className="auth-row">
            <label className="auth-checkbox">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
          </div>

          <motion.button whileTap={{ scale: 0.97 }} type="submit" className="auth-submit" disabled={loading}>
            {loading ? <Spinner size={18} /> : <>Sign in <FiArrowRight /></>}
          </motion.button>
        </form>

        <p className="auth-card__footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
}
