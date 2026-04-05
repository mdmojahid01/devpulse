import React from "react";
import { Card } from "@heroui/react";

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
}

interface AppCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface AppCardContentProps {
  children: React.ReactNode;
  className?: string;
}

function AppCard({ children, className }: Readonly<AppCardProps>) {
  return <Card className={className}>{children}</Card>;
}

function AppCardHeader({ children, className }: Readonly<AppCardHeaderProps>) {
  return <Card.Header className={className}>{children}</Card.Header>;
}

function AppCardContent({
  children,
  className,
}: Readonly<AppCardContentProps>) {
  return <Card.Content className={className}>{children}</Card.Content>;
}

AppCard.Header = AppCardHeader;
AppCard.Content = AppCardContent;

export default AppCard;
