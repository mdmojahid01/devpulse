import { Modal, Surface } from "@heroui/react";
import AppInput from "@/components/ui/AppInput";
import { useState, useEffect } from "react";
import {
  readConfig,
  writeConfig,
  type AppConfig,
} from "@/services/configStorage";
import AppButton from "./ui/AppButton";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      readConfig().then(config => {
        if (config) {
          setGithubUsername(config.githubUsername || "");
          setLeetcodeUsername(config.leetcodeUsername || "");
          setCustomQuote(config.customQuote || "");
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
    };

    await writeConfig(config);
    setLoading(false);
    onSave(config);
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
