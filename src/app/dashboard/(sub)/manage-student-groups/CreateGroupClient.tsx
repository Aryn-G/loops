"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { createGroup } from "./actions";
import { UserPlusIcon } from "@heroicons/react/24/outline";

import { IGroup } from "@/app/_db/models/Group";
import Input from "@/app/_components/Inputs/Input";
import { getGroups } from "@/app/_db/queries/groups";
import { EMAIL_PATTERN } from "@/app/_lib/constants";
import MultiSelect from "@/app/_components/Inputs/MultiSelect";
import { getFilteredUsers } from "@/app/_db/queries/users";

type FilteredUser = Awaited<ReturnType<typeof getFilteredUsers>>[number];
type Group = Awaited<ReturnType<typeof getGroups>>[number];

type Props = {
  allGroups: Group[];
  allUsers: FilteredUser[];
};

const CreateGroupClient = ({ allGroups, allUsers }: Props) => {
  const [_state, action, pending] = useActionState(createGroup, "");

  const [groupName, setGroupName] = useState("");

  const [selected, setSelected] = useState<FilteredUser[]>([]);

  useEffect(() => {
    if (!pending) {
      setGroupName("");
      setSelected([]);
    }
  }, [pending]);

  return (
    <form action={action} className="w-full flex flex-col gap-2 my-3">
      <div className="flex flex-col">
        <Input
          name="name"
          label="Group Name"
          required
          value={groupName}
          setValue={(newValue) => setGroupName(newValue as string)}
        />
      </div>
      <div className="w-full">
        <label htmlFor="textarea" className="font-bold block my-1">
          Users in Group
        </label>
        <MultiSelect
          icon={<UserPlusIcon className="size-6 flex-shrink-0" />}
          allItems={allUsers}
          maxSearch={3}
          selected={selected}
          setSelected={setSelected}
          keyFn={(u) => u._id}
          displayFn={(u) => u.email}
          placeholder="Type or paste in emails..."
        />
      </div>
      <div>
        {selected.map((s) => (
          <input
            className="hidden"
            name="users"
            readOnly
            value={s._id}
            key={s._id}
          />
        ))}
        <button
          className=" w-full h-fit bg-ncssm-green text-white px-4 brutal-sm font-bold mt-2"
          type="submit"
          aria-disabled={pending}
        >
          Creat{pending ? "ing" : "e"} Group
        </button>
      </div>
    </form>
  );
};

export default CreateGroupClient;
