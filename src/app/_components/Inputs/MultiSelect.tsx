"use client";

import { ReactNode, useRef, useState } from "react";
import { useFocusWithin } from "@/app/_lib/use-hooks/useFocusWithin";
import { XMarkIcon } from "@heroicons/react/16/solid";

export default function MultiSelect<T extends { [key: string]: any }>(props: {
  icon: ReactNode;
  allItems: T[];
  selected: T[];
  //   setSelected: (newValue: T[]) => void;
  setSelected: React.Dispatch<React.SetStateAction<T[]>>;

  maxSearch: number;
  keyFn: (item: T) => any;
  displayFn: (item: T) => any;
  placeholder: string;
}) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");

  const { ref: divRef, focused } = useFocusWithin();

  return (
    <div
      ref={divRef}
      className="h-fit brutal-sm focus-within:[outline:-webkit-focus-ring-color_auto_1px] px-4 flex-1"
    >
      <div className="flex flex-col gap-2">
        <div className="flex w-full gap-2">
          {props.icon}
          <div className="flex flex-wrap w-full gap-2">
            {props.selected.map((s, i) => (
              <button
                className="rounded-lg bg-ncssm-gray/25 px-2 w-fit flex gap-1 items-center justify-center"
                key={props.keyFn(s)}
                ref={(el) => {
                  buttonRefs.current[i] = el;
                }}
                onClick={() => {
                  props.setSelected((a) =>
                    a.filter((b) => props.keyFn(b) !== props.keyFn(s))
                  );
                  if (i === 0) {
                    inputRef.current?.focus();
                  } else {
                    buttonRefs.current[i - 1]?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace") {
                    props.setSelected((a) =>
                      a.filter((b) => props.keyFn(b) !== props.keyFn(s))
                    );
                    if (i === 0) {
                      inputRef.current?.focus();
                    } else {
                      buttonRefs.current[i - 1]?.focus();
                    }
                  }
                }}
              >
                {props.displayFn(s)}
                <XMarkIcon className="size-4 text-rose-500" />
              </button>
            ))}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => {
                let temp = e.target.value;
                const fullMatch = props.allItems
                  .filter((u) => !props.selected.includes(u))
                  .filter((u) =>
                    temp
                      .toLowerCase()
                      .includes(props.displayFn(u).toLowerCase())
                  );
                fullMatch.forEach((match) => {
                  temp = temp.split(match.email).join("").trim();
                });

                props.setSelected((s) => [...s, ...fullMatch]);

                setValue(temp);
              }}
              className="bg-transparent outline-none ring-0 flex-1"
              placeholder={props.placeholder}
              autoComplete="false"
            />
          </div>
        </div>
        {focused &&
          props.allItems
            .filter((u) => !props.selected.includes(u))
            .filter((u) =>
              props.displayFn(u).toLowerCase().includes(value.toLowerCase())
            ).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {props.allItems
                .filter((u) => !props.selected.includes(u))
                .filter((u) =>
                  props.displayFn(u).toLowerCase().includes(value.toLowerCase())
                )
                .filter((_, i) => i < props.maxSearch)
                .map((u) => (
                  <button
                    className="rounded-lg bg-ncssm-gray/25 px-2 w-fit"
                    key={props.keyFn(u)}
                    onClick={() => {
                      props.setSelected((s) => [...s, u]);
                      setValue("");
                      inputRef.current?.focus();
                    }}
                  >
                    <span className="text-start max-w-full block break-all">
                      {props.displayFn(u)}
                    </span>
                  </button>
                ))}
            </div>
          )}
      </div>
    </div>
  );
}
