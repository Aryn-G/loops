"use client";

import Input from "@/app/_components/Inputs/Input";
import { getGroup } from "@/app/_db/queries/groups";
import { useActionState, useState } from "react";
import { editGroup } from "./actions";

type Group = NonNullable<Awaited<ReturnType<typeof getGroup>>>;

type Props = {
  group: Group;
};

const EditGroup = ({ group }: Props) => {
  const [_state, action, pending] = useActionState(editGroup, "");

  const [groupName, setGroupName] = useState(group.name);

  return (
    <form
      action={action}
      className="w-full flex flex-col md:flex-row md:items-end md:gap-2 my-3"
    >
      <div className="flex flex-col flex-1">
        <Input
          name="name"
          label="Group Name"
          required
          value={groupName}
          setValue={(newValue) => setGroupName(newValue as string)}
        />
      </div>
      <div>
        <input className="hidden" name="group" readOnly value={group._id} />
        <button
          className=" w-full h-11 bg-ncssm-green text-white px-4 brutal-sm font-bold mt-2"
          type="submit"
          aria-disabled={pending}
        >
          Sav{pending ? "ing" : "e"} Name
        </button>
      </div>
    </form>
  );
};

export default EditGroup;
