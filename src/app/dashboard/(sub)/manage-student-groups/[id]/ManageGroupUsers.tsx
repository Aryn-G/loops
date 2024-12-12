"use client";

import React, { useActionState, useRef, useState } from "react";
import { removeFromGroup } from "./actions";

import Image from "next/image";
import { getGroup } from "@/app/_db/queries/groups";

type Group = NonNullable<Awaited<ReturnType<typeof getGroup>>>;
type Props = {
  group: Group;
};

const ManageGroupUsers = (props: Props) => {
  //   console.log(props.group);

  return (
    <div className="divide-y divide-black flex flex-col md:gap-2">
      {props.group.users.map((u) => (
        <PersonCard u={u} group={props.group._id} key={u._id} />
      ))}
    </div>
  );
};

const PersonCard = ({
  u,
  group,
}: {
  u: Group["users"][number];
  group: string;
}) => {
  const [_state, action, pending] = useActionState(removeFromGroup, "");

  return (
    <div
      // key={u._id}
      className="py-3 flex flex-row gap-2 w-full items-center justify-center"
    >
      <div className="flex gap-2 flex-1 w-full items-center">
        {u.picture && (
          <Image
            src={u.picture}
            alt="profile pic"
            className="brutal-sm p-0 size-10 md:size-12 select-none pointer-events-none"
            width={48}
            height={48}
            unoptimized
            referrerPolicy="no-referrer"
          />
        )}
        <div className="flex flex-col flex-1">
          <p className="text-base md:text-lg font-bold">{u.name}</p>
          <p className="text-sm md:text-base font-thin break-all">{u.email}</p>
        </div>
      </div>
      <form action={action} className="flex-shrink-0 w-fit">
        <input className="hidden" name="group" readOnly value={group} />
        <input className="hidden" name="remove" readOnly value={u._id} />
        <button
          className=" text-sm w-fit text-white flex items-center justify-center gap-2 h-fit bg-rose-500 brutal-sm md:px-4 font-bold"
          type="submit"
          aria-disabled={pending}
        >
          Remov{pending ? "ing" : "e"}
        </button>
      </form>
    </div>
  );
};

export default ManageGroupUsers;
