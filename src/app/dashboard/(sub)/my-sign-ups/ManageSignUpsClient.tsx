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
import title from "title";
import LoopCard from "@/app/_components/LoopCard";
import { getUserSignUps } from "@/app/_db/queries/signups";
import { removeSelfFromLoop } from "@/app/loops/[loopId]/actions";
import { useSearchParam } from "@/app/_lib/use-hooks/useSearchParams";

type Props = {
  userSignUps: Awaited<ReturnType<typeof getUserSignUps>>;
};

const ManageSignUpsClient = ({ userSignUps }: Props) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [query, q, setQ, updateSearch] = useSearchParam("q");

  const [startDateParam, startDate, setStartDate, updateStartFilter] =
    useSearchParam("start", toISOStringOffset(new Date()).slice(0, -6), false);

  const [endDateParam, endDate, setEndDate, updateEndFilter] =
    useSearchParam("end");

  const filtered = userSignUps.filter((signUp) => {
    const queryMatches =
      signUp.loop.title.toLowerCase().includes(query.toLowerCase()) ||
      signUp.loop.description.toLowerCase().includes(query.toLowerCase());

    const timingMatches = isDateBetween(
      startDateParam ? startDateParam + "T00:00" : undefined,
      signUp.loop.departureDateTime,
      endDateParam ? endDateParam + "T23:59" : undefined
    );

    return queryMatches && timingMatches;
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState(false);

  return (
    <>
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
          placeholder="Search Sign-Ups..."
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
        <div className="flex md:items-center gap-2 md:flex-row flex-col">
          <Input
            label="Starting: "
            type="date"
            name=""
            className="mb-1 md:mr-2"
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
            className="mb-1"
            value={endDate ?? ""}
            setValue={(newValue) => {
              setEndDate(newValue as string);
              updateEndFilter(newValue as string);
            }}
          />
        </div>
      )}
      <Pagination
        itemsPerPage={6}
        className="grid grid-cols-1  @2xl:grid-cols-2 @4xl:grid-cols-3 gap-2 md:gap-6"
        filterString={
          <>
            {filtered.length === 0
              ? query
                ? `No Results `
                : "No Sign-Ups Exist"
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
            {filtered.length === 0 ? (
              query ? (
                ""
              ) : (
                <Link
                  href={"/loops"}
                  className="block mt-2 underline-offset-2 underline"
                >
                  Go Sign Up
                </Link>
              )
            ) : (
              ""
            )}
          </>
        }
      >
        {filtered
          .sort((a, b) =>
            new Date(a.loop.departureDateTime) <
            new Date(b.loop.departureDateTime)
              ? -1
              : 1
          )
          .map((signup) => (
            <LoopCardR signup={signup} key={String(signup.loop._id)} />
          ))}
      </Pagination>
    </>
  );
};

const LoopCardR = ({
  signup,
}: {
  signup: Awaited<ReturnType<typeof getUserSignUps>>[number];
}) => {
  const [_state, action, pending] = useActionState(removeSelfFromLoop, "");

  return (
    <div className="brutal-sm p-6 flex flex-col">
      <LoopCard data={signup.loop} capDesc="line-clamp-1" />

      <div className="grid grid-cols-2 gap-2">
        <Link
          href={"/loops/" + String(signup.loop._id)}
          className="text-sm w-full flex items-center justify-center gap-2 h-fit brutal-sm md:px-4 font-bold"
        >
          See More
        </Link>
        <form action={action} className="flex-shrink-0 w-full">
          <input
            className="hidden"
            name="loop"
            readOnly
            value={String(signup.loop._id)}
          />
          <input
            className="hidden"
            name="remove"
            readOnly
            value={String(signup._id)}
          />
          <button
            className=" text-sm w-full text-white flex items-center justify-center gap-2 h-fit bg-rose-500 brutal-sm md:px-4 font-bold"
            type="submit"
            aria-disabled={pending}
          >
            Remov{pending ? "ing" : "e"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageSignUpsClient;
