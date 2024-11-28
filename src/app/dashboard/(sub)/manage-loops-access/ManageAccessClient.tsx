"use client";

import React, { useActionState, useRef, useState } from "react";
import { removeAccessAction } from "./actions";

import Search from "@/app/_icons/Search";
import Trash from "@/app/_icons/Trash";
import Pagination from "@/app/_components/Pagination";
import Image from "next/image";
import { getFilteredUsers } from "@/app/_lib/users";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import XMark from "@/app/_icons/XMark";

type FilteredUser = Awaited<ReturnType<typeof getFilteredUsers>>[number];

type Props = {
  allUsers: FilteredUser[];
};

const ManageAccessClient = (props: Props) => {
  const loopsAccess = props.allUsers.filter((u) => u.role === "Loops");

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const updateSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("p", "1");
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }, 300);

  const query = searchParams.get("q") ?? "";
  const [q, setQ] = useState(query);
  const filtered = loopsAccess.filter(
    (l) =>
      l.email.toLowerCase().includes(query.toLowerCase()) ||
      l.name.toLowerCase().includes(query.toLowerCase())
  );

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex flex-1 gap-2 px-4 brutal-sm focus-within:outline">
        <Search />
        <input
          type="text"
          name="q"
          value={q}
          className="bg-transparent outline-none ring-0 flex-1"
          placeholder="Search Loops Access..."
          onChange={(e) => {
            setQ(e.target.value);
            updateSearch(e.target.value);
          }}
          ref={inputRef}
        />
        {q && (
          <button
            className="size-6"
            onClick={() => {
              setQ("");
              updateSearch("");
            }}
          >
            <XMark />
          </button>
        )}
      </div>
      {filtered.length === 0 ? (
        <p className="text-center pt-3">
          {query ? `No Results for ` : "No Loops Access Accounts Exist"}
          {query && <span className="font-bold">{`"${query}"`}</span>}
        </p>
      ) : (
        <Pagination
          itemsPerPage={6}
          className="divide-y divide-black flex flex-col md:gap-2"
        >
          {filtered.map((u) => (
            <PersonCard u={u} key={u._id} />
          ))}
        </Pagination>
      )}
    </>
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
            className="brutal-sm p-0 size-10 md:size-12"
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
        <input className="hidden" name="remove" readOnly value={u._id} />
        <button
          className="text-sm w-fit text-white flex items-center justify-center gap-2 h-fit bg-rose-500 brutal-sm md:px-4 font-bold"
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
