"use client";

import React, { Fragment, useActionState, useEffect, useState } from "react";
import { Session } from "next-auth";
import { getLoop } from "@/app/_db/queries/loops";
import {
  formatDate,
  formatTime,
  isDateBetween,
  toISOStringOffset,
} from "@/app/_lib/time";
import Image from "next/image";
import { addSelfToLoop } from "./actions";
import { getButtonColor } from "../SearchLoops";

type Loop = NonNullable<Awaited<ReturnType<typeof getLoop>>>;

type Props = {
  loop: Loop;
  session: Session;
};

const SignUpButton = ({ loop, session }: Props) => {
  const [_state, action, pending] = useActionState(addSelfToLoop, "");

  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  const full = loop.filled.length === loop.capacity;

  const signedUp =
    loop.filled.find((f) => f.user._id === session.userId) !== undefined;

  const notOpenYet = isDateBetween(
    undefined,
    toISOStringOffset(dateTime),
    loop.signUpOpenDateTime
  );

  const windowPassed = isDateBetween(
    loop.departureDateTime,
    toISOStringOffset(dateTime),
    undefined
  );

  const signUpTextAndColor = () => {
    if (signedUp) return ["Signed Up", "bg-ncssm-green text-white"];
    if (full) return ["Sign-Ups Full", "bg-ncssm-purple text-white"];
    if (loop.deleted) return ["Loop Deleted", "bg-ncssm-purple text-white"];
    if (notOpenYet)
      return [
        `Sign-Ups Open ${formatDate(loop.signUpOpenDateTime)} at ${formatTime(
          loop.signUpOpenDateTime
        )}`,
        "bg-ncssm-yellow text-black",
      ];
    if (windowPassed) return ["Sign-Ups Closed", "bg-ncssm-purple text-white"];
    return [`Sign${pending ? "ing" : ""} Up`, "bg-ncssm-blue text-white"];
  };

  return (
    <>
      <form action={action}>
        <input className="hidden" name="loop" readOnly value={loop._id} />
        <input
          className="hidden"
          name="userId"
          readOnly
          value={session.userId}
        />
        <button
          className={`${
            signUpTextAndColor()[1]
          } brutal-md font-bold w-full flex items-center justify-center min-h-11 mt-3 px-4`}
          type="submit"
          aria-disabled={
            signedUp ||
            pending ||
            notOpenYet ||
            windowPassed ||
            full ||
            loop.deleted
          }
        >
          {signUpTextAndColor()[0]}
        </button>
        {_state !== "Success" && <p className="mt-2 text-rose-700">{_state}</p>}
      </form>
    </>
  );
};

export default SignUpButton;
