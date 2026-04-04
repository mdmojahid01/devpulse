import { Spinner } from "@heroui/react";

interface AppSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "current" | "accent" | "success" | "warning" | "danger";
  className?: string;
  label?: string;
  labelStyle?: {
    className?: string;
    isHorizontal?: boolean;
  };
}

function AppSpinner({
  size,
  color = "current",
  className,
  label,
  labelStyle: { className: labelClassName, isHorizontal } = {},
}: Readonly<AppSpinnerProps>) {
  if (label) {
    return (
      <div
        className={`flex ${isHorizontal ? "flex-row items-center space-x-2" : "flex-col items-center space-y-2"}`}
      >
        <Spinner size={size} color={color} className={className} />
        <span className={`text-muted text-xs ${labelClassName}`}>{label}</span>
      </div>
    );
  }
  return <Spinner size={size} color={color} className={className} />;
}

export default AppSpinner;
