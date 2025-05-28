"use client";

import React from "react";
import { WidgetProps } from "@rjsf/utils";
import { Input } from "@/components/ui/input";

/**
 * Custom URL widget for React JSON Schema Form
 * Provides a specialized input for URL fields with basic validation
 */
const URLWidget = (props: WidgetProps) => {
  const {
    id,
    value = "",
    required,
    disabled,
    readonly,
    onChange,
    onBlur,
    onFocus,
    label,
    placeholder,
  } = props;

  return (
    <Input
      id={id}
      className="w-full"
      type="url"
      value={value || ""}
      required={required}
      disabled={disabled || readonly}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur && ((event) => onBlur(id, event.target.value))}
      onFocus={onFocus && ((event) => onFocus(id, event.target.value))}
      placeholder={placeholder || "Enter URL"}
    />
  );
};

export default URLWidget;
// Also export as uppercase URL for case-insensitive usage
export { URLWidget as URL };
