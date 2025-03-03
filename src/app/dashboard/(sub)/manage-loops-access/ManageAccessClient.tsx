"use client";

import React, { useActionState, useRef, useState } from "react";
import { removeAccessAction } from "./actions";

import Pagination from "@/app/_components/Pagination";
import Image from "next/image";
import { getFilteredUsers } from "@/app/_db/queries/users";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useSearchParam } from "@/app/_lib/use-hooks/useSearchParam";
import Search from "@/app/_components/Search";

type FilteredUser = Awaited<ReturnType<typeof getFilteredUsers>>[number];

type Props = {
  allUsers: FilteredUser[];
};

const ManageAccessClient = (props: Props) => {
  const loopsAccess = props.allUsers.filter((u) => u.role === "Loops");

  return (
    <Search
      all={loopsAccess}
      name="Loops Access"
      render={(item, i) => <PersonCard u={item} key={item._id} />}
      inputClassName=""
      itemsPerPage={6}
      paginationClassName="divide-y divide-black flex flex-col md:gap-2"
      filterString={(filtered, filters, query) => (
        <>
          {filtered.length === 0
            ? query
              ? `No Results `
              : "No Access Accounts Exist"
            : ""}
          {query && "for "}
          {query && <span className="font-bold">{`"${query}"`}</span>}
        </>
      )}
      filterLogic={(all, filters, query) =>
        all
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(
            (l) =>
              l.email.toLowerCase().includes(query.toLowerCase()) ||
              l.name.toLowerCase().includes(query.toLowerCase())
          )
      }
    />
  );
};

const PersonCard = ({ u }: { u: FilteredUser }) => {
  const [_state, action, pending] = useActionState(removeAccessAction, "");

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
          <p className="text-sm md:text-base font-thin break-words">
            {u.email}
          </p>
        </div>
      </div>
      <form action={action} className="flex-shrink-0 w-fit">
        <input className="hidden" name="remove" readOnly value={u._id} />
        <button
          className=" text-sm w-fit text-white flex items-center justify-center gap-2 h-fit bg-rose-500 brutal-sm md:px-4 font-bold"
          type="submit"
          aria-disabled={pending}
        >
          Remov{pending ? "ing" : "e"} Access
        </button>
      </form>
    </div>
  );
};

export default ManageAccessClient;
