"use client";

import React, { useActionState } from "react";
import { removeFromLoop } from "./actions";

import Image from "next/image";
import { getLoop } from "@/app/_db/queries/loops";
import { formatDate, formatTime, toISOStringOffset } from "@/app/_lib/time";

type Loop = NonNullable<Awaited<ReturnType<typeof getLoop>>>;
type Props = {
  loop: Loop;
};

const ManageLoopSignUps = (props: Props) => {
  return (
    <div className="divide-y divide-black flex flex-col md:gap-2">
      {props.loop.filled.map((u) => (
        <PersonCard u={u} loop={props.loop._id} key={u.user._id} />
      ))}
    </div>
  );
};

const PersonCard = ({
  u,
  loop,
}: {
  u: Loop["filled"][number];
  loop: string;
}) => {
  const [_state, action, pending] = useActionState(removeFromLoop, "");

  return (
    <div
      // key={u._id}
      className="py-3 flex flex-row gap-2 w-full items-center justify-center"
    >
      <div className="flex gap-2 flex-1 w-full items-center">
        {u.user.picture && (
          <Image
            src={u.user.picture}
            alt="profile pic"
            className="brutal-sm p-0 size-10 md:size-12 select-none pointer-events-none"
            width={48}
            height={48}
            unoptimized
            referrerPolicy="no-referrer"
          />
        )}
        <div className="flex flex-col flex-1">
          <p className="text-base md:text-lg font-bold">{u.user.name}</p>
          <p className="text-sm md:text-base font-thin break-words">
            {u.user.email}
          </p>
          <p className="text-sm md:text-base font-thin break-words">
            {formatDate(toISOStringOffset(u.createdAt), false)}{" "}
            {formatTime(toISOStringOffset(u.createdAt))}
            {/* {toISOStringOffset(u.createdAt)} */}
          </p>
          {u.group && (
            <p className="text-sm md:text-base break-words">
              {u.group.name} Reservation
            </p>
          )}
        </div>
      </div>
      <form action={action} className="flex-shrink-0 w-fit">
        <input className="hidden" name="loop" readOnly value={loop} />
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

export default ManageLoopSignUps;
