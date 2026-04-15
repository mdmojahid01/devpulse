import { toast } from "@heroui/react";
import type { ReactNode } from "react";
import type { ButtonProps } from "@heroui/react";

type ToastOptions = {
  description?: ReactNode;
  indicator?: ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "danger";
  actionProps?: ButtonProps;
  isLoading?: boolean;
  timeout?: number;
  onClose?: () => void;
};

export function notify(message: string, options?: ToastOptions) {
  toast(message, options);
}

export function notifySuccess(
  message: string,
  options?: Omit<ToastOptions, "variant">,
) {
  toast.success(message, options);
}

export function notifyError(
  message: string,
  options?: Omit<ToastOptions, "variant">,
) {
  toast.danger(message, options);
}

export function notifyInfo(
  message: string,
  options?: Omit<ToastOptions, "variant">,
) {
  toast.info(message, options);
}

export function notifyWarning(
  message: string,
  options?: Omit<ToastOptions, "variant">,
) {
  toast.warning(message, options);
}
