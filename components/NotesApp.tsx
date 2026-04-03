'use client';

import { useState, useEffect, useCallback } from 'react';
import NoteForm from './NoteForm';
import NoteCard from './NoteCard';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'notes-app-data';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored) as Note[]);
      }
    } catch {
      // ignore
    }
  }, []);

  const persistNotes = useCallback((updated: Note[]) => {
    setNotes(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, []);

  const handleSave = useCallback(
    (title: string, content: string) => {
      const now = new Date().toISOString();
      if (editingNote) {
        const updated = notes.map((n) =>
          n.id === editingNote.id ? { ...n, title, content, updatedAt: now } : n
        );
        persistNotes(updated);
        setEditingNote(null);
      } else {
        const newNote: Note = {
          id: generateId(),
          title,
          content,
          createdAt: now,
          updatedAt: now
        };
        persistNotes([newNote, ...notes]);
      }
    },
    [editingNote, notes, persistNotes]
  );

  const handleEdit = useCallback((note: Note) => {
    setEditingNote(note);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      persistNotes(notes.filter((n) => n.id !== id));
      if (editingNote?.id === id) setEditingNote(null);
    },
    [notes, persistNotes, editingNote]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingNote(null);
  }, []);

  const filteredNotes = notes.filter((note) => {
    const q = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q)
    );
  });

  if (!mounted) return null;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📝 Notes</h1>
        <p>Capture your thoughts, ideas, and more.</p>
      </header>

      <input
        type="text"
        className="search-bar"
        placeholder="🔍 Search notes by title or content..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search notes"
      />

      <NoteForm
        editingNote={editingNote}
        onSave={handleSave}
        onCancel={handleCancelEdit}
      />

      <div className="notes-header">
        <h2>Your Notes</h2>
        <span className="notes-count">{filteredNotes.length}</span>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🗒️</div>
          <p>
            {searchQuery
              ? 'No notes match your search.'
              : 'No notes yet. Create your first note above!'}
          </p>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              searchQuery={searchQuery}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
