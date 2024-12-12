"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import useOnClickOutside from "../_lib/use-hooks/useOnClickOutside";

interface Props {
  children?: JSX.Element;
  isOpen: boolean;
  onClose: (reason: "clickaway" | "close" | "timeout") => void;
  autoHideDuration?: number;
  noTimeOut?: boolean;
  className?: string;
}
const Modal: React.FC<Props> = (props) => {
  // modal in tailwind
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(props.isOpen);

  useEffect(() => {
    setOpen(props.isOpen);
    if (props.noTimeOut) return;
    const timeout = setTimeout(() => {
      props.onClose("timeout");
    }, props.autoHideDuration || 3000);
    return () => clearTimeout(timeout);
  }, [props]);

  useOnClickOutside(ref, () => props.onClose("clickaway"));

  return (
    <div
      className={`max-h-screen fixed inset-0 z-[60] overflow-auto bg-black/75 transition-opacity ${
        open ? "opacity-100" : "opacity-0 select-none pointer-events-none"
      } flex items-center justify-center`}
    >
      <div
        className={`overflow-y-auto max-h-screen relative z-[70] brutal-xl p-6 transition-[transform,opacity] transform ${
          open ? "scale-100 opacity-100" : "scale-90 opacity-0"
        } ${props.className || ""}`}
        ref={ref}
      >
        <button
          onClick={() => {
            props.onClose("close");
          }}
          className="text-sm font-semibold"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-4 w-4 text-neutral-600 top-5 right-5 absolute"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              fill="currentColor"
            />
          </svg>
        </button>

        {props.children}
      </div>
    </div>
  );
};

export default Modal;
