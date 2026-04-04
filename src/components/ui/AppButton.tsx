import React from "react";
import { Button } from "@heroui/react";
import AppSpinner from "./AppSpinner";

interface AppButtonProps {
  children?: React.ReactNode;
  onPress?: () => void;

  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "outline"
    | "ghost"
    | "danger"
    | "gradient";

  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;

  isDisabled?: boolean;
  isPending?: boolean;
  isIconOnly?: boolean;

  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  loadingText?: string;

  className?: string;
  type?: "button" | "submit" | "reset";
}

function AppButton({
  children,
  onPress,
  variant,
  size = "md",
  fullWidth,
  isDisabled,
  suffix,
  prefix,
  isIconOnly,
  isPending,
  loadingText,
  className,
  type = "button",
}: Readonly<AppButtonProps>) {
  const gradientClasses =
    variant === "gradient"
      ? "from-accent via-accent/90 bg-gradient-to-r to-purple-600 text-white shadow-lg hover:shadow-xl"
      : "";

  return (
    <Button
      onPress={onPress}
      variant={variant === "gradient" ? undefined : variant}
      size={size}
      fullWidth={fullWidth}
      isDisabled={isDisabled || isPending}
      isIconOnly={isIconOnly}
      isPending={isPending}
      className={`${gradientClasses} ${className || ""}`}
      type={type}
    >
      {({ isPending: pending }) => (
        <>
          {pending ? <AppSpinner color="current" size="sm" /> : prefix}

          {!isIconOnly && (pending ? loadingText || children : children)}

          {!pending && suffix}
        </>
      )}
    </Button>
  );
}

export default AppButton;
