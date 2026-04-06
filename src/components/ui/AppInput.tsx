import React from "react";
import {
  TextField,
  Label,
  Description,
  FieldError,
  InputGroup,
} from "@heroui/react";

interface AppInputProps {
  /* Field content */
  label?: string;
  description?: string;
  errorMessage?: string;
  isInvalid?: boolean;

  /* Input behavior */
  ariaLabel?: string;
  value?: string;
  defaultValue?: string;

  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  placeholder?: string;
  type?: string;
  name?: string;
  id?: string;

  fullWidth?: boolean;
  variant?: "primary" | "secondary";

  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  autoFocus?: boolean;

  className?: string;

  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  min?: number | string;
  max?: number | string;
  pattern?: string;
  step?: number | string;

  /* Icon support */
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  /* InputGroup styling */
  inputGroupClassName?: string;
}

const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      label,
      description,
      errorMessage,
      isInvalid,

      ariaLabel,
      value,
      defaultValue,
      onChange,
      onBlur,
      onKeyDown,
      placeholder,
      type = "text",
      name,
      id,
      fullWidth,
      variant,
      isDisabled,
      isReadOnly,
      isRequired,
      autoFocus,
      className,
      autoComplete,
      maxLength,
      minLength,
      pattern,
      min,
      max,
      step,

      prefix,
      suffix,
      inputGroupClassName,
    },
    ref,
  ) => {
    return (
      <TextField
        value={value}
        defaultValue={defaultValue}
        isInvalid={isInvalid}
        onChange={value => onChange?.(value)}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        className={className}
        name={name}
        id={id}
        aria-label={!label ? ariaLabel : undefined}
      >
        {label && <Label>{label}</Label>}

        <InputGroup
          fullWidth={fullWidth}
          variant={variant}
          className={inputGroupClassName}
        >
          {prefix && <InputGroup.Prefix>{prefix}</InputGroup.Prefix>}

          <InputGroup.Input
            ref={ref}
            aria-label={ariaLabel}
            placeholder={placeholder}
            type={type}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            maxLength={maxLength}
            minLength={minLength}
            min={min}
            max={max}
            step={step}
            pattern={pattern}
          />

          {suffix && <InputGroup.Suffix>{suffix}</InputGroup.Suffix>}
        </InputGroup>

        {description && <Description>{description}</Description>}

        {errorMessage && <FieldError>{errorMessage}</FieldError>}
      </TextField>
    );
  },
);

AppInput.displayName = "AppInput";

export default AppInput;
