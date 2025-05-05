"use client";

import React, { ChangeEvent, forwardRef, useRef, useState } from "react";

type Props = {
  type?: string;
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  options: string[];
  value: string;
  setValue?: (newValue: string) => any;
};

const RadioGroup = forwardRef<HTMLTextAreaElement, Props>(
  ({ name, label, required, options, value, setValue }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <div className="flex gap-2 items-baseline">
            <label htmlFor={name} className="font-bold mb-1">
              {label}
              {required && <span className="text-ncssm-blue">*</span>}
            </label>
          </div>
        )}
        {options.map((v) => (
          <>
            <input type="radio" name={name} value={v} checked={v == value} />
          </>
        ))}
        {/* <textarea
          readOnly={setValue === undefined}
          id={name}
          name={name}
          required={required}
          value={value}
          onChange={(e) => setValue && setValue(e.target.value)}
          className="brutal-sm px-4 min-h-10 flex-grow placeholder:text-gray-400 resize-y"
          ref={ref}
        ></textarea> */}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
