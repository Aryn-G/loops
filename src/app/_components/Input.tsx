"use client";

import React, { ChangeEvent, forwardRef, useRef, useState } from "react";
import FileIcon from "../_icons/FileIcon";

type Props = {
  type?: "text" | "number" | "date" | "time";
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  minNum?: number;
  maxNum?: number;
  value: string | number;
  onChange?: (newValue: string | number) => any;
};

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      type = "text",
      name,
      label,
      required,
      placeholder,
      maxLength,
      className,
      minNum,
      maxNum,
      value,
      onChange,
    },
    ref
  ) => {
    return (
      <>
        {label && (
          <div className="flex gap-2 items-baseline">
            <label htmlFor={name} className="font-bold mb-1">
              {label}
              {required && <span className="text-ncssm-blue">*</span>}
            </label>
            {maxLength && typeof value === "string" && value.length != 0 && (
              <p>
                {value.length} / {maxLength}
              </p>
            )}
          </div>
        )}
        <input
          readOnly={onChange === undefined}
          type={type}
          min={type == "number" ? minNum : undefined}
          max={type == "number" ? maxNum : undefined}
          maxLength={maxLength}
          id={name}
          name={name}
          placeholder={placeholder ?? "Type Here..."}
          required={required}
          className={
            "px-4 brutal-sm focus:brutal-focus placeholder:text-gray-400 " +
            className
          }
          ref={ref}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      </>
    );
  }
);

export default Input;
