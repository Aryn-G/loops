"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";

import { Session } from "next-auth";
import title from "title";
import {
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/20/solid";
import { getUserGroups } from "@/app/_db/queries/groups";

type CustomGroup = Awaited<ReturnType<typeof getUserGroups>>[number];

type Props = {
  userGroups: CustomGroup[];
};

const MyGroupsClient = (props: Props) => {
  return (
    <div className="divide-y divide-black flex flex-col md:gap-2 items-center">
      {props.userGroups.length === 0 ? (
        <p className="">You aren{"'"}t in any student groups.</p>
      ) : (
        props.userGroups.map((group) => <Group group={group} key={group._id} />)
      )}
    </div>
  );
};

const Group = ({ group }: { group: CustomGroup }) => {
  return (
    <div className="py-3 flex flex-row gap-2 w-full items-center justify-center">
      <div className="flex gap-2 flex-1 w-full items-center">
        <div className="flex flex-col flex-1">
          <p
            className={
              (group.deleted && "text-rose-700") +
              " text-base md:text-lg font-bold"
            }
          >
            {group.deleted && "(Deleted) "}
            {group.name}
          </p>
          {/* <p className="text-base">{group.users.join(", ")}</p> */}
          <p className="text-base">Contains {group.users.length} People</p>
        </div>
      </div>
    </div>
  );
};

export default MyGroupsClient;
