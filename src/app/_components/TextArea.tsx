"use client";

import React, { ChangeEvent, forwardRef, useRef, useState } from "react";
import FileIcon from "../_icons/FileIcon";

type Props = {
  type?: string;
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  value: string;
  onChange?: (newValue: string) => any;
};

const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ name, label, required, placeholder, maxLength, value, onChange }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <div className="flex gap-2 items-baseline">
            <label htmlFor={name} className="font-bold mb-1">
              {label}
              {required && <span className="text-ncssm-blue">*</span>}
            </label>
            {maxLength && value.length != 0 && (
              <p>
                {value.length} / {maxLength}
              </p>
            )}
          </div>
        )}
        <textarea
          readOnly={onChange === undefined}
          maxLength={maxLength}
          id={name}
          name={name}
          placeholder={placeholder ?? "Type Here..."}
          required={required}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="brutal-sm focus:brutal-focus px-4 min-h-10 flex-grow placeholder:text-gray-400 resize-y"
          ref={ref}
        ></textarea>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
