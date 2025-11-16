"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef(
  (
    {
      label,
      options = [],
      value,
      onChange,
      disabled = false,
      className,
      name,
      required = false,
    },
    ref
  ) => {
    return (
      <div className="flex flex-col">
        {label && <label className="mb-1 font-medium">{label}</label>}
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          ref={ref}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <option value="">{`Select ${
            label?.toLowerCase() || "option"
          }`}</option>
          {options.map((opt) => (
            <option key={opt._id} value={opt._id}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";
