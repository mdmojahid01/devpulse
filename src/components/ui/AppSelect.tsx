import React from "react";
import { Select, type Key } from "@heroui/react";

interface AppSelectProps {
  children: React.ReactNode;
  className?: string;
  placeholder?: string;
  defaultValue?: Key | Key[];
  value?: Key | Key[] | null;
  onChange?: (value: Key | Key[] | null) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  name?: string;
  selectionMode?: "single" | "multiple";
}

interface AppSelectTriggerProps {
  children: React.ReactNode;
}

interface AppSelectPopoverProps {
  children: React.ReactNode;
}

function AppSelect({
  children,
  className,
  placeholder,
  defaultValue,
  value,
  onChange,
  isDisabled,
  isRequired,
  name,
  selectionMode = "single",
}: Readonly<AppSelectProps>) {
  return (
    <Select
      className={className}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      isRequired={isRequired}
      name={name}
      selectionMode={selectionMode}
    >
      {children}
    </Select>
  );
}

function AppSelectTrigger({ children }: Readonly<AppSelectTriggerProps>) {
  return <Select.Trigger>{children}</Select.Trigger>;
}

function AppSelectPopover({ children }: Readonly<AppSelectPopoverProps>) {
  return <Select.Popover>{children}</Select.Popover>;
}

function AppSelectValue() {
  return <Select.Value />;
}

function AppSelectIndicator() {
  return <Select.Indicator />;
}

AppSelect.Trigger = AppSelectTrigger;
AppSelect.Popover = AppSelectPopover;
AppSelect.Value = AppSelectValue;
AppSelect.Indicator = AppSelectIndicator;

export { ListBox } from "@heroui/react";
export default AppSelect;
