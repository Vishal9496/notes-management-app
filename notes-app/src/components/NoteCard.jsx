import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiClock } from "react-icons/fi";
import "./NoteCard.css";

function formatDate(dateStr) {
  if (!dateStr) return "";

  const d = new Date(dateStr);

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NoteCard({ note, onEdit, onDelete }) {
  const wasEdited =
    note.updatedAt && note.createdAt && note.updatedAt !== note.createdAt;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 26,
      }}
      className="note-card"
    >
      <div className="note-card__rule" />

      <h3 className="note-card__title">{note.title}</h3>

      <p className="note-card__preview">{note.content}</p>

      <div className="note-card__footer">
        <span className="note-card__date">
          <FiClock />
          {wasEdited
            ? `Edited ${formatDate(note.updatedAt)}`
            : formatDate(note.createdAt)}
        </span>

        <div className="note-card__actions">
          <button
            className="note-card__btn"
            onClick={() => onEdit(note)}
            aria-label="Edit note"
          >
            <FiEdit2 />
          </button>

          <button
            className="note-card__btn note-card__btn--danger"
            onClick={() => onDelete(note)}
            aria-label="Delete note"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
