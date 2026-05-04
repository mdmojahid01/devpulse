import { storage } from "./storage";

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "devpulse_notes";

export const noteStorage = {
  async getNotes(): Promise<Note[]> {
    return (await storage.get<Note[]>(STORAGE_KEY)) || [];
  },

  async saveNotes(notes: Note[]): Promise<void> {
    await storage.set(STORAGE_KEY, notes);
  },

  async addNote(title: string, content: string): Promise<Note> {
    const notes = await noteStorage.getNotes();
    const now = new Date().toISOString();
    const note: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };
    notes.unshift(note);
    await noteStorage.saveNotes(notes);
    return note;
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<void> {
    const notes = await noteStorage.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await noteStorage.saveNotes(notes);
    }
  },

  async deleteNote(id: string): Promise<void> {
    const notes = await noteStorage.getNotes();
    await noteStorage.saveNotes(notes.filter(n => n.id !== id));
  },

  async deleteAllNotes(): Promise<void> {
    await noteStorage.saveNotes([]);
  },
};
