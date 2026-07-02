import { motion, AnimatePresence } from 'framer-motion';
import { FiBookOpen, FiClock, FiArrowUp, FiArrowDown, FiX } from 'react-icons/fi';
import './Sidebar.css';

export default function Sidebar({ open, onClose, sortOrder, onSortChange, noteCount }) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="sidebar__scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <span className="sidebar__title">Your Notebook</span>
          <button className="sidebar__close" onClick={onClose} aria-label="Close sidebar"><FiX /></button>
        </div>

        <div className="sidebar__stat">
          <FiBookOpen />
          <div>
            <strong>{noteCount}</strong>
            <span>{noteCount === 1 ? 'note' : 'notes'} on the shelf</span>
          </div>
        </div>

        <div className="sidebar__section">
          <p className="sidebar__label">Sort by</p>
          <button
            className={`sidebar__option ${sortOrder === 'newest' ? 'sidebar__option--active' : ''}`}
            onClick={() => onSortChange('newest')}
          >
            <FiArrowDown /> Newest first
          </button>
          <button
            className={`sidebar__option ${sortOrder === 'oldest' ? 'sidebar__option--active' : ''}`}
            onClick={() => onSortChange('oldest')}
          >
            <FiArrowUp /> Oldest first
          </button>
        </div>

        <div className="sidebar__footer">
          <FiClock />
          <span>Auto-saved to your account</span>
        </div>
      </aside>
    </>
  );
}
