"use client";

import React, { useActionState, useRef, useState } from "react";
import { removeLoop } from "./actions";

import Pagination from "@/app/_components/Pagination";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";
import { getLoops } from "@/app/_db/queries/loops";
import { formatDate, isDateBetween, toISOStringOffset } from "@/app/_lib/time";
import Input from "@/app/_components/Inputs/Input";
import title from "title";
import LoopCard from "@/app/_components/LoopCard";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useSearchParam } from "@/app/_lib/use-hooks/useSearchParam";
import Search, { SearchFilters } from "@/app/_components/Search";
import { objectMap } from "@/app/_lib/util";

type Props = {
  allLoops: Awaited<ReturnType<typeof getLoops>>;
};

const ManageLoopsClient = ({ allLoops }: Props) => {
  return (
    <Search
      all={allLoops}
      name="Loops"
      inputClassName="flex flex-col gap-2"
      itemsPerPage={6}
      paginationClassName="grid grid-cols-1  @2xl:grid-cols-2 @4xl:grid-cols-3 gap-3 md:gap-6"
      render={(item) => <LoopCardR loop={item} key={String(item._id)} />}
      filterString={(filtered, filters, query) => (
        <>
          {filtered.length === 0
            ? query
              ? `No Results `
              : "No Loops Exist"
            : ""}
          {query && "for "}
          {query && <span className="font-bold">{`"${query}"`}</span>}
          {/* {title(formatDateFilter(filters["start"], endDateParam))} */}
          {filters["start"] && filters["end"]
            ? filters["start"] == filters["end"]
              ? ` on`
              : ` between`
            : filters["start"]
            ? " after"
            : filters["end"] && " before"}
          {filters["start"] && (
            <span className="font-bold">{` ${formatDate(
              filters["start"] + "T00:00",
              false
            )}`}</span>
          )}
          {filters["start"] &&
            filters["end"] &&
            filters["start"] != filters["end"] &&
            ` and`}
          {filters["end"] && filters["start"] != filters["end"] && (
            <span className="font-bold">{` ${formatDate(
              filters["end"] + "T23:59",
              false
            )}`}</span>
          )}
        </>
      )}
      filterLogic={(all, filters, query) => {
        return all
          .sort((a, b) =>
            new Date(a.departureDateTime) < new Date(b.departureDateTime)
              ? -1
              : 1
          )
          .filter((loop) => {
            const queryMatches =
              loop.title.toLowerCase().includes(query.toLowerCase()) ||
              loop.description.toLowerCase().includes(query.toLowerCase());

            const timingMatches = isDateBetween(
              filters["start"] ? filters["start"] + "T00:00" : undefined,
              toISOStringOffset(loop.departureDateTime),
              filters["end"] ? filters["end"] + "T23:59" : undefined
            );

            return (
              queryMatches &&
              timingMatches &&
              (!loop.deleted || filters["deleted"] == "true")
            );
          });
      }}
    >
      <div className="flex flex-col md:flex-row items-center gap-2">
        <SearchFilters
          name="start"
          defaultValue={toISOStringOffset(new Date()).slice(0, -6)}
          noDel
        >
          {(v, setV, updateV) => (
            <Input
              label="Starting: "
              type="date"
              name=""
              className="mb-1 md:mr-2"
              value={v ?? ""}
              setValue={(newValue) => {
                setV(newValue as string);
                updateV(newValue as string);
              }}
            />
          )}
        </SearchFilters>
        <SearchFilters name="end">
          {(v, setV, updateV) => (
            <Input
              label="Ending: "
              type="date"
              name=""
              className="mb-1"
              value={v ?? ""}
              setValue={(newValue) => {
                setV(newValue as string);
                updateV(newValue as string);
              }}
            />
          )}
        </SearchFilters>
      </div>
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

const LoopCardR = ({
  loop,
}: {
  loop: Awaited<ReturnType<typeof getLoops>>[number];
}) => {
  const [_state, action, pending] = useActionState(removeLoop, "");

  return (
    <div className="brutal-sm p-6 flex flex-col">
      <LoopCard data={loop} capDesc="line-clamp-1" />
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={"/loops/" + String(loop._id)}
          className="text-sm w-full flex items-center justify-center gap-2 h-fit brutal-sm md:px-4 font-bold"
        >
          Public Page
        </Link>
        <Link
          href={"/dashboard/manage-loops/" + String(loop._id)}
          className="text-sm w-full flex items-center justify-center gap-2 h-fit brutal-sm md:px-4 font-bold"
        >
          Edit
        </Link>
        <Link
          href={"/dashboard/manage-loops?autofill=" + String(loop._id)}
          className="text-sm w-full flex items-center justify-center gap-2 h-fit brutal-sm md:px-4 font-bold"
        >
          Duplicate
        </Link>
        <form action={action} className="flex-shrink-0 w-full">
          <input
            className="hidden"
            name="loop"
            readOnly
            value={String(loop._id)}
          />
          <button
            className={
              (loop.deleted ? "bg-ncssm-green" : "bg-rose-500") +
              " text-sm w-full text-white flex items-center justify-center gap-2 h-fit brutal-sm md:px-4 font-bold"
            }
            type="submit"
            aria-disabled={pending}
          >
            {loop.deleted ? "Restor" : "Delet"}
            {pending ? "ing" : "e"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageLoopsClient;
