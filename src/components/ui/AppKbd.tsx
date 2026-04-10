import envConfig from "@/config/envConfig";
import { Kbd } from "@heroui/react";

function AppKbd({
  keyValue,
  className,
  cmdOrCtrl = false,
}: Readonly<{ keyValue: string; className?: string; cmdOrCtrl?: boolean }>) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {cmdOrCtrl && (
        <Kbd>
          <Kbd.Abbr keyValue={envConfig.IS_MAC ? "command" : "ctrl"} />
        </Kbd>
      )}
      <Kbd>
        <Kbd.Content>{keyValue}</Kbd.Content>
      </Kbd>
    </div>
  );
}

export default AppKbd;
