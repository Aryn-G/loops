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
import { useSearchParam } from "../_lib/use-hooks/useSearchParam";
import Search, { SearchFilters } from "../_components/Search";

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

  return (
    <Search
      all={allLoops}
      name="Loops"
      inputClassName="my-5 max-w-lg mx-auto flex flex-col gap-2"
      itemsPerPage={6}
      paginationClassName="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-6"
      render={(item, i) => (
        <div className="brutal-md p-6 flex flex-col" key={String(item._id)}>
          <LoopCard data={item} />
          {/* <SignUpButton loop={item}  /> */}
          <Link
            className={
              getButtonColor(i) +
              " brutal-md font-bold w-full flex items-center justify-center h-11 mt-3"
            }
            href={"/loops/" + String(item._id)}
          >
            See More
          </Link>
        </div>
      )}
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
          .filter((item) => {
            const queryMatches =
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase());

            const timingMatches = isDateBetween(
              filters["start"] ? filters["start"] + "T00:00" : undefined,
              item.departureDateTime,
              filters["end"] ? filters["end"] + "T23:59" : undefined
            );

            return queryMatches && timingMatches;
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
    </Search>
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
