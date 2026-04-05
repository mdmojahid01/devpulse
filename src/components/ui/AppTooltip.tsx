import React from "react";
import { Tooltip } from "@heroui/react";

interface AppTooltipProps {
  children: React.ReactNode;
}

interface AppTooltipTriggerProps {
  children: React.ReactNode;
}

interface AppTooltipContentProps {
  children: React.ReactNode;
}

function AppTooltip({ children }: Readonly<AppTooltipProps>) {
  return <Tooltip>{children}</Tooltip>;
}

function AppTooltipTrigger({ children }: Readonly<AppTooltipTriggerProps>) {
  return <Tooltip.Trigger>{children}</Tooltip.Trigger>;
}

function AppTooltipContent({ children }: Readonly<AppTooltipContentProps>) {
  return <Tooltip.Content>{children}</Tooltip.Content>;
}

AppTooltip.Trigger = AppTooltipTrigger;
AppTooltip.Content = AppTooltipContent;

export default AppTooltip;
