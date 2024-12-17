"use client";

import React, { ChangeEvent, forwardRef, useRef, useState } from "react";
import { toISOStringOffset } from "../../_lib/time";

type Props = React.HTMLProps<HTMLInputElement> & {
  type?: "text" | "number" | "date" | "time" | "datetime-local";
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  min?: string | number;
  max?: string | number;
  value: string | number;
  setValue?: (newValue: string | number) => any;
  defaultNum?: number;
};

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      type = "text",
      defaultNum,
      name,
      label,
      required,
      placeholder,
      maxLength,
      className,
      min,
      max,
      value,
      setValue,
    },
    ref
  ) => {
    const noNaN = (n: string | number | undefined) => {
      if (typeof n !== "number") return n;
      if (Number.isNaN(n)) return "";
      return n;
    };

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
          readOnly={setValue === undefined}
          type={type}
          min={
            type == "number" || type == "datetime-local"
              ? noNaN(min)
              : undefined
          }
          max={
            type == "number" || type == "datetime-local"
              ? noNaN(max)
              : undefined
          }
          maxLength={maxLength}
          id={name}
          name={name}
          placeholder={placeholder ?? "Type Here..."}
          required={required}
          className={
            "px-4 h-11 brutal-sm placeholder:text-gray-400 " + className
          }
          ref={ref}
          value={noNaN(value)}
          onChange={(e) => {
            if (setValue) {
              let newValue: Date | number | string | undefined;
              if (
                type == "number" &&
                typeof max === "number" &&
                typeof min === "number"
              ) {
                newValue = e.target.valueAsNumber as number;
                if (defaultNum !== undefined && newValue === undefined)
                  newValue = defaultNum;
                if (newValue > max) {
                  newValue = max;
                } else if (newValue < min) {
                  newValue = min;
                }
              } else if (
                type == "datetime-local" &&
                typeof max === "string" &&
                typeof min === "string" &&
                e.target.value !== ""
              ) {
                newValue = new Date(e.target.value);

                if ((newValue?.getTime() ?? 0) - new Date(max).getTime() > 0) {
                  newValue = new Date(max);
                } else if (
                  (newValue?.getTime() ?? 0) - new Date(min).getTime() <
                  0
                ) {
                  newValue = new Date(min);
                }

                newValue = toISOStringOffset(newValue);
              } else {
                newValue = e.target.value;
              }

              setValue(newValue);
            }
          }}
        />
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;
