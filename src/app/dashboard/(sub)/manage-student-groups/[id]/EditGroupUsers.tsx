"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { UserPlusIcon } from "@heroicons/react/24/outline";

import { IGroup } from "@/app/_db/models/Group";
import Input from "@/app/_components/Inputs/Input";
import { getGroup, getGroups } from "@/app/_db/queries/groups";
import { EMAIL_PATTERN } from "@/app/_lib/constants";
import MultiSelect from "@/app/_components/Inputs/MultiSelect";
import { getFilteredUsers } from "@/app/_db/queries/users";
import { addStudents } from "./actions";

type FilteredUser = Awaited<ReturnType<typeof getFilteredUsers>>[number];
type Group = NonNullable<Awaited<ReturnType<typeof getGroup>>>;

type Props = {
  group: Group;
  allUsers: FilteredUser[];
};

const EditGroupUsers = (props: Props) => {
  const [_state, action, pending] = useActionState(addStudents, "");

  const filtered = props.allUsers.filter(
    (u) => props.group.users.find((u2) => u2._id === u._id) === undefined
  );
  // const filtered = props.allUsers;

  const [selected, setSelected] = useState<FilteredUser[]>([]);

  useEffect(() => {
    if (selected.length > 0 && !pending) {
      setSelected([]);
    }
  }, [pending]);

  return (
    <>
      <div className="font-bold block my-1">Users in Group</div>
      <div className="w-full flex flex-col md:flex-row gap-2 mt-1 mb-3">
        <MultiSelect
          icon={<UserPlusIcon className="size-6 flex-shrink-0" />}
          allItems={filtered}
          maxSearch={3}
          selected={selected}
          setSelected={setSelected}
          id={(u) => u._id}
          render={(u) => u.email}
          filter={(u) => `${u.name} <${u.email}>`}
          placeholder="Type or paste in emails..."
        />
        <form action={action}>
          <input
            className="hidden"
            name="group"
            readOnly
            value={props.group._id}
          />
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
            Add{pending ? "ing" : ""}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditGroupUsers;
