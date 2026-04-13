import React from "react";
import { Link } from "react-router-dom";
import { LinkIcon, type PressEvent } from "@heroui/react";
import { linkVariants, buttonVariants } from "@heroui/styles";
import { cn } from "@/lib/utils";

export interface AppLinkProps {
  href: string;
  children?: React.ReactNode;

  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  asButton?: boolean;
  isIconOnly?: boolean;

  variant?:
    | "ghost"
    | "primary"
    | "secondary"
    | "danger"
    | "danger-soft"
    | "outline"
    | "tertiary"
    | "gradient";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;

  className?: string;
  replace?: boolean;

  onPress?: (e: PressEvent) => void;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

const AppLink = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
  (
    {
      href,
      children,
      prefix = null,
      suffix = null,
      asButton = false,
      isIconOnly = false,
      variant,
      size = "md",
      fullWidth,
      className,
      replace,
      onPress,
      target,
      rel,
    },
    ref,
  ) => {
    const classes = asButton
      ? variant === "gradient"
        ? cn(
            buttonVariants({
              size,
              fullWidth: fullWidth ? true : undefined,
              isIconOnly: isIconOnly ? true : undefined,
            }),
            "from-accent via-accent/90 bg-gradient-to-r to-purple-600 text-white shadow-lg hover:shadow-xl",
          )
        : buttonVariants({
            variant,
            size,
            fullWidth: fullWidth ? true : undefined,
            isIconOnly: isIconOnly ? true : undefined,
          })
      : linkVariants().base();

    return (
      <Link
        ref={ref}
        to={href}
        replace={replace}
        className={cn(classes, className)}
        target={target}
        rel={rel}
        onClick={e => {
          onPress?.(e as unknown as PressEvent);
        }}
      >
        {prefix && !isIconOnly && (
          <LinkIcon
            aria-hidden="true"
            className={asButton ? "mr-2" : undefined}
          >
            {prefix}
          </LinkIcon>
        )}

        {isIconOnly ? (prefix ?? suffix ?? children) : children}

        {suffix && !isIconOnly && (
          <LinkIcon
            aria-hidden="true"
            className={asButton ? "ml-2" : undefined}
          >
            {suffix}
          </LinkIcon>
        )}
      </Link>
    );
  },
);

AppLink.displayName = "AppLink";

export default AppLink;
