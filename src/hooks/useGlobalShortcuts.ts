import { useEffect } from "react";

export type ShortcutHandler = () => void;

export interface GlobalShortcut {
  key: string;
  ctrlOrCmd: boolean;
  handler: ShortcutHandler;
  description: string;
  enabled?: boolean;
}

/**
 * Centralized global keyboard shortcuts hook
 * Handles all application-wide keyboard shortcuts in one place
 */
export function useGlobalShortcuts(shortcuts: GlobalShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;

        const modifierPressed = shortcut.ctrlOrCmd
          ? e.metaKey || e.ctrlKey
          : true;

        if (
          modifierPressed &&
          e.key.toLowerCase() === shortcut.key.toLowerCase()
        ) {
          e.preventDefault();
          shortcut.handler();
          break;
        }
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
