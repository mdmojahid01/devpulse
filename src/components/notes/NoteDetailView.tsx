import { useCallback } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "@/hooks/useTheme";
import { FiArrowLeft, FiCopy, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Tooltip } from "@heroui/react";
import AppButton from "@/components/ui/AppButton";
import { notifySuccess, notifyError } from "@/lib/notify";
import type { Note } from "@/services/noteStorage";

type NoteDetailViewProps = {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export default function NoteDetailView({
  note,
  onEdit,
  onDelete,
  onBack,
}: Readonly<NoteDetailViewProps>) {
  const { resolvedTheme } = useTheme();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
      notifySuccess("Note copied to clipboard");
    } catch {
      notifyError("Failed to copy note");
    }
  }, [note]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-divider flex items-center justify-between border-b px-4 py-3">
        <AppButton
          size="sm"
          variant="ghost"
          onPress={onBack}
          prefix={<FiArrowLeft className="size-4" />}
          className="text-muted hover:text-foreground"
        >
          Back
        </AppButton>
        <div className="flex items-center gap-2">
          <Tooltip>
            <Tooltip.Trigger>
              <AppButton
                size="sm"
                variant="ghost"
                isIconOnly
                onPress={handleCopy}
                prefix={<FiCopy className="size-4" />}
                className="text-muted hover:text-accent"
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p className="text-xs">Copy note</p>
            </Tooltip.Content>
          </Tooltip>
          <AppButton
            size="sm"
            variant="ghost"
            onPress={onEdit}
            prefix={<FiEdit2 className="size-4" />}
            className="text-muted hover:text-accent"
          >
            Edit
          </AppButton>
          <AppButton
            size="sm"
            variant="ghost"
            onPress={() => {
              if (confirm(`Delete note "${note.title}"?`)) onDelete();
            }}
            prefix={<FiTrash2 className="size-4" />}
            className="text-muted hover:text-danger"
          >
            Delete
          </AppButton>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <h2 className="text-foreground text-lg font-semibold">{note.title}</h2>

        {note.content && (
          <div data-color-mode={resolvedTheme}>
            <MDEditor.Markdown
              source={note.content}
              style={{ background: "transparent" }}
            />
          </div>
        )}

        <p className="text-muted text-xs">
          Last updated:{" "}
          {new Date(note.updatedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
