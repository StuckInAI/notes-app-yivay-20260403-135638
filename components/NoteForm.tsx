'use client';

import { useState, useEffect } from 'react';
import type { Note } from './NotesApp';

interface NoteFormProps {
  editingNote: Note | null;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

export default function NoteForm({ editingNote, onSave, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editingNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    onSave(title.trim(), content.trim());
    if (!editingNote) {
      setTitle('');
      setContent('');
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h2>{editingNote ? '✏️ Edit Note' : '➕ New Note'}</h2>
      <div className="form-group">
        <label htmlFor="note-title">Title</label>
        <input
          id="note-title"
          type="text"
          className="form-input"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="form-group">
        <label htmlFor="note-content">Content</label>
        <textarea
          id="note-content"
          className="form-input"
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
      </div>
      <div className="form-actions">
        {editingNote && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!title.trim() && !content.trim()}
        >
          {editingNote ? 'Update Note' : 'Save Note'}
        </button>
      </div>
    </form>
  );
}
