"use client";

import React, { ChangeEvent, forwardRef, useRef, useState } from "react";
import FileIcon from "../_icons/FileIcon";

type Props = {
  name: string;
  label?: string;
  phone?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  startingValue?: string;
  value: string;
  onChange?: (newVal: string) => any;
};

const PhoneInput = forwardRef<HTMLInputElement, Props>(
  (
    { name, label, required, placeholder, startingValue = "", value, onChange },
    ref
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      let newValue = String(e.target.value);

      newValue = newValue.replace(/[^1234567890]/g, "");

      if (newValue.length > 10) newValue = newValue.substring(0, 10);

      if (newValue.length < 4) {
        newValue = newValue.substring(0, 3);
      } else if (newValue.length < 7) {
        newValue = newValue.substring(0, 3) + "-" + newValue.substring(3, 6);
      } else if (newValue.length < 11) {
        newValue =
          newValue.substring(0, 3) +
          "-" +
          newValue.substring(3, 6) +
          "-" +
          newValue.substring(6);
      }

      if (onChange) onChange(newValue);
    };

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

        <input
          type="tel"
          id={name}
          name={name}
          placeholder={placeholder ?? "123-456-7890"}
          required={required}
          value={value}
          onChange={handleChange}
          className="px-4 brutal-sm focus:brutal-focus placeholder:text-gray-400"
          defaultValue={startingValue}
          readOnly={onChange === undefined}
          ref={ref}
        />
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";
export default PhoneInput;
