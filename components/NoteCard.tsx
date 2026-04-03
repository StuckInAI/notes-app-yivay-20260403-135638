'use client';

import type { Note } from './NotesApp';

interface NoteCardProps {
  note: Note;
  searchQuery: string;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return iso;
  }
}

export default function NoteCard({ note, searchQuery, onEdit, onDelete }: NoteCardProps) {
  const handleDelete = () => {
    if (window.confirm('Delete this note?')) {
      onDelete(note.id);
    }
  };

  return (
    <div className="note-card">
      <div className="note-card-title">
        {highlight(note.title || 'Untitled', searchQuery)}
      </div>
      <div className="note-card-body">
        {highlight(note.content, searchQuery)}
      </div>
      <div className="note-card-date">
        {note.updatedAt !== note.createdAt ? 'Updated' : 'Created'}:{' '}
        {formatDate(note.updatedAt)}
      </div>
      <div className="note-card-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onEdit(note)}
          aria-label="Edit note"
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
          aria-label="Delete note"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
