import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { SkeletonGrid } from '../components/Loader';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../context/ToastContext';
import { fetchNotes, createNote, updateNote, deleteNote } from '../services/notes';
import './Dashboard.css';

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch {
      showToast('Could not load your notes.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const visibleNotes = useMemo(() => {
    let list = [...notes];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (n) => n.title?.toLowerCase().includes(q) || n.description?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      return sortOrder === 'newest' ? db - da : da - db;
    });
    return list;
  }, [notes, search, sortOrder]);

  function openCreateModal() {
    setEditingNote(null);
    setModalOpen(true);
  }

  function openEditModal(note) {
    setEditingNote(note);
    setModalOpen(true);
  }

  async function handleSave(payload) {
    setSaving(true);
    try {
      if (editingNote) {
        const updated = await updateNote(editingNote.id, payload);
        setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? { ...n, ...updated } : n)));
        showToast('Note updated.', 'success');
      } else {
        const created = await createNote(payload);
        setNotes((prev) => [created, ...prev]);
        showToast('Note added.', 'success');
      }
      setModalOpen(false);
    } catch {
      showToast('Something went wrong saving your note.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteNote(deleteTarget.id);
      setNotes((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      showToast('Note deleted.', 'success');
      setDeleteTarget(null);
    } catch {
      showToast('Could not delete that note.', 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="app-shell">
      <Navbar theme={theme} onToggleTheme={toggleTheme} onToggleSidebar={() => setSidebarOpen((s) => !s)} />

      <div className="dashboard">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          noteCount={notes.length}
        />

        <main className="dashboard__main">
          <div className="dashboard__toolbar">
            <div>
              <h1 className="dashboard__title">Your notes</h1>
              <p className="dashboard__subtitle">Everything you've jotted down, in one place.</p>
            </div>
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : visibleNotes.length === 0 ? (
            <EmptyState onCreate={openCreateModal} searchActive={!!search.trim()} />
          ) : (
            <motion.div layout className="dashboard__grid">
              <AnimatePresence mode="popLayout">
                {visibleNotes.map((note) => (
                  <NoteCard key={note.id} note={note} onEdit={openEditModal} onDelete={setDeleteTarget} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>

      <motion.button
        className="fab"
        onClick={openCreateModal}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        aria-label="Add note"
      >
        <FiPlus />
      </motion.button>

      <NoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialNote={editingNote}
        saving={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this note?"
        message={`"${deleteTarget?.title || ''}" will be gone for good. This can't be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
