import { Modal, Surface, Switch } from "@heroui/react";
import AppInput from "@/components/ui/AppInput";
import { useState, useEffect } from "react";
import {
  readConfig,
  writeConfig,
  DEFAULT_UI_VISIBILITY,
  type AppConfig,
  type UIVisibility,
} from "@/services/configStorage";
import AppButton from "./ui/AppButton";
import AppLabel from "./ui/AppLabel";

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

  const handleSave = async () => {
    if (!githubUsername.trim()) {
      return;
    }

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
  };

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={onClose}
      isDismissable={false}
      variant="blur"
    >
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md">
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
                      onChange={setGithubUsername}
                      isRequired
                      fullWidth
                      variant="secondary"
                      errorMessage="Github username is required"
                      isInvalid={!githubUsername.trim() && !loading}
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
              </div>
            </Surface>
          </Modal.Body>
          <Modal.Footer>
            <AppButton variant="ghost" onPress={onClose}>
              Cancel
            </AppButton>
            <AppButton
              onPress={handleSave}
              isDisabled={!githubUsername.trim() || loading}
              isPending={loading}
            >
              Save
            </AppButton>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
