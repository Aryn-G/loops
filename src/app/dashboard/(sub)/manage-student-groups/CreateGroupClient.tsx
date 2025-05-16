"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { createGroup } from "./actions";
import { InboxStackIcon, UserPlusIcon } from "@heroicons/react/24/outline";

import { IGroup } from "@/app/_db/models/Group";
import Input from "@/app/_components/Inputs/Input";
import { getGroups } from "@/app/_db/queries/groups";
import { EMAIL_PATTERN } from "@/app/_lib/constants";
import MultiSelect from "@/app/_components/Inputs/MultiSelect";
import { getFilteredUsers } from "@/app/_db/queries/users";
import toast from "@/app/_components/Toasts/toast";

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
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (!pending) {
      if (_state == "Success") {
        toast({
          title: "Success",
          description: "Created group",
          button: {
            label: "Close",
            onClick: () => {},
          },
        });
      }
      setGroupName("");
      setSelected([]);
      setSelectedGroups([]);
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
          id={(u) => u._id}
          render={(u) => u.email}
          filter={(u) => `${u.name} <${u.email}>`}
          placeholder="Type or paste in emails..."
        />
      </div>
      <div className="w-full">
        <label htmlFor="textarea" className="font-bold block my-1">
          Subgroups
        </label>
        <MultiSelect
          icon={<InboxStackIcon className="size-6 flex-shrink-0" />}
          allItems={allGroups}
          maxSearch={3}
          selected={selectedGroups}
          setSelected={setSelectedGroups}
          id={(u) => u._id}
          render={(u) => u.name}
          filter={(u) => u.name}
          placeholder="Type or paste in group names..."
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
        {selectedGroups.map((s) => (
          <input
            className="hidden"
            name="subgroups"
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
