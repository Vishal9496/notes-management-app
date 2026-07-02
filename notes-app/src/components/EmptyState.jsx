import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import './EmptyState.css';

export default function EmptyState({ onCreate, searchActive }) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <svg className="empty-state__illustration" width="140" height="140" viewBox="0 0 140 140" fill="none">
        <rect x="30" y="20" width="80" height="100" rx="10" fill="var(--paper)" stroke="var(--rule)" strokeWidth="2" />
        <line x1="44" y1="45" x2="96" y2="45" stroke="var(--rule)" strokeWidth="3" strokeLinecap="round" />
        <line x1="44" y1="60" x2="96" y2="60" stroke="var(--rule)" strokeWidth="3" strokeLinecap="round" />
        <line x1="44" y1="75" x2="78" y2="75" stroke="var(--rule)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="98" cy="98" r="22" fill="var(--accent)" />
        <line x1="98" y1="88" x2="98" y2="108" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <line x1="88" y1="98" x2="108" y2="98" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>

      {searchActive ? (
        <>
          <h3>No notes match that</h3>
          <p>Try a different search term, or clear it to see everything.</p>
        </>
      ) : (
        <>
          <h3>Your notebook is empty</h3>
          <p>Create your first note and start building your archive.</p>
          <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }} className="empty-state__btn" onClick={onCreate}>
            <FiPlus /> Create your first note
          </motion.button>
        </>
      )}
    </motion.div>
  );
}
