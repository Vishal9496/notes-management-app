import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { Spinner } from './Loader';
import './NoteModal.css';

const MAX_TITLE = 80;
const MAX_CONTENT = 1000;

export default function NoteModal({
  open,
  onClose,
  onSave,
  initialNote,
  saving,
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setTitle(initialNote?.title || '');
      setContent(initialNote?.content || '');
      setErrors({});
    }
  }, [open, initialNote]);

  function validate() {
    const errs = {};

    if (!title.trim()) {
      errs.title = 'Give your note a title.';
    }

    if (!content.trim()) {
      errs.content = "Don't leave the note empty.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 30,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <h2>{initialNote ? 'Edit Note' : 'New Note'}</h2>

              <button
                className="modal__close"
                onClick={onClose}
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal__form">
              <div className="modal__field">
                <label htmlFor="note-title">Title</label>

                <input
                  id="note-title"
                  value={title}
                  maxLength={MAX_TITLE}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="A memorable title"
                  autoFocus
                />

                <div className="modal__field-footer">
                  {errors.title ? (
                    <span className="modal__error">{errors.title}</span>
                  ) : (
                    <span />
                  )}

                  <span className="modal__counter">
                    {title.length}/{MAX_TITLE}
                  </span>
                </div>
              </div>

              <div className="modal__field">
                <label htmlFor="note-content">Content</label>

                <textarea
                  id="note-content"
                  value={content}
                  maxLength={MAX_CONTENT}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note..."
                  rows={7}
                />

                <div className="modal__field-footer">
                  {errors.content ? (
                    <span className="modal__error">{errors.content}</span>
                  ) : (
                    <span />
                  )}

                  <span className="modal__counter">
                    {content.length}/{MAX_CONTENT}
                  </span>
                </div>
              </div>

              <div className="modal__actions">
                <button
                  type="button"
                  className="modal__btn modal__btn--ghost"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal__btn modal__btn--primary"
                  disabled={saving}
                >
                  {saving ? (
                    <Spinner size={16} />
                  ) : initialNote ? (
                    'Save Changes'
                  ) : (
                    'Add Note'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}