import React from "react";
import { Chip, type ChipProps } from "@heroui/react";

type ChipPropsWithoutPrefixSuffix = Omit<
  ChipProps,
  "children" | "prefix" | "suffix"
>;

export interface AppChipProps extends ChipPropsWithoutPrefixSuffix {
  children?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  labelProps?: React.ComponentProps<typeof Chip.Label>;
}

export const AppChip: React.FC<AppChipProps> = ({
  prefix,
  suffix,
  children,
  labelProps,
  ...rest
}) => {
  return (
    <Chip {...rest}>
      {prefix}
      <Chip.Label {...labelProps}>{children}</Chip.Label>
      {suffix}
    </Chip>
  );
};

export default AppChip;
