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
import LoopCard from "@/app/_components/LoopCard";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { objectMap } from "@/app/_lib/util";

import Search, {
  CheckBoxFilter,
  RadioFilter,
  Seperator,
} from "@/app/_components/Search";
import {
  ArrowLongRightIcon,
  ArrowsUpDownIcon,
  CalendarDateRangeIcon,
  ClockIcon,
  CloudIcon,
  FunnelIcon,
  MoonIcon,
  SunIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  useManyParams,
  useSearchParam,
} from "@/app/_lib/use-hooks/useSearchParam";
import title from "title";
import { isValidDateStr } from "@/app/_lib/util";

type Props = {
  allLoops: Awaited<ReturnType<typeof getLoops>>;
};

const ManageLoopsClient = ({ allLoops }: Props) => {
  const dateOpts = getDateOpts();
  const timingOpts = getTimingOpts();

  const expanded = {
    [dateOpts[1].title]: "Yesterday",
    [dateOpts[2].title]: "Today",
    [dateOpts[3].title]: "This Week",
  };

  const { updateMany } = useManyParams();

  const [start, s, setS, updateS] = useSearchParam(
    "start",
    dateOpts[3].start,
    (str) => {
      if (typeof str === "string") return isValidDateStr(str) ? str : undefined;
      else return str;
    },
    false
  );
  const [end, e, setE, updateE] = useSearchParam(
    "end",
    dateOpts[3].end,
    (str) => {
      if (typeof str === "string") return isValidDateStr(str) ? str : undefined;
      else return str;
    },
    false
  );
  const [minParam, min, setMin, updateMin] = useSearchParam(
    "min",
    "",
    (str) => {
      if (typeof str === "string") return isNaN(Number(str)) ? "" : str;
      else return str;
    }
  );
  const [sortParam, sort, setSort, updateSort] = useSearchParam(
    "sort",
    "earliest"
  );

  const [timingParam, _t, _setT, updateTiming] = useSearchParam(
    "timing",
    "morning+afternoon+night"
  );
  const [timing, setTiming] = useState<typeof timingOpts>(
    timingOpts.filter((v) => _t.indexOf(v.title.toLowerCase()) != -1)
  );

  let defaultDateOpt = dateOpts[0];
  dateOpts.forEach((opt) => {
    if (opt.start == start && opt.end == end) {
      defaultDateOpt = opt;
    }
  });

  // defaultDateOpt = undefined;
  const [dateOpt, setDateOpt] = useState(defaultDateOpt);

  return (
    <Search
      all={allLoops}
      name="Loops"
      inputClassName="my-5 max-w-xl mx-auto flex flex-col gap-2"
      itemsPerPage={6}
      paginationClassName="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6"
      render={(item, i) => <LoopCardR loop={item} />}
      filterString={(filtered, query) => (
        <>
          {filtered.length === 0
            ? query
              ? `No Results `
              : "No Loops Exist"
            : ""}
          {query && "for "}
          {query && <span className="font-bold">{`"${query}"`}</span>}
          {dateOpt.title !== dateOpts[0].title &&
          dateOpt.title !== dateOpts[4].title ? (
            <>
              {/* Describing preset date range */} for{" "}
              <span className="font-bold">{expanded[dateOpt.title ?? ""]}</span>
            </>
          ) : (
            <>
              {/* Annoying logic for properly describing date range */}
              {s && e
                ? s == e
                  ? ` on`
                  : ` between`
                : s
                ? " after"
                : e && " before"}
              {s && (
                <span className="font-bold">{` ${formatDate(
                  s + "T00:00",
                  false
                )}`}</span>
              )}
              {s && e && s != e && ` and`}
              {e && s != e && (
                <span className="font-bold">{` ${formatDate(
                  e + "T23:59",
                  false
                )}`}</span>
              )}
            </>
          )}
        </>
      )}
      filterLogic={(all, query) => {
        return all
          .sort((a, b) =>
            a.departureDateTime < b.departureDateTime
              ? sortParam === "earliest"
                ? -1
                : 1
              : sortParam === "ealiest"
              ? 1
              : -1
          )
          .filter((item) => {
            const queryMatches =
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase());

            if (!queryMatches) return false;

            const dateMatches = isDateBetween(
              start ? start + "T00:00" : undefined,
              toISOStringOffset(item.departureDateTime),
              end ? end + "T23:59" : undefined
            );

            if (!dateMatches) return false;

            let timingMatches = false;
            timing.forEach((opt, i) => {
              if (
                isDateBetween(
                  toISOStringOffset(item.departureDateTime).slice(0, -5) +
                    opt.start,
                  toISOStringOffset(item.departureDateTime),
                  toISOStringOffset(item.departureDateTime).slice(0, -5) +
                    opt.end
                )
              ) {
                timingMatches = true;
              }
            });

            if (!timingMatches) return false;

            // if minParam is not set, then true
            // if minParam is set, then evaluate
            const minSpots =
              minParam == "" ||
              item.capacity - item.filled.length >= Number(minParam);

            if (!minSpots) return false;

            return true;
          });
      }}
      renderShortenedFilters={(Chip) => (
        <div className="flex flex-wrap gap-2">
          {min != "" && (
            <Chip
              value={`${min}+ Available Spots`}
              action={() => {
                setMin("");
                updateMin(undefined);
              }}
            />
          )}
          {timing.length != 3 && (
            <Chip
              value={timingString(timing)}
              action={() => {
                updateTiming(undefined);
                setTiming(timingOpts);
              }}
            />
          )}
          {sort != "earliest" && (
            <Chip
              value={`${title(sort)} Departure First`}
              action={() => {
                setSort("earliest");
                updateSort(undefined);
              }}
            />
          )}
        </div>
      )}
    >
      <div className="w-full flex flex-col gap-2">
        {/* Date Range Selector Filter */}
        <div className="flex items-center gap-2 mt-2">
          <CalendarDateRangeIcon className="size-6" />
          <p className="font-bold flex-1">Date Range</p>
          <button
            className="underline underline-offset-2"
            onClick={() => {
              setDateOpt(dateOpts[3]);
              setS(dateOpts[3].start ?? "");
              setE(dateOpts[3].end ?? "");
              updateMany({ start: undefined, end: undefined }, true);
            }}
          >
            Reset
          </button>
        </div>
        <div className="w-full flex flex-row md:flex-col gap-2">
          <RadioFilter
            render={(opt) => <span className="w-full">{opt.title}</span>}
            opts={dateOpts}
            state={dateOpt}
            onClick={(opt) => {
              setDateOpt(opt);
              if (opt.start !== undefined) {
                setS(opt.start ?? "");
              }
              if (opt.end !== undefined) {
                setE(opt.end ?? "");
              }

              if (opt.start !== undefined && opt.end !== undefined) {
                updateMany({ start: opt.start, end: opt.end });
              }
            }}
            equal={(state, opt) => state.title === opt.title}
            className="w-full md:w-fit"
          />
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3">
            <Input
              type="date"
              name=""
              className="md:flex-1"
              value={s ?? ""}
              setValue={(newValue) => {
                setDateOpt(dateOpts[0]);
                setS(newValue as string);
                updateS(newValue as string);
              }}
            />
            <ArrowLongRightIcon className="size-6 md:rotate-0 rotate-90" />
            <Input
              type="date"
              name=""
              className="md:flex-1"
              value={e ?? ""}
              setValue={(newValue) => {
                setDateOpt(dateOpts[0]);
                setE(newValue as string);
                updateE(newValue as string);
              }}
            />
          </div>
        </div>
        {/* Timing Filter */}
        <div className="flex items-center gap-2 mt-2">
          <ClockIcon className="size-6" />
          <p className="font-bold flex-1">Timing</p>
          <button
            className="underline underline-offset-2"
            onClick={() => {
              updateTiming(undefined);
              setTiming(timingOpts);
            }}
          >
            Reset
          </button>
        </div>
        <CheckBoxFilter
          opts={timingOpts}
          onClick={(opt, prevState) => {
            if (!prevState)
              setTiming((t) => {
                updateTiming(
                  [...t, opt].map((v) => v.title.toLowerCase()).join(" ")
                );
                return [...t, opt];
              });
            else
              setTiming((t) => {
                updateTiming(
                  t
                    .filter((t2) => t2.title != opt.title)
                    .map((v) => v.title.toLowerCase())
                    .join(" ")
                );
                return t.filter((t2) => t2.title != opt.title);
              });
          }}
          render={(opt) => (
            <>
              <span className="flex-1">{opt.title}</span>
              {opt.icon}
            </>
          )}
          state={timing}
          selected={(state, opt) => !!state.find((o) => o.title === opt.title)}
          className="w-full md:px-2"
        />
        {/* Min Avaiable Slots Filter */}
        <div className="flex items-center gap-2 mt-2">
          <UserGroupIcon className="size-6" />
          <p className="font-bold flex-1">Minimum Available Spots</p>
          <button
            className="underline underline-offset-2"
            onClick={() => {
              setMin("");
              updateMin(undefined);
            }}
          >
            Reset
          </button>
        </div>
        <Input
          type="number"
          name=""
          className="w-full"
          placeholder="Type minimum..."
          value={min ?? ""}
          setValue={(newValue) => {
            setMin(newValue as string);
            updateMin(newValue as string);
          }}
          min={0}
          max={999}
        />
        {/* Sorting Filter */}
        <div className="flex items-center gap-2 mt-2">
          <ArrowsUpDownIcon className="size-6" />
          <p className="font-bold flex-1">Sorting</p>
          <button
            className="underline underline-offset-2"
            onClick={() => {
              setSort("earliest");
              updateSort(undefined);
            }}
          >
            Reset
          </button>
        </div>
        <RadioFilter
          render={(opt) => <span className="flex-1">{opt}</span>}
          opts={["Earliest Departure First", "Latest Departure First"]}
          state={sort}
          onClick={(opt) => {
            setSort(opt.split(" ")[0].toLowerCase());
            updateSort(opt.split(" ")[0].toLowerCase());
          }}
          equal={(state, opt) => state == opt.split(" ")[0].toLowerCase()}
          className="w-full md:px-2"
        />
        <button
          className="underline underline-offset-2 mx-auto"
          onClick={() => {
            setDateOpt(dateOpts[3]);
            setS(dateOpts[3].start ?? "");
            setE(dateOpts[3].end ?? "");
            setSort("earliest");
            setTiming(timingOpts);
            setMin("");
            updateMany(
              {
                start: undefined,
                end: undefined,
                min: undefined,
                sort: undefined,
                timing: undefined,
                p: undefined,
              },
              true
            );
          }}
        >
          Reset All
        </button>
      </div>
    </Search>
  );
};

