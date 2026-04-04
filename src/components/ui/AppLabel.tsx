import React from "react";
import { Label, type LabelProps } from "@heroui/react";

export interface AppLabelProps extends LabelProps {
  children: React.ReactNode;
}

function AppLabel({ children, ...rest }: Readonly<AppLabelProps>) {
  return <Label {...rest}>{children}</Label>;
}

export default AppLabel;
