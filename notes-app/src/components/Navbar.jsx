import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiLogOut, FiFeather, FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import './Navbar.css';

export default function Navbar({ theme, onToggleTheme, onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    showToast('Logged out. See you soon.', 'info');
    navigate('/login');
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__icon-btn navbar__hamburger" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <FiMenu />
        </button>
        <div className="navbar__brand">
          <span className="navbar__brand-icon"><FiFeather /></span>
          <span className="navbar__brand-text">Marginalia</span>
        </div>
      </div>

      <div className="navbar__right">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="navbar__icon-btn"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </motion.button>

        <button className="navbar__avatar" onClick={() => navigate('/profile')} title={user?.name || 'Profile'}>
          {initials}
        </button>

        <motion.button whileTap={{ scale: 0.94 }} className="navbar__logout" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </motion.button>
      </div>
    </header>
  );
}
