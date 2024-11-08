"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { giveAccessAction } from "./actions";
import UserPlus from "@/app/_icons/UserPlus";
import XMark from "@/app/_icons/XMark";

type FilteredUser = {
  _id: string;
  name: string;
  email: string;
  photo: string | undefined;
  role: "Student" | "Loops" | "Admin" | undefined;
};

type Props = {
  allUsers: FilteredUser[];
};

const GiveAccess = (props: Props) => {
  const [state, action, pending] = useFormState(giveAccessAction, "");

  const students = props.allUsers.filter((u) => u.role === "Student");
  // const students = props.allUsers;
  const [value, setValue] = useState("");

  const [selected, setSelected] = useState<FilteredUser[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (selected.length > 0 && !pending) {
      setSelected([]);
    }
  }, [pending]);

  return (
    <div className="w-full flex gap-2 my-3">
      <div
        // onBlur={() => {
        //   if (!students.map((u) => u.email).includes(value)) setValue("");
        // }}
        className="flex flex-col gap-2 px-5 py-2 bg-white shadow-brutal-sm ring-1 ring-black flex-1 rounded-lg focus-within:outline"
      >
        <div className="flex flex-wrap gap-2">
          <UserPlus />
          {selected.map((s) => (
            <button
              className="rounded-lg bg-ncssm-gray/25 px-2 w-fit flex gap-1 items-center justify-center"
              key={s.email}
              onClick={() =>
                setSelected((a) => a.filter((b) => b.email !== s.email))
              }
              onKeyDown={(e) =>
                e.key === "Backspace" &&
                setSelected((a) => a.filter((b) => b.email !== s.email))
              }
            >
              {s.email}
              <XMark className="size-4 text-rose-500" />
            </button>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              let temp = e.target.value;
              const fullMatch = students
                .filter((u) => !selected.includes(u))
                .filter((u) =>
                  temp.toLowerCase().includes(u.email.toLowerCase())
                );
              fullMatch.forEach((match) => {
                temp = temp.split(match.email).join("").trim();
              });
              setSelected((s) => [...s, ...fullMatch]);

              setValue(temp);
            }}
            className="bg-transparent outline-none ring-0 flex-1"
            placeholder="Starting typing email..."
          />
        </div>
        {value &&
          students
            .filter((u) => !selected.includes(u))
            .filter((u) => u.email.toLowerCase().includes(value.toLowerCase()))
            .length > 0 && (
            <div className="flex flex-col gap-1">
              {students
                .filter((u) => !selected.includes(u))
                .filter((u) =>
                  u.email.toLowerCase().includes(value.toLowerCase())
                )
                .filter((_, i) => i < 4)
                .map((u) => (
                  <button
                    className="rounded-lg bg-ncssm-gray/25 px-2 w-fit"
                    key={u.email}
                    onClick={() => {
                      setSelected((s) => [...s, u]);
                      setValue("");
                      inputRef.current?.focus();
                    }}
                  >
                    {u.email}
                  </button>
                ))}
            </div>
          )}
      </div>
      <form action={action}>
        {selected.map((s) => (
          <input
            className="hidden"
            name="selected"
            readOnly
            value={s._id}
            key={s._id}
          />
        ))}
        <button
          className="h-fit bg-emerald-500 shadow-brutal-sm ring-1 ring-black px-5 py-2 rounded-lg font-bold"
          type="submit"
          aria-disabled={pending}
        >
          Giv{pending ? "ing" : "e"} Access
        </button>
      </form>
    </div>
  );
};

export default GiveAccess;
