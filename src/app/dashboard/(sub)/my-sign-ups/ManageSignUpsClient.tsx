"use client";

import React, { useActionState } from "react";

import Link from "next/link";
import { formatDate, isDateBetween, toISOStringOffset } from "@/app/_lib/time";
import Input from "@/app/_components/Inputs/Input";
import LoopCard from "@/app/_components/LoopCard";
import { getUserSignUps } from "@/app/_db/queries/signups";
import { removeSelfFromLoop } from "@/app/loops/[loopId]/actions";
import Search, { SearchFilters } from "@/app/_components/Search";

type Props = {
  userSignUps: Awaited<ReturnType<typeof getUserSignUps>>;
};

const ManageSignUpsClient = ({ userSignUps }: Props) => {
  return (
    <Search
      all={userSignUps}
      name="Sign-Ups"
      inputClassName="flex flex-col gap-2"
      itemsPerPage={6}
      paginationClassName="grid grid-cols-1  @2xl:grid-cols-2 @4xl:grid-cols-3 gap-2 md:gap-6"
      render={(item) => <LoopCardR signup={item} key={String(item._id)} />}
      filterString={(filtered, filters, query) => (
        <>
          {filtered.length === 0
            ? query
              ? `No Results `
              : "No Sign-Ups Exist"
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
            new Date(a.loop.departureDateTime) <
            new Date(b.loop.departureDateTime)
              ? -1
              : 1
          )
          .filter((item) => {
            const queryMatches =
              item.loop.title.toLowerCase().includes(query.toLowerCase()) ||
              item.loop.description.toLowerCase().includes(query.toLowerCase());

            const timingMatches = isDateBetween(
              filters["start"] ? filters["start"] + "T00:00" : undefined,
              toISOStringOffset(item.loop.departureDateTime),
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
