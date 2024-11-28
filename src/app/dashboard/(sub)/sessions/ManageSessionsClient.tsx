"use client";

import React, { useActionState, useRef, useState } from "react";
import { removeSession } from "./actions";

import Search from "@/app/_icons/Search";
import Trash from "@/app/_icons/Trash";
import Pagination from "@/app/_components/Pagination";
import Image from "next/image";
import XMark from "@/app/_icons/XMark";
import { getUserSessions } from "@/app/_lib/sessions";
import { Session } from "next-auth";
import title from "title";
import UserCircle from "@/app/_icons/UserCircle";
import Phone from "@/app/_icons/Phone";
import Desktop from "@/app/_icons/Desktop";

type CustomSession = Awaited<ReturnType<typeof getUserSessions>>[number];

type Props = {
  userSessions: CustomSession[];
  session: Session;
};

const ManageAccessClient = (props: Props) => {
  const [_state, action, pending] = useActionState(removeSession, "");
  const filtered = props.userSessions.filter((s) => s.id !== props.session.id);

  return (
    <div>
      <p className="font-black text-xl">Current Session</p>
      <SessionCard s={props.session} ping />
      <br />
      <div className="w-full flex flex-wrap items-center justify-between gap-2">
        <p className="font-black text-xl">Other Sessions</p>

        {filtered.length !== 0 && (
          <form action={action} className="flex-shrink-0 w-fit">
            {filtered.map((s) => (
              <input
                className="hidden"
                name="remove"
                readOnly
                value={s.id}
                key={s.id}
              />
            ))}
            <button
              className="text-sm w-fit text-white flex items-center justify-center gap-2 h-fit bg-rose-500 brutal-sm md:px-4 font-bold"
              type="submit"
              aria-disabled={pending}
            >
              Revok{pending ? "ing" : "e"} All Other Sessions
            </button>
          </form>
        )}
      </div>
      <div className="divide-y divide-black flex flex-col md:gap-2">
        {filtered.length === 0 ? (
          <p className="">No Other Sessions Exist</p>
        ) : (
          filtered.map((s) => <SessionCard s={s} key={s.id} />)
        )}
      </div>
    </div>
  );
};

const SessionCard = ({
  s,
  ping = false,
}: {
  s: CustomSession | Session;
  ping?: boolean;
}) => {
  const [_state, action, pending] = useActionState(removeSession, "");

  console.log(s);

  const formatDate = (d: Date | string) => {
    if (typeof d === "string") {
      d = new Date(d);
    }
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      // key={u._id}
      className="py-3 flex flex-row gap-2 w-full items-center justify-center"
    >
      <div className="flex gap-2 flex-1 w-full items-center">
        <div className="size-10 p-2 relative">
          {ping && (
            <span className="absolute top-0 right-0 w-3 h-3 flex">
              <span className="absolute w-3 h-3 rounded-full bg-ncssm-blue opacity-75 animate-ping"></span>
              <span className="relative w-3 h-3 rounded-full bg-ncssm-blue"></span>
            </span>
          )}
          {s.device == "mobile" ? <Phone /> : <Desktop />}
        </div>
        <div className="flex flex-col flex-1">
          <p className="text-base md:text-lg font-light">
            <span className="font-bold">
              {title(
                s.device == "mobile"
                  ? `${s.deviceVendor} ${s.deviceModel}`
                  : s.device
              )}
            </span>
            <span className=""> - {s.ip}</span>
          </p>
          <p className="text-sm md:text-base font-light break-all">
            <span className="font-semibold">{title(s.browser)} </span>
            on
            <span className="italic"> {title(s.os)}</span>
          </p>
          <p className="text-sm md:text-base font-light break-all">
            <span className="font-semibold">Created At: </span>
            <span className="italic"> {formatDate(s.createdAt)}</span>
          </p>
          <p className="text-sm md:text-base font-light break-all">
            <span className="font-semibold">Last Accessed: </span>
            <span className="italic"> {formatDate(s.updatedAt)}</span>
          </p>
        </div>
      </div>
      {!ping && (
        <form action={action} className="flex-shrink-0 w-fit">
          <input className="hidden" name="remove" readOnly value={s.id} />
          <button
            className="text-sm w-fit text-white flex items-center justify-center gap-2 h-fit bg-rose-500 brutal-sm md:px-4 font-bold"
            type="submit"
            aria-disabled={pending}
          >
            Revok{pending ? "ing" : "e"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ManageAccessClient;
