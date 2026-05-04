import { useState, useEffect, useCallback } from "react";
import { noteStorage } from "@/services/noteStorage";
import type { Note } from "@/services/noteStorage";

type UseNotesReturn = {
  notes: Note[];
  loading: boolean;
  error: string | null;
  addNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  deleteAllNotes: () => Promise<void>;
};

export function useNotes(): UseNotesReturn {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNotes(await noteStorage.getNotes());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const addNote = useCallback(
    async (title: string, content: string) => {
      try {
        await noteStorage.addNote(title, content);
        await loadNotes();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add note");
      }
    },
    [loadNotes],
  );

  const updateNote = useCallback(
    async (id: string, updates: Partial<Note>) => {
      try {
        await noteStorage.updateNote(id, updates);
        await loadNotes();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update note");
      }
    },
    [loadNotes],
  );

  const deleteNote = useCallback(
    async (id: string) => {
      try {
        await noteStorage.deleteNote(id);
        await loadNotes();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete note");
      }
    },
    [loadNotes],
  );

  const deleteAllNotes = useCallback(async () => {
    try {
      await noteStorage.deleteAllNotes();
      await loadNotes();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete all notes",
      );
    }
  }, [loadNotes]);

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    deleteAllNotes,
  };
}
