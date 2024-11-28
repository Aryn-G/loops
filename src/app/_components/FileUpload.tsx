"use client";

import React, { ChangeEvent, forwardRef, useRef, useState } from "react";
import FileIcon from "../_icons/FileIcon";

type Props = {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  value: File | null;
  onChange?: (newVal: File | null) => any;
};

export const bytesString = (num: number) => {
  const bytes = num;

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = units[0];

  for (let i = 1; i < units.length; i++) {
    if (size < 1024) {
      break;
    }
    size /= 1024;
    unit = units[i];
  }

  return `${size.toFixed(2)} ${unit}`;
};

const FileUpload = forwardRef<HTMLInputElement, Props>(
  ({ name, label, required, placeholder, value, onChange }, ref) => {
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
        <label
          htmlFor={name}
          className={`flex gap-2 items-center justify-center rounded-full w-full px-7 brutal-sm focus:brutal-focus cursor-pointer ${
            value ? "mb-1" : "mb-3"
          }`}
        >
          <FileIcon className="size-5 -ml-1 text-neutral-600" />
          {value ? (
            <span className="max-w-36 block overflow-hidden text-ellipsis whitespace-nowrap">
              {value.name}
            </span>
          ) : (
            <span>{placeholder ?? "Upload File"}</span>
          )}
        </label>
        {value && <p className="mb-3">{bytesString(value.size)}</p>}
        <input
          type="file"
          readOnly={onChange === undefined}
          id={name}
          name={name}
          required={required}
          className="hidden"
          accept="application/pdf"
          onChange={(e) =>
            onChange && onChange(e.target.files ? e.target.files[0] : null)
          }
          ref={ref}
        />
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export default FileUpload;
