import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiUser, FiLogOut } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../context/ToastContext';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  function handleLogout() {
    logout();
    showToast('Logged out. See you soon.', 'info');
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <Navbar theme={theme} onToggleTheme={toggleTheme} onToggleSidebar={() => {}} />

      <div className="profile-page">
        <button className="profile-back" onClick={() => navigate('/dashboard')}>
          <FiArrowLeft /> Back to notes
        </button>

        <motion.div
          className="profile-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="profile-avatar">{initials}</div>
          <h1>{user?.name || 'Your account'}</h1>

          <div className="profile-detail">
            <FiUser />
            <div>
              <span className="profile-detail__label">Name</span>
              <span className="profile-detail__value">{user?.name || '—'}</span>
            </div>
          </div>

          <div className="profile-detail">
            <FiMail />
            <div>
              <span className="profile-detail__label">Email</span>
              <span className="profile-detail__value">{user?.email || '—'}</span>
            </div>
          </div>

          <button className="profile-logout" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </motion.div>
      </div>
    </div>
  );
}
