"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { createAccounts } from "./actions";
import { UserPlusIcon } from "@heroicons/react/24/outline";

import { getFilteredUsers } from "@/app/_db/queries/users";
import MultiSelect from "@/app/_components/Inputs/MultiSelect";
import { useFocusWithin } from "@/app/_lib/use-hooks/useFocusWithin";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { EMAIL_PATTERN } from "@/app/_lib/constants";

type FilteredUser = Awaited<ReturnType<typeof getFilteredUsers>>[number];

type Props = {
  allUsers: FilteredUser[];
};

const CreateAccountsClient = (props: Props) => {
  const [_state, action, pending] = useActionState(createAccounts, "");

  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (selected.length > 0 && !pending) {
      setSelected([]);
    }
  }, [pending]);

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");

  const { ref: divRef, focused } = useFocusWithin();

  const extractEmails = (input: string) => {
    const emails = [...input.toLowerCase().matchAll(EMAIL_PATTERN)].map(
      (match) => match[0]
    );

    let remaining = input;
    for (const email of emails) {
      // Replace exact matches, globally
      remaining = remaining.replace(new RegExp(email, "g"), "").trim();
    }

    return {
      emails,
      remaining: remaining.replace(/\s+/g, " "), // normalize spaces
    };
  };

  const processInput = (input: string) => {
    const { emails, remaining } = extractEmails(input);
    if (emails.length > 0) {
      setSelected((prev) => [
        ...prev,
        ...emails.filter((e) => !prev.includes(e)),
      ]);
    }
    setValue(remaining);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-2 my-3">
      <div
        ref={divRef}
        className="h-fit brutal-sm focus-within:[outline:-webkit-focus-ring-color_auto_1px] px-4 flex-1"
      >
        <div className="flex flex-col gap-2">
          <div className="flex w-full gap-2">
            <UserPlusIcon className="size-6 flex-shrink-0" />{" "}
            <div className="flex flex-wrap w-full gap-2">
              {selected.map((s, i) => (
                <button
                  className="rounded-lg bg-ncssm-gray/25 px-2 w-fit flex gap-1 items-center justify-center"
                  key={s + i}
                  ref={(el) => {
                    buttonRefs.current[i] = el;
                  }}
                  onClick={() => {
                    setSelected((a) => a.filter((b) => b !== s));
                    if (i === 0) {
                      inputRef.current?.focus();
                    } else {
                      buttonRefs.current[i - 1]?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      setSelected((a) => a.filter((b) => b !== s));
                      if (i === 0) {
                        inputRef.current?.focus();
                      } else {
                        buttonRefs.current[i - 1]?.focus();
                      }
                    }
                  }}
                  tabIndex={0}
                >
                  {s}
                  <XMarkIcon className="size-4 text-rose-500" />
                </button>
              ))}
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => {
                  let temp = e.target.value as string;
                  if (temp.match(/[ ,]/g)) processInput(temp);
                  else setValue(temp);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    processInput(value);
                  }
                }}
                onBlur={() => {
                  processInput(value);
                }}
                className="bg-transparent outline-none ring-0 flex-1"
                placeholder="Type or paste in emails..."
                autoComplete="false"
              />
            </div>
          </div>
        </div>
      </div>
      <form action={action}>
        {selected.map((s) => (
          <input
            className="hidden"
            name="selected"
            readOnly
            value={s}
            key={s}
          />
        ))}
        <button
          className="w-full md:w-fit h-fit bg-ncssm-green  text-white brutal-sm px-4 font-bold"
          type="submit"
          aria-disabled={pending}
        >
          Creat{pending ? "ing" : "e"} Accounts
        </button>
        <p>{_state}</p>
      </form>
    </div>
  );
};

export default CreateAccountsClient;
