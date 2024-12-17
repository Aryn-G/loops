"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { giveAccessAction } from "./actions";
import { UserPlusIcon } from "@heroicons/react/24/outline";

import { getFilteredUsers } from "@/app/_db/queries/users";
import MultiSelect from "@/app/_components/Inputs/MultiSelect";

type FilteredUser = Awaited<ReturnType<typeof getFilteredUsers>>[number];

type Props = {
  allUsers: FilteredUser[];
};

const GiveAccessClient = (props: Props) => {
  const [_state, action, pending] = useActionState(giveAccessAction, "");

  const students = props.allUsers.filter((u) => u.role === "Student");
  // const students = props.allUsers;

  const [selected, setSelected] = useState<FilteredUser[]>([]);

  useEffect(() => {
    if (selected.length > 0 && !pending) {
      setSelected([]);
    }
  }, [pending]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-2 my-3">
      <MultiSelect
        icon={<UserPlusIcon className="size-6 flex-shrink-0" />}
        allItems={students}
        maxSearch={3}
        selected={selected}
        setSelected={setSelected}
        keyFn={(u) => u._id}
        displayFn={(u) => u.email}
        placeholder="Type or paste in emails..."
      />
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
          className="w-full md:w-fit h-fit bg-ncssm-green  text-white brutal-sm px-4 font-bold"
          type="submit"
          aria-disabled={pending}
        >
          Giv{pending ? "ing" : "e"} Access
        </button>
      </form>
    </div>
  );
};

export default GiveAccessClient;
