import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import './Toast.css';

const ICONS = {
  success: <FiCheckCircle />,
  error: <FiXCircle />,
  info: <FiInfo />,
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-stack">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`toast toast--${t.type}`}
          >
            <span className="toast__icon">{ICONS[t.type]}</span>
            <span className="toast__message">{t.message}</span>
            <button className="toast__close" onClick={() => removeToast(t.id)} aria-label="Dismiss">
              <FiX />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
