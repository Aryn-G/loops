"use client";

import { ArrowPathRoundedSquareIcon } from "@heroicons/react/16/solid";
import { refreshAction } from "./Refresh.action";
import { useRef } from "react";

export default function Refresh({
  tag,
  path,
}: {
  tag?: string | string[];
  path?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const getFormData = () => {
    if (formRef.current) return new FormData(formRef.current);
    else return new FormData();
  };

  return (
    <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
      {tag !== undefined && (
        <>
          {typeof tag === "string" ? (
            <input
              name="tag"
              id="tag"
              value={tag}
              readOnly
              className="hidden"
            />
          ) : (
            tag.map((t) => (
              <input
                key={t}
                name="tag"
                id="tag"
                value={t}
                readOnly
                className="hidden"
              />
            ))
          )}
        </>
      )}
      {path !== undefined && (
        <input name="path" id="path" value={path} readOnly className="hidden" />
      )}
      <button
        onClick={() => {
          try {
            refreshAction(getFormData());
          } catch (error) {
            if (!navigator.onLine) {
              alert(
                "You are offline. Please check your internet connection and try again."
              );
            } else {
              alert("Couldn't sync successfully.");
            }
          }
        }}
        className="flex items-center justify-center gap-2 p-2"
      >
        Sync <ArrowPathRoundedSquareIcon className="size-4" />
      </button>
    </form>
  );
}
