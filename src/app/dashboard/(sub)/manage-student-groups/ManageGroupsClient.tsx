"use client";

import React, { useActionState, useRef, useState } from "react";
import { removeGroup } from "./actions";

import Pagination from "@/app/_components/Pagination";
import { getGroups } from "@/app/_db/queries/groups";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useSearchParam } from "@/app/_lib/use-hooks/useSearchParam";
import Search, { SearchFilters } from "@/app/_components/Search";

type Props = {
  allGroups: Awaited<ReturnType<typeof getGroups>>;
};

const ManageGroupsClient = ({ allGroups }: Props) => {
  return (
    <Search
      name="Student Groups"
      all={allGroups}
      inputClassName=""
      paginationClassName="divide-y divide-black flex flex-col md:gap-2"
      itemsPerPage={6}
      render={(item) => <GroupCard group={item} key={item._id} />}
      filterLogic={(all, filters, query) => {
        return all
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(
            (group) =>
              ((!group.deleted || filters["deleted"] == "true") &&
                group.name.toLowerCase().includes(query.toLowerCase())) ||
              group.users.filter((v) =>
                v.toLowerCase().includes(query.toLowerCase())
              ).length > 0
          );
      }}
      filterString={(filtered, filters, query) => (
        <>
          {filtered.length === 0
            ? query
              ? `No Results `
              : "No Student Groups Exist"
            : ""}
          {query && "for "}
          {query && <span className="font-bold">{`"${query}"`}</span>}
        </>
      )}
    >
      <SearchFilters name="deleted" debounceDelay={0}>
        {(v, setV, updateV) => (
          <button
            className="block w-full text-start underline underline-offset-2 my-2"
            onClick={() => {
              updateV(v == "true" ? "" : "true");
              setV(v == "true" ? "" : "true");
            }}
          >
            {v == "true" ? "Hide" : "Show"} Deleted
          </button>
        )}
      </SearchFilters>
    </Search>
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
