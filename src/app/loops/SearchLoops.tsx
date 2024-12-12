"use client";

import React, { useActionState, useRef, useState } from "react";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";

import Pagination from "@/app/_components/Pagination";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";
import { getLoops } from "@/app/_db/queries/loops";
import { formatDate, isDateBetween, toISOStringOffset } from "@/app/_lib/time";
import Input from "@/app/_components/Inputs/Input";
import LoopCard from "../_components/LoopCard";
import { useSearchParam } from "../_lib/use-hooks/useSearchParams";

type Props = {
  allLoops: Awaited<ReturnType<typeof getLoops>>;
};

const SearchLoops = ({ allLoops }: Props) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [query, q, setQ, updateSearch] = useSearchParam("q");

  const [startDateParam, startDate, setStartDate, updateStartFilter] =
    useSearchParam("start", toISOStringOffset(new Date()).slice(0, -6), false);

  const [endDateParam, endDate, setEndDate, updateEndFilter] =
    useSearchParam("end");

  const filtered = allLoops.filter((loop) => {
    const queryMatches =
      loop.title.toLowerCase().includes(query.toLowerCase()) ||
      loop.description.toLowerCase().includes(query.toLowerCase());

    const timingMatches = isDateBetween(
      startDateParam ? startDateParam + "T00:00" : undefined,
      loop.departureDateTime,
      endDateParam ? endDateParam + "T23:59" : undefined
    );

    return queryMatches && timingMatches;
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState(false);

  return (
    <>
      <div className="my-5 max-w-lg mx-auto flex flex-col gap-2">
        <div
          className="flex flex-1 gap-2 px-4 brutal-sm focus-within:[outline:-webkit-focus-ring-color_auto_1px]"
          tabIndex={-1}
        >
          <MagnifyingGlassIcon className="size-5 my-auto flex-shrink-0" />
          <input
            type="text"
            name="q"
            value={q}
            className="bg-transparent outline-none ring-0 w-full"
            placeholder="Search Loops..."
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
          <div className="flex flex-col">
            <div className="flex md:items-center gap-2 md:flex-row flex-col">
              <Input
                label="Starting: "
                type="date"
                name=""
                className="mb-1 md:mr-2 w-full"
                value={startDate ?? ""}
                setValue={(newValue) => {
                  setStartDate(newValue as string);
                  // setEndDate(newValue as string);
                  updateStartFilter(newValue as string);
                }}
              />
              <Input
                label="Ending: "
                type="date"
                name=""
                className="mb-1 w-full"
                value={endDate ?? ""}
                setValue={(newValue) => {
                  setEndDate(newValue as string);
                  updateEndFilter(newValue as string);
                }}
              />
            </div>
            <button
              className="block w-full text-start underline underline-offset-2"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete("start");
                params.delete("end");
                setStartDate(toISOStringOffset(new Date()).slice(0, -6));
                setEndDate("");
                replace(`${pathname}?${params.toString()}`, {
                  scroll: false,
                });
              }}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      <Pagination
        itemsPerPage={6}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-6"
        filterString={
          <>
            {filtered.length === 0
              ? query
                ? `No Results `
                : "No Loops Exist"
              : ""}
            {query && "for "}
            {query && <span className="font-bold">{`"${query}"`}</span>}
            {/* {title(formatDateFilter(startDateParam, endDateParam))} */}
            {startDateParam && endDateParam
              ? startDateParam == endDateParam
                ? ` on`
                : ` between`
              : startDateParam
              ? " after"
              : endDateParam && " before"}
            {startDateParam && (
              <span className="font-bold">{` ${formatDate(
                startDateParam + "T00:00",
                false
              )}`}</span>
            )}
            {startDateParam &&
              endDateParam &&
              startDateParam != endDateParam &&
              ` and`}
            {endDateParam && startDateParam != endDateParam && (
              <span className="font-bold">{` ${formatDate(
                endDateParam + "T23:59",
                false
              )}`}</span>
            )}
          </>
        }
      >
        {filtered
          .sort((a, b) =>
            new Date(a.departureDateTime) < new Date(b.departureDateTime)
              ? -1
              : 1
          )
          .map((loop, i) => (
            <div className="brutal-md p-6 flex flex-col" key={String(loop._id)}>
              <LoopCard data={loop} />
              {/* <SignUpButton loop={loop}  /> */}
              <Link
                className={
                  getButtonColor(i) +
                  " brutal-md font-bold w-full flex items-center justify-center h-11 mt-3"
                }
                href={"/loops/" + String(loop._id)}
              >
                See More
              </Link>
            </div>
          ))}
      </Pagination>
    </>
  );
};

export const getButtonColor = (i: number) =>
  [
    "bg-ncssm-orange text-black",
    "bg-ncssm-purple text-white",
    "bg-ncssm-green text-white",
    "bg-ncssm-blue text-white",
    "bg-ncssm-yellow text-black",
  ][i % 5];

export default SearchLoops;
