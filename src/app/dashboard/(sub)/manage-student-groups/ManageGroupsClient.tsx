"use client";

import React, { useActionState, useRef, useState } from "react";
import { removeGroup } from "./actions";

import Pagination from "@/app/_components/Pagination";
import { getGroups } from "@/app/_db/queries/groups";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useSearchParam } from "@/app/_lib/use-hooks/useSearchParams";

type Props = {
  allGroups: Awaited<ReturnType<typeof getGroups>>;
};

const ManageGroupsClient = ({ allGroups }: Props) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [query, q, setQ, updateSearch] = useSearchParam("q");

  const deleted = searchParams.get("showDeleted") ?? "";

  const filtered = allGroups.filter(
    (group) =>
      ((!group.deleted || deleted) &&
        group.name.toLowerCase().includes(query.toLowerCase())) ||
      group.users.filter((v) => v.toLowerCase().includes(query.toLowerCase()))
        .length > 0
  );

  const [filters, setFilters] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div
        className="flex flex-1 gap-2 px-4 brutal-sm focus-within:[outline:-webkit-focus-ring-color_auto_1px]"
        tabIndex={-1}
      >
        <MagnifyingGlassIcon className="size-5 my-auto" />
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
            className="size-6 flex items-center justify-center"
            onClick={() => {
              setQ("");
              updateSearch("");
              inputRef.current?.focus();
            }}
          >
            <XMarkIcon className="size-5" />
          </button>
        )}
        <div className="w-0.5 rounded-full bg-neutral-200"></div>
        <button
          className="px-2 text-nowrap"
          onClick={() => setFilters((f) => !f)}
        >
          {!filters ? "Show " : "Hide "}Filters
        </button>
      </div>
      {filters && (
        <>
          <button
            className="block w-full text-start underline underline-offset-2"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              if (deleted != "true") {
                params.set("showDeleted", "true");
              } else {
                // params.set("showDeleted", "");
                params.delete("showDeleted");
              }
              replace(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
          >
            {!deleted ? "Show" : "Hide"} Deleted
          </button>
          <button
            className="block w-full text-start underline underline-offset-2"
            onClick={() => {
              const params = new URLSearchParams(searchParams);

              params.delete("showDeleted");

              replace(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
          >
            Reset
          </button>
        </>
      )}
      <Pagination
        itemsPerPage={6}
        className="divide-y divide-black flex flex-col md:gap-2"
        filterString={
          <>
            {filtered.length === 0
              ? query
                ? `No Results `
                : "No Student Groups Exist"
              : ""}
            {query && "for "}
            {query && <span className="font-bold">{`"${query}"`}</span>}
          </>
        }
      >
        {filtered.map((group) => (
          <GroupCard group={group} key={group.name} />
        ))}
      </Pagination>
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

      <Link
        href={"/dashboard/manage-student-groups/" + String(group._id)}
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
        <button
          className={
            (group.deleted ? "bg-ncssm-green" : "bg-rose-500") +
            " brutal-sm text-sm w-fit text-white flex items-center justify-center gap-2 h-fit md:px-4 font-bold"
          }
          type="submit"
          aria-disabled={pending}
        >
          {group.deleted ? "Restor" : "Delet"}
          {pending ? "ing" : "e"}
        </button>
      </form>
    </div>
  );
};

export default ManageGroupsClient;
