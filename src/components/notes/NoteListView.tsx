import { useCallback } from "react";
import { SearchField, Surface, Tooltip } from "@heroui/react";
import { FiPlus, FiCopy, FiEdit2, FiTrash2 } from "react-icons/fi";
import AppButton from "@/components/ui/AppButton";
import { notifySuccess, notifyError } from "@/lib/notify";
import type { Note } from "@/services/noteStorage";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

type NoteListViewProps = {
  notes: Note[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelect: (note: Note) => void;
  onAdd: () => void;
  onUpdate: (note: Note) => void;
  onDelete: (id: string) => Promise<void>;
  onDeleteAll: () => Promise<void>;
};

export default function NoteListView({
  notes,
  loading,
  error,
  searchQuery,
  onSearchChange,
  onSelect,
  onAdd,
  onUpdate,
  onDelete,
  onDeleteAll,
}: Readonly<NoteListViewProps>) {
  const handleCopy = useCallback(async (note: Note) => {
    try {
      await navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
      notifySuccess("Note copied to clipboard");
    } catch {
      notifyError("Failed to copy note");
    }
  }, []);

  const handleDelete = useCallback(
    async (note: Note) => {
      if (confirm(`Delete note "${note.title}"?`)) {
        await onDelete(note.id);
      }
    },
    [onDelete],
  );

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Surface className="flex-1 rounded-xl p-3">
          <SearchField
            name="notes-search"
            value={searchQuery}
            onChange={onSearchChange}
            fullWidth
            variant="secondary"
            aria-label="Search notes"
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search notes..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
        </Surface>
        {notes.length > 0 && (
          <Tooltip>
            <Tooltip.Trigger>
              <AppButton
                size="sm"
                variant="danger"
                isIconOnly
                onPress={() => {
                  if (confirm("Delete all notes? This cannot be undone."))
                    onDeleteAll();
                }}
                prefix={<FiTrash2 className="size-4" />}
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p className="text-xs">Delete all notes</p>
            </Tooltip.Content>
          </Tooltip>
        )}
        <Tooltip>
          <Tooltip.Trigger>
            <AppButton
              size="sm"
              variant="primary"
              isIconOnly
              onPress={onAdd}
              prefix={<FiPlus className="size-4" />}
            />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p className="text-xs">New note</p>
          </Tooltip.Content>
        </Tooltip>
      </div>

      {loading ? (
        <div className="text-muted flex flex-1 items-center justify-center text-sm">
          Loading notes...
        </div>
      ) : error ? (
        <div className="text-danger flex flex-1 items-center justify-center text-sm">
          {error}
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-muted text-sm">
            {searchQuery ? "No notes match your search." : "No notes found."}
          </p>
          {!searchQuery && (
            <AppButton
              variant="primary"
              onPress={onAdd}
              prefix={<FiPlus className="size-4" />}
            >
              Add Note
            </AppButton>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1 overflow-y-auto">
          {notes.map(note => (
            <div
              key={note.id}
              className="hover:bg-surface-hover group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-colors"
              onClick={() => onSelect(note)}
            >
              <div className="min-w-0 flex-1">
                <span className="text-foreground truncate text-sm font-medium">
                  {note.title}
                </span>
                <p className="text-muted truncate text-xs">
                  {relativeTime(note.updatedAt)}
                </p>
              </div>
              <div
                className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={e => e.stopPropagation()}
              >
                <Tooltip>
                  <Tooltip.Trigger>
                    <AppButton
                      size="sm"
                      variant="ghost"
                      isIconOnly
                      onPress={() => handleCopy(note)}
                      prefix={<FiCopy className="size-3.5" />}
                      className="text-muted hover:text-accent"
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p className="text-xs">Copy</p>
                  </Tooltip.Content>
                </Tooltip>
                <Tooltip>
                  <Tooltip.Trigger>
                    <AppButton
                      size="sm"
                      variant="ghost"
                      isIconOnly
                      onPress={() => onUpdate(note)}
                      prefix={<FiEdit2 className="size-3.5" />}
                      className="text-muted hover:text-accent"
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p className="text-xs">Update</p>
                  </Tooltip.Content>
                </Tooltip>
                <Tooltip>
                  <Tooltip.Trigger>
                    <AppButton
                      size="sm"
                      variant="ghost"
                      isIconOnly
                      onPress={() => handleDelete(note)}
                      prefix={<FiTrash2 className="size-3.5" />}
                      className="text-muted hover:text-danger"
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p className="text-xs">Delete</p>
                  </Tooltip.Content>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
