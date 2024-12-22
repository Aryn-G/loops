"use client";

import React, { Fragment, useActionState } from "react";
import { Session } from "next-auth";
import { getLoop } from "@/app/_db/queries/loops";
import { formatDate, formatTime, toISOStringOffset } from "@/app/_lib/time";
import Image from "next/image";
import { removeSelfFromLoop } from "./actions";

type Loop = NonNullable<Awaited<ReturnType<typeof getLoop>>>;

type Props = {
  loop: Loop;
  session: Session;
};

const SignUpInfo = ({ loop, session }: Props) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="w-fit grid grid-cols-[repeat(4,auto)] gap-x-1">
        {loop.reservations.map((res) => (
          <Fragment key={res.group._id}>
            <span className="text-center">
              {
                loop.filled.filter(
                  (f) => f.group && f.group._id == res.group._id
                ).length
              }
            </span>
            <span> / </span>
            <span className="text-center">{res.slots}</span>
            <span className="ml-2">
              {" "}
              Reservations for {res.group.name} filled
            </span>
          </Fragment>
        ))}
        <span className="text-center">
          {loop.filled.filter((f) => f.group === undefined).length}
        </span>
        <span> / </span>
        <span className="text-center">
          {loop.capacity -
            loop.reservations
              .map((r) => r.slots)
              .reduce((sum, r) => sum + r, 0)}
        </span>
        <span className="ml-2"> Unreserved slots filled</span>
      </div>
      <div className="mt-4 divide-y divide-black flex flex-col md:gap-2 items-center">
        {loop.filled.length === 0
          ? "No one has signed up yet"
          : loop.filled.map((u) => (
              <PersonCard
                u={u}
                loop={loop._id}
                userId={session.userId}
                key={u.user._id}
              />
            ))}
      </div>
    </div>
  );
};

const PersonCard = ({
  u,
  loop,
  userId,
}: {
  u: Loop["filled"][number];
  loop: string;
  userId: string;
}) => {
  const [_state, action, pending] = useActionState(removeSelfFromLoop, "");

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
          <p className="text-base font-bold">{u.user.name}</p>
          <p className="text-sm font-thin break-all">{u.user.email}</p>
          <p className="text-sm font-thin break-all">
            {formatDate(toISOStringOffset(u.createdAt), false)}{" "}
            {formatTime(toISOStringOffset(u.createdAt))}
            {/* {toISOStringOffset(u.createdAt)} */}
          </p>
          {u.group && (
            <p className="text-sm break-all">{u.group.name} Reservation</p>
          )}
        </div>
      </div>
      {userId === u.user._id && (
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
      )}
    </div>
  );
};

export default SignUpInfo;
