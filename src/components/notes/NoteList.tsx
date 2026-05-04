import { useState, useMemo, useCallback } from "react";
import { Drawer } from "@heroui/react";
import { useNotes } from "@/hooks/useNotes";
import { scoreMatch } from "@/lib/noteUtils";
import NoteListView from "@/components/notes/NoteListView";
import NoteDetailView from "@/components/notes/NoteDetailView";
import NoteEditView from "@/components/notes/NoteEditView";
import type { Note } from "@/services/noteStorage";

type View =
  | { type: "list" }
  | { type: "detail"; note: Note }
  | { type: "edit"; note: Note }
  | { type: "create" };

type NoteListProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function NoteList({
  isOpen,
  onOpenChange,
}: Readonly<NoteListProps>) {
  const {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    deleteAllNotes,
  } = useNotes();
  const [view, setView] = useState<View>({ type: "list" });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return notes;
    return notes
      .map(n => ({ note: n, score: scoreMatch(n, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ note }) => note);
  }, [notes, searchQuery]);

  // Bug #1 fix: always derive the displayed note from the live notes array
  // so detail view reflects updates immediately after an edit
  const liveDetailNote = useMemo(() => {
    if (view.type !== "detail") return null;
    return notes.find(n => n.id === view.note.id) ?? view.note;
  }, [view, notes]);

  const liveEditNote = useMemo(() => {
    if (view.type !== "edit") return null;
    return notes.find(n => n.id === view.note.id) ?? view.note;
  }, [view, notes]);

  const goList = useCallback(() => setView({ type: "list" }), []);

  const handleAdd = useCallback(
    async (title: string, content: string) => {
      await addNote(title, content);
      goList();
    },
    [addNote, goList],
  );

  const handleUpdate = useCallback(
    async (title: string, content: string) => {
      if (view.type !== "edit") return;
      await updateNote(view.note.id, { title, content });
      goList();
    },
    [view, updateNote, goList],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteNote(id);
      goList();
    },
    [deleteNote, goList],
  );

  const heading =
    view.type === "create"
      ? "New Note"
      : view.type === "edit"
        ? "Edit Note"
        : view.type === "detail"
          ? view.note.title
          : "Notes";

  return (
    <Drawer.Backdrop
      isOpen={isOpen}
      onOpenChange={open => {
        onOpenChange(open);
        if (!open) goList();
      }}
      variant="blur"
    >
      <Drawer.Content placement="right">
        <Drawer.Dialog className="max-w-[95dvw] min-w-[60dvw]">
          <Drawer.CloseTrigger />
          <Drawer.Header className="pr-10">
            <Drawer.Heading className="truncate">{heading}</Drawer.Heading>
          </Drawer.Header>

          <Drawer.Body className="p-0">
            {view.type === "list" && (
              <NoteListView
                notes={filteredNotes}
                loading={loading}
                error={error}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSelect={note => setView({ type: "detail", note })}
                onAdd={() => setView({ type: "create" })}
                onUpdate={note => setView({ type: "edit", note })}
                onDelete={handleDelete}
                onDeleteAll={deleteAllNotes}
              />
            )}

            {view.type === "detail" && liveDetailNote && (
              <NoteDetailView
                note={liveDetailNote}
                onEdit={() => setView({ type: "edit", note: liveDetailNote })}
                onDelete={async () => {
                  await deleteNote(liveDetailNote.id);
                  goList();
                }}
                onBack={goList}
              />
            )}

            {view.type === "edit" && liveEditNote && (
              <NoteEditView
                initial={liveEditNote}
                onSave={handleUpdate}
                onBack={goList}
              />
            )}

            {view.type === "create" && (
              <NoteEditView onSave={handleAdd} onBack={goList} />
            )}
          </Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}
