"use client";

import React from "react";
import { ExternalToast, toast as sonnerToast } from "sonner";

export default function toast(
  toast: Omit<ToastProps, "id">,
  data?: ExternalToast
) {
  return sonnerToast.custom(
    (id) => (
      <Toast
        id={id}
        title={toast.title}
        description={toast.description}
        button={{
          label: toast.button.label,
          onClick: () => console.log("Button clicked"),
        }}
      />
    ),
    data
  );
}

function Toast(props: ToastProps) {
  const { title, description, button, id } = props;

  return (
    <div className="flex brutal-sm px-4 w-full items-center">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <button
        className="ml-5 flex-shrink-0 brutal-sm px-3 py-1 text-sm font-semibold bg-ncssm-blue text-white"
        onClick={() => {
          button.onClick();
          sonnerToast.dismiss(id);
        }}
      >
        {button.label}
      </button>
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  button: {
    label: string;
    onClick: () => void;
  };
}
