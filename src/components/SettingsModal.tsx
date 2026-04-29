import { Modal, Surface, Switch } from "@heroui/react";
import AppInput from "@/components/ui/AppInput";
import { useState, useEffect, useCallback } from "react";
import {
  readConfig,
  writeConfig,
  DEFAULT_UI_VISIBILITY,
  type AppConfig,
  type UIVisibility,
} from "@/services/configStorage";
import { validateGithubUser } from "@/services/github";
import AppButton from "./ui/AppButton";
import AppLabel from "./ui/AppLabel";
import AppKbd from "./ui/AppKbd";
import { FiBookmark } from "react-icons/fi";
import envConfig from "@/config/envConfig";

type SettingsModalProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AppConfig) => void;
}>;

export default function SettingsModal({
  isOpen,
  onClose,
  onSave,
}: SettingsModalProps) {
  const [githubUsername, setGithubUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [customQuote, setCustomQuote] = useState("");
  const [uiVisibility, setUiVisibility] = useState<UIVisibility>(
    DEFAULT_UI_VISIBILITY,
  );
  const [loading, setLoading] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      readConfig().then(config => {
        if (config) {
          setGithubUsername(config.githubUsername || "");
          setLeetcodeUsername(config.leetcodeUsername || "");
          setCustomQuote(config.customQuote || "");
          setUiVisibility(config.uiVisibility || DEFAULT_UI_VISIBILITY);
        }
      });
    }
  }, [isOpen]);

  const validateAndSave = useCallback(async () => {
    const trimmed = githubUsername.trim();
    if (!trimmed) return;

    setValidating(true);
    const exists = await validateGithubUser(trimmed).catch(() => false);
    setValidating(false);

    if (!exists) {
      setGithubError(`GitHub profile "${trimmed}" not found`);
      return;
    }

    setGithubError(null);
    setLoading(true);
    const config: AppConfig = {
      githubUsername: githubUsername.trim(),
      leetcodeUsername: leetcodeUsername.trim() || undefined,
      customQuote: customQuote.trim() || undefined,
      uiVisibility,
    };

    await writeConfig(config);
    onSave(config);
    setLoading(false);
    onClose();
  }, [
    githubUsername,
    leetcodeUsername,
    customQuote,
    uiVisibility,
    onSave,
    onClose,
  ]);

  const handleSave = validateAndSave;

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={onClose}
      isDismissable={false}
      variant="blur"
    >
      <Modal.Container size="lg">
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Settings</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="p-2">
            <Surface>
              <div className="space-y-5">
                <div>
                  <h3 className="text-foreground mb-3 text-sm font-semibold">
                    Account Settings
                  </h3>
                  <div className="space-y-4">
                    <AppInput
                      label="GitHub Username"
                      placeholder="Enter your GitHub username"
                      value={githubUsername}
                      onChange={v => {
                        setGithubUsername(v);
                        setGithubError(null);
                      }}
                      onKeyDown={e => e.key === "Enter" && validateAndSave()}
                      isRequired
                      fullWidth
                      variant="secondary"
                      errorMessage={
                        githubError ?? "GitHub username is required"
                      }
                      isInvalid={
                        !!githubError || (!githubUsername.trim() && !loading)
                      }
                    />
                    <AppInput
                      label="LeetCode Username (Optional)"
                      placeholder="Enter your LeetCode username"
                      value={leetcodeUsername}
                      onChange={setLeetcodeUsername}
                      fullWidth
                      variant="secondary"
                    />
                    <AppInput
                      label="Custom Quote (Optional)"
                      placeholder="Enter your motivational quote"
                      value={customQuote}
                      onChange={setCustomQuote}
                      fullWidth
                      variant="secondary"
                    />
                  </div>
                </div>

                <div className="border-divider border-t pt-4">
                  <h3 className="text-foreground mb-3 text-sm font-semibold">
                    UI Visibility
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <AppLabel>Show Search Bar</AppLabel>
                      <Switch
                        isSelected={uiVisibility.showSearch}
                        onChange={checked =>
                          setUiVisibility(prev => ({
                            ...prev,
                            showSearch: checked,
                          }))
                        }
                      >
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch>
                    </div>
                    <div className="flex items-center justify-between">
                      <AppLabel>Show GitHub Activity</AppLabel>
                      <Switch
                        isSelected={uiVisibility.showGithub}
                        onChange={checked =>
                          setUiVisibility(prev => ({
                            ...prev,
                            showGithub: checked,
                          }))
                        }
                      >
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch>
                    </div>
                    <div className="flex items-center justify-between">
                      <AppLabel>Show Todo List</AppLabel>
                      <Switch
                        isSelected={uiVisibility.showTodo}
                        onChange={checked =>
                          setUiVisibility(prev => ({
                            ...prev,
                            showTodo: checked,
                          }))
                        }
                      >
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch>
                    </div>
                    <div className="flex items-center justify-between">
                      <AppLabel>Show LeetCode Activity</AppLabel>
                      <Switch
                        isSelected={uiVisibility.showLeetcode}
                        onChange={checked =>
                          setUiVisibility(prev => ({
                            ...prev,
                            showLeetcode: checked,
                          }))
                        }
                      >
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch>
                    </div>
                  </div>
                </div>

                <div className="border-divider border-t pt-4">
                  <div className="bg-accent/10 border-accent/20 flex gap-2.5 rounded-lg border p-3">
                    <div className="flex-shrink-0">
                      <FiBookmark className="text-accent size-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-foreground mb-1 text-xs font-semibold">
                        Bookmarks Tip
                      </h3>
                      <p className="text-muted mb-1.5 text-xs leading-relaxed">
                        Toggle Chrome's bookmark bar:
                      </p>
                      <div className="flex items-center gap-1">
                        {envConfig.IS_MAC ? (
                          <>
                            <AppKbd keyValue="⌘" />
                            <span className="text-muted text-xs">+</span>
                            <AppKbd keyValue="Shift" />
                            <span className="text-muted text-xs">+</span>
                            <AppKbd keyValue="B" />
                          </>
                        ) : (
                          <>
                            <AppKbd keyValue="Ctrl" />
                            <span className="text-muted text-xs">+</span>
                            <AppKbd keyValue="Shift" />
                            <span className="text-muted text-xs">+</span>
                            <AppKbd keyValue="B" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Surface>
          </Modal.Body>
          <Modal.Footer>
            <AppButton variant="ghost" onPress={onClose}>
              Cancel
            </AppButton>
            <AppButton
              onPress={handleSave}
              isDisabled={!githubUsername.trim() || loading || validating}
              isPending={loading || validating}
            >
              Save
            </AppButton>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
