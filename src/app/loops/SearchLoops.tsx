"use client";

import React, { useContext, useEffect, useState } from "react";

import Link from "next/link";
import { getLoops } from "@/app/_db/queries/loops";
import { formatDate, isDateBetween, toISOStringOffset } from "@/app/_lib/time";
import Input from "@/app/_components/Inputs/Input";
import LoopCard from "../_components/LoopCard";
import Search, { SearchContext, SearchFilters } from "../_components/Search";
import {
  ArrowLongRightIcon,
  CalendarDateRangeIcon,
} from "@heroicons/react/24/outline";

type Props = {
  allLoops: Awaited<ReturnType<typeof getLoops>>;
};

const SearchLoops = ({ allLoops }: Props) => {
  const today = new Date();
  const yesterday = new Date(new Date(today).setDate(today.getDate() - 1));
  const thisWeekStart = new Date(
    new Date(today).setDate(today.getDate() - ((today.getDay() + 6) % 7))
  );
  const thisWeekEnd = new Date(
    new Date(today).setDate(today.getDate() + (7 - (today.getDay() % 7)))
  );

  const opts = [
    {
      title: "Custom",
    },
    {
      title: "Yesterday",
      start: toISOStringOffset(yesterday).slice(0, -6),
      end: toISOStringOffset(yesterday).slice(0, -6),
    },
    {
      title: "Today",
      start: toISOStringOffset(today).slice(0, -6),
      end: toISOStringOffset(today).slice(0, -6),
    },
    {
      title: "Week",
      start: toISOStringOffset(thisWeekStart).slice(0, -6),
      end: toISOStringOffset(thisWeekEnd).slice(0, -6),
    },
    {
      title: "All Future",
      start: toISOStringOffset(today).slice(0, -6),
      end: null,
    },
  ];

  const [dateOpt, setDateOpt] = useState<(typeof opts)[0]>();

  useEffect(() => {
    setDateOpt(opts[3]);
  }, []);

  return (
    <Search
      all={allLoops}
      name="Loops"
      inputClassName="my-5 max-w-xl mx-auto flex flex-col gap-2"
      itemsPerPage={6}
      paginationClassName="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6"
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
          .sort((a, b) => (a.departureDateTime < b.departureDateTime ? -1 : 1))
          .filter((item) => {
            const queryMatches =
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase());

            const timingMatches = isDateBetween(
              filters["start"] ? filters["start"] + "T00:00" : undefined,
              toISOStringOffset(item.departureDateTime),
              filters["end"] ? filters["end"] + "T23:59" : undefined
            );

            return queryMatches && timingMatches;
          });
      }}
    >
      {(states) => (
        <div className="w-full flex flex-row md:flex-col gap-2">
          <div className="flex items-center gap-2 mt-2">
            <CalendarDateRangeIcon className="size-6" />
            <p className="font-bold flex-1">Date Range</p>
            <button
              className="underline underline-offset-2"
              onClick={() => setDateOpt(opts[3])}
            >
              Reset
            </button>
          </div>
          <div className="w-full flex flex-col md:flex-row brutal-sm gap-2 items-center justify-center p-3 md:p-2">
            {opts.map((opt, i) => (
              <div
                className="flex md:flex-row flex-col gap-3 md:w-fit w-full"
                key={i}
              >
                {i != 0 && (
                  <div className="md:w-0.5 w-full h-0.5 md:h-auto rounded-full bg-neutral-200"></div>
                )}
                <button
                  onClick={() => {
                    setDateOpt(opt);
                    if (opt.start != undefined) {
                      states["start"](opt.start ?? "");
                    }
                    if (opt.end != undefined) {
                      states["end"](opt.end ?? "");
                    }
                  }}
                  className="flex items-center md:justify-center md:gap-2 gap-3"
                >
                  <div className="rounded-full brutal-sm flex items-center justify-center size-4">
                    {dateOpt?.title == opt.title && (
                      <div className="flex-shrink-0 rounded-full size-3 bg-black"></div>
                    )}
                  </div>
                  {opt.title}
                </button>
              </div>
            ))}
          </div>
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3">
            <SearchFilters
              name="start"
              defaultValue={toISOStringOffset(thisWeekStart).slice(0, -6)}
              noDel
            >
              {(v, setV, updateV) => (
                <Input
                  type="date"
                  name=""
                  className="md:flex-1"
                  value={v ?? ""}
                  setValue={(newValue) => {
                    setV(newValue as string);
                    updateV(newValue as string);
                  }}
                />
              )}
            </SearchFilters>
            <ArrowLongRightIcon className="size-6 md:rotate-0 rotate-90" />
            <SearchFilters
              name="end"
              defaultValue={toISOStringOffset(thisWeekEnd).slice(0, -6)}
            >
              {(v, setV, updateV) => (
                <Input
                  type="date"
                  name=""
                  className="md:flex-1"
                  value={v ?? ""}
                  setValue={(newValue) => {
                    setV(newValue as string);
                    updateV(newValue as string);
                  }}
                />
              )}
            </SearchFilters>
          </div>
        </div>
      )}
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
