"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { removeSubgroup } from "./actions";

import { formatDate, isDateBetween, toISOStringOffset } from "@/app/_lib/time";

import Search, { CheckBoxFilter } from "@/app/_components/Search";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import {
  useManyParams,
  useSearchParam,
} from "@/app/_lib/use-hooks/useSearchParam";
import title from "title";
import { getFilteredUsers } from "@/app/_db/queries/users";
import Image from "next/image";
import { Session } from "next-auth";
import { getGroup, getGroups } from "@/app/_db/queries/groups";
import Link from "next/link";
import toast from "@/app/_components/Toasts/toast";

type Props = {
  group: NonNullable<Awaited<ReturnType<typeof getGroup>>>;
};

const ManageSubgroups = ({ group }: Props) => {
  return (
    <>
      {group.subgroups.length === 0 ? (
        <span className="block my-2">No Subgroups Exist</span>
      ) : (
        group.subgroups
          .sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          )
          .map((sg, i) => (
            <GroupCard key={String(sg._id)} group={group} subgroup={sg} />
          ))
      )}
    </>
  );
};

const GroupCard = ({
  group,
  subgroup,
}: {
  group: NonNullable<Awaited<ReturnType<typeof getGroup>>>;
  subgroup: NonNullable<
    Awaited<ReturnType<typeof getGroup>>
  >["subgroups"][number];
}) => {
  const [_state, action, pending] = useActionState(removeSubgroup, "");

  useEffect(() => {
    if (!pending) {
      if (_state == "Success") {
        toast({
          title: "Success",
          description: "Removed subgroup",
          button: {
            label: "Close",
            onClick: () => {},
          },
        });
      }
    }
  }, [pending]);

  return (
    <div className="py-3 flex flex-row gap-2 w-full items-center justify-center">
      <div className="flex gap-2 flex-1 w-full items-center">
        <div className="flex flex-col flex-1">
          <p
            className={
              (subgroup.deleted && "text-rose-700") +
              " text-base md:text-lg font-bold"
            }
          >
            {subgroup.deleted && "(Deleted) "}
            {subgroup.name}
          </p>
          {/* <p className="text-base">{group.users.join(", ")}</p> */}
          <p className="text-base">
            Contains {subgroup.count}{" "}
            {subgroup.count === 1 ? "Person" : "People"}
          </p>
        </div>
      </div>

      <Link
        href={"/dashboard/manage-student-groups/" + String(subgroup._id)}
        className="text-sm w-fit flex items-center justify-center gap-2 h-fit brutal-sm md:px-4 font-bold"
      >
        Edit
      </Link>
      <form action={action} className="flex-shrink-0 w-fit">
        <input
          className="hidden"
          name="group"
          readOnly
          value={String(group._id)}
        />
        <input
          className="hidden"
          name="remove"
          readOnly
          value={String(subgroup._id)}
        />
        <button
          className="bg-rose-500 brutal-sm text-sm w-fit text-white flex items-center justify-center gap-2 h-fit md:px-4 font-bold"
          type="submit"
          aria-disabled={pending}
        >
          Remov{pending ? "ing" : "e"}
        </button>
      </form>
    </div>
  );
};

export default ManageSubgroups;
