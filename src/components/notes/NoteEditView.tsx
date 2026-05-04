import { useState, useCallback } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "@/hooks/useTheme";
import { FiArrowLeft } from "react-icons/fi";
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import { Surface } from "@heroui/react";
import { notifyError } from "@/lib/notify";
import type { Note } from "@/services/noteStorage";

type NoteEditViewProps = {
  initial?: Note;
  onSave: (title: string, content: string) => Promise<void>;
  onBack: () => void;
};

export default function NoteEditView({
  initial,
  onSave,
  onBack,
}: Readonly<NoteEditViewProps>) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [saving, setSaving] = useState(false);
  const { resolvedTheme } = useTheme();

  const isDirty =
    title !== (initial?.title ?? "") || content !== (initial?.content ?? "");

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      notifyError("Note title is required");
      return;
    }
    if (!content.trim()) {
      notifyError("Note content cannot be empty");
      return;
    }
    setSaving(true);
    await onSave(title.trim(), content);
    setSaving(false);
  }, [title, content, onSave]);

  const handleBack = useCallback(() => {
    if (isDirty && !confirm("You have unsaved changes. Discard them?")) return;
    onBack();
  }, [isDirty, onBack]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-divider flex items-center justify-between border-b px-4 py-3">
        <AppButton
          size="sm"
          variant="ghost"
          onPress={handleBack}
          prefix={<FiArrowLeft className="size-4" />}
          className="text-muted hover:text-foreground"
        >
          Back
        </AppButton>
        <AppButton
          size="sm"
          variant="primary"
          onPress={handleSave}
          isPending={saving}
          isDisabled={!title.trim() || saving}
        >
          {initial ? "Save changes" : "Add note"}
        </AppButton>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        <Surface className="rounded-xl">
          <AppInput
            placeholder="Note title"
            ariaLabel="Note title"
            value={title}
            onChange={setTitle}
            autoFocus
            fullWidth
            variant="secondary"
          />
        </Surface>

        <div
          data-color-mode={resolvedTheme}
          className="flex min-h-0 flex-1 flex-col"
        >
          <MDEditor
            value={content}
            onChange={v => setContent(v ?? "")}
            height="100%"
            preview="live"
            aria-label="Note content"
            style={{ flex: 1, minHeight: 0 }}
          />
        </div>
      </div>
    </div>
  );
}
