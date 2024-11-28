"use client";

import React, { useActionState, useRef, useState } from "react";
import { removeGroup } from "./actions";

import Search from "@/app/_icons/Search";
import Trash from "@/app/_icons/Trash";
import Pagination from "@/app/_components/Pagination";
import { getGroups } from "@/app/_lib/groups";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import XMark from "@/app/_icons/XMark";

type Props = {
  allGroups: Awaited<ReturnType<typeof getGroups>>;
};

const ManageGroupsClient = ({ allGroups }: Props) => {
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
  const filtered = allGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(query.toLowerCase()) ||
      group.users.filter((v) => v.toLowerCase().includes(query.toLowerCase()))
        .length > 0
  );

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div
        className="flex flex-1 gap-2 px-4 brutal-sm focus-within:[outline:-webkit-focus-ring-color_auto_1px]"
        tabIndex={-1}
      >
        <Search />
        <input
          type="text"
          name="q"
          value={q}
          className="bg-transparent outline-none ring-0 flex-1"
          placeholder="Search Student Groups..."
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
              inputRef.current?.focus();
            }}
          >
            <XMark />
          </button>
        )}
      </div>
      {filtered.length === 0 ? (
        <p className="text-center pt-3">
          {query ? `No Results for ` : "No Student Groups Exist"}
          {query && <span className="font-bold">{`"${query}"`}</span>}
        </p>
      ) : (
        <Pagination
          itemsPerPage={6}
          className="divide-y divide-black flex flex-col md:gap-2"
        >
          {filtered.map((group) => (
            <GroupCard group={group} key={group.name} />
          ))}
        </Pagination>
      )}
    </>
  );
};

const GroupCard = ({
  group,
}: {
  group: Awaited<ReturnType<typeof getGroups>>[number];
}) => {
  const [_state, action, pending] = useActionState(removeGroup, "");

  return (
    <div className="py-3 flex flex-row gap-2 w-full items-center justify-center">
      <div className="flex gap-2 flex-1 w-full items-center">
        <div className="flex flex-col flex-1">
          <p className="text-base md:text-lg font-bold">
            {group.name} {group.deleted && "(Deleted)"}
          </p>
          <p className="text-base">{group.users.join(", ")}</p>
        </div>
      </div>

      <button className="text-sm w-fit flex items-center justify-center gap-2 h-fit brutal-sm md:px-4 font-bold">
        Edit
      </button>
      <form action={action} className="flex-shrink-0 w-fit">
        <input
          className="hidden"
          name="group"
          readOnly
          value={String(group._id)}
        />
        <button
          className="text-sm w-fit text-white flex items-center justify-center gap-2 h-fit bg-rose-500 brutal-sm md:px-4 font-bold"
          type="submit"
          aria-disabled={pending}
        >
          Delet{pending ? "ing" : "e"}
        </button>
      </form>
    </div>
  );
};

export default ManageGroupsClient;
