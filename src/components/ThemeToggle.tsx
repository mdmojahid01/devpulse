import { Button, Dropdown, Label } from "@heroui/react";
import { FaDesktop, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { key: "system", label: "System", icon: FaDesktop },
    { key: "light", label: "Light", icon: FaSun },
    { key: "dark", label: "Dark", icon: FaMoon },
  ] as const;

  const CurrentIcon =
    theme === "dark" ? FaMoon : theme === "light" ? FaSun : FaDesktop;

  return (
    <Dropdown>
      <Button variant="ghost" size="sm" isIconOnly>
        <CurrentIcon className="size-4" />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          selectedKeys={[theme]}
          selectionMode="single"
          onAction={key => setTheme(key as "system" | "dark" | "light")}
        >
          {themeOptions.map(({ key, label, icon: Icon }) => (
            <Dropdown.Item key={key} id={key} textValue={label}>
              <Icon className="size-4" />
              <Label>{label}</Label>
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