function timingString(arr: ReturnType<typeof getTimingOpts>) {
  const timingOpts = getTimingOpts();

  if (arr.length === 0) {
    return "Never Departs";
  } else if (arr.length === 3) {
    return "";
  } else if (arr.length === 1) {
    return `Departs between ${arr[0].startStr} - ${arr[0].endStr}`;
  } else {
    let arr0 = arr[0];
    let arr1 = arr[1];
    if (arr0.id > arr1.id) {
      arr0 = arr1;
      arr1 = arr[0];
    }
    let opt3 = timingOpts.find((o) => o.id != arr0.id && o.id != arr1.id)!;
    if (Math.abs(arr0.id - arr1.id) == 1) {
      return `Departs between ${arr0.startStr} - ${arr1.endStr}`;
    } else {
      return `Doesn't depart between ${opt3.startStr} - ${opt3.endStr}`;
    }
  }
}

const getDateOpts = () => {
  const today = new Date();
  const yesterday = new Date(new Date(today).setDate(today.getDate() - 1));
  const thisWeekStart = new Date(
    new Date(today).setDate(today.getDate() - ((today.getDay() + 6) % 7))
  );
  const thisWeekEnd = new Date(
    new Date(today).setDate(today.getDate() + (7 - (today.getDay() % 7)))
  );

  return [
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
      end: "",
    },
  ];
};

const getTimingOpts = () => {
  return [
    {
      title: "Morning",
      icon: <CloudIcon className="size-5" />,
      start: "00:00",
      end: "11:59",
      startStr: "12 AM",
      endStr: "12 PM",
      id: 1,
    },
    {
      title: "Afternoon",
      icon: <SunIcon className="size-5" />,
      start: "12:00",
      end: "17:59",
      startStr: "12 PM",
      endStr: "6 PM",
      id: 2,
    },
    {
      title: "Night",
      icon: <MoonIcon className="size-5" />,
      start: "18:00",
      end: "23:59",
      startStr: "6 PM",
      endStr: "11:59 PM",
      id: 3,
    },
  ];
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
