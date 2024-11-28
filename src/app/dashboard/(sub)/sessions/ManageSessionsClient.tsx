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
  const filtered = props.userSessions.filter((s) => s.id !== props.session.id);
  return (
    <div>
      <p className="font-black text-xl">Current Session</p>
      <SessionCard s={props.session} />
      <br />
      <p className="font-black text-xl">Other Sessions</p>
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

const SessionCard = ({ s }: { s: CustomSession | Session }) => {
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
        <div className="size-10 p-2">
          {s.device == "phone" ? <Phone /> : <Desktop />}
        </div>
        <div className="flex flex-col flex-1">
          <p className="text-base md:text-lg font-light">
            <span className="font-bold">{title(s.device)}</span>
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
    </div>
  );
};

export default ManageAccessClient;
