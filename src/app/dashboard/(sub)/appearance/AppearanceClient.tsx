"use client";

import React, { useActionState, useState } from "react";
import { saveAppearance } from "./actions";

export default function AppearanceClient(props: { currentTheme: string }) {
  const [_state, action, pending] = useActionState(saveAppearance, "");

  const themes = [
    { title: "Morganton Theme", className: "bg-ncssm-light-blue text-black" },
    { title: "Durham Theme", className: "bg-ncssm-blue text-white" },
    { title: "Neutral Theme", className: "bg-neutral-200 text-neutral-700" },
    { title: "High Constrast Theme", className: "bg-black text-white" },
  ];

  const [appearance, setAppearance] = useState(props.currentTheme);

  return (
    <>
      <div className="mt-8 grid @3xl:grid-cols-3 @xl:grid-cols-2 grid-cols-1 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.title}
            className={`brutal-md overflow-hidden p-0 w-full ${
              props.currentTheme === theme.title &&
              "ring-offset-1 ring-offset-black ring-8 ring-ncssm-orange/50"
            }`}
            onClick={() => setAppearance(theme.title)}
          >
            <div
              className={
                "h-48 w-full flex items-center justify-center " +
                theme.className
              }
            >
              <div className="h-4 w-1/2 bg-current rounded"></div>
            </div>
            <div className="flex items-center justify-center gap-2 p-2">
              <div className="rounded-full brutal-sm size-4 flex p-0.5">
                {appearance === theme.title && (
                  <div className="rounded-full bg-black size-3"></div>
                )}
              </div>
              {theme.title}
            </div>
          </div>
        ))}
      </div>
      <form action={action} className="flex-shrink-0 w-fit">
        <input
          className="hidden"
          name="appearance"
          readOnly
          value={appearance}
        />
        <button
          className="mt-4 w-fit text-white flex items-center justify-center h-fit bg-ncssm-green brutal-sm px-4 font-bold"
          type="submit"
          aria-disabled={pending}
        >
          Sav{pending ? "ing" : "e"}
        </button>
      </form>
    </>
  );
}
