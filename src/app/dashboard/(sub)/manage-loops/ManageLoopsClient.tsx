"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { cancelLoop, publishLoop, removeLoop } from "./actions";

import Pagination from "@/app/_components/Pagination";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";
import { getLoops } from "@/app/_db/queries/loops";
import { formatDate, isDateBetween, toISOStringOffset } from "@/app/_lib/time";
import Input from "@/app/_components/Inputs/Input";
import LoopCard from "@/app/_components/LoopCard";

import {
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  Square2StackIcon,
  XMarkIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  ArchiveBoxXMarkIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { objectMap } from "@/app/_lib/util";

import Search, {
  CheckBoxFilter,
  RadioFilter,
  Seperator,
} from "@/app/_components/Search";
import {
  ArchiveBoxIcon,
  ArrowLongRightIcon,
  ArrowsUpDownIcon,
  CalendarDateRangeIcon,
  ClockIcon,
  CloudIcon,
  FunnelIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  useManyParams,
  useSearchParam,
} from "@/app/_lib/use-hooks/useSearchParam";
import title from "title";
import { isValidDateStr } from "@/app/_lib/util";
import { Session } from "next-auth";
import toast from "@/app/_components/Toasts/toast";

type Props = {
  session: Session;
  allLoops: Awaited<ReturnType<typeof getLoops>>;
};

const ManageLoopsClient = ({ session, allLoops }: Props) => {
  const dateOpts = getDateOpts();

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
  const [sortParam, sort, setSort, updateSort] = useSearchParam(
    "sort",
    "earliest"
  );

  const [sharingParam, _sharing, _setSharing, updateSharing] = useSearchParam(
    "sharing",
    "unpublished published canceled",
    (s) => s,
    false
  );
  const [sharing, setSharing] = useState<
    ("unpublished" | "published" | "canceled" | "deleted")[]
  >(
    (["unpublished", "published", "canceled", "deleted"] as const).filter(
      (opt) => _sharing.split(" ").indexOf(opt) != -1
    )
  );

  const [createdByParam, createdBy, setCreatedBy, updateCreatedBy] =
    useSearchParam("createdBy", "all");

  // const [viewParam, view, setView, updateView] = useSearchParam(
  //   "sort",
  //   "earliest"
  // );

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
      inputClassName="my-5 flex flex-col gap-2"
      itemsPerPage={6}
      paginationClassName="grid grid-cols-1 @3xl:grid-cols-2 @4xl:grid-cols-3 gap-3 md:gap-6"
      render={(item, i) => <LoopCardR key={item._id} loop={item} />}
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
              : sortParam === "earliest"
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

            let sharingMatches = false;
            // if anything is not selected
            // user doesn't want to see those
            if (item.published === true && sharing.includes("published")) {
              sharingMatches = true;
            }
            if (item.published === false && sharing.includes("unpublished")) {
              sharingMatches = true;
            }
            if (item.canceled === true && !sharing.includes("canceled")) {
              sharingMatches = false;
            }
            if (item.deleted === true && !sharing.includes("deleted")) {
              sharingMatches = false;
            } else if (item.deleted === true) {
              sharingMatches = true;
            }
            if (!sharingMatches) return false;

            let createdByMatches = true;

            if (createdBy === "only" && item.createdBy !== session.userId)
              createdByMatches = false;
            else if (
              createdBy === "others" &&
              item.createdBy === session.userId
            )
              createdByMatches = false;

            if (!createdByMatches) return false;

            return true;
          });
      }}
      renderShortenedFilters={(Chip) => (
        <div className="flex flex-wrap gap-2">
          {(["unpublished", "published", "canceled", "deleted"] as const).map(
            (opt) => {
              let value = "";
              if (opt != "deleted") {
                if (!sharing.includes(opt)) {
                  value = `Hiding ${opt}`;
                } else return;
              } else {
                if (sharing.includes(opt)) {
                  value = `Showing ${opt}`;
                } else return;
              }

              return (
                <Chip
                  value={title(value)}
                  key={opt}
                  action={() => {
                    const newState = sharing.includes(opt)
                      ? sharing.filter((o) => o != opt)
                      : [opt, ...sharing];

                    updateSharing(newState.join(" "));
                    setSharing(newState);
                  }}
                />
              );
            }
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
            className="w-full md:w-fit md:@3xl:px-2 md:@3xl:w-full"
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
        {/* Sharing Filter */}
        <div className="flex items-center gap-2 mt-2">
          <ArchiveBoxIcon className="size-6" />
          <p className="font-bold flex-1">Sharing</p>
          <button
            className="underline underline-offset-2"
            onClick={() => {
              updateSharing(undefined);
              setSharing(["unpublished", "published", "canceled"]);
            }}
          >
            Reset
          </button>
        </div>
        <CheckBoxFilter
          opts={["unpublished", "published", "canceled", "deleted"] as const}
          onClick={(opt, prevState) => {
            if (!prevState)
              setSharing((t) => {
                updateSharing([...t, opt].map((v) => v).join(" "));
                return [...t, opt];
              });
            else
              setSharing((t) => {
                updateSharing(
                  t
                    .filter((t2) => t2 != opt)
                    .map((v) => v)
                    .join(" ")
                );
                return t.filter((t2) => t2 != opt);
              });
          }}
          render={(opt) => (
            <>
              <span className="flex-1">{title(opt)}</span>
            </>
          )}
          state={sharing}
          selected={(state, opt) => !!state.find((o) => o === opt)}
          className="w-full md:px-2"
        />
        {/* Timing Filter
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
        /> */}
        {/* Created By Filter */}
        <div className="flex items-center gap-2 mt-2">
          <UserCircleIcon className="size-6" />
          <p className="font-bold flex-1">Created By</p>
          <button
            className="underline underline-offset-2"
            onClick={() => {
              setCreatedBy("All");
              updateCreatedBy(undefined);
            }}
          >
            Reset
          </button>
        </div>
        <RadioFilter
          render={(opt) => <span className="flex-1">{title(opt)}</span>}
          opts={["all", "only me", "others"]}
          state={createdBy}
          onClick={(opt) => {
            setCreatedBy(opt.split(" ")[0].toLowerCase());
            updateCreatedBy(opt.split(" ")[0].toLowerCase());
          }}
          equal={(state, opt) => state == opt.split(" ")[0].toLowerCase()}
          className="w-full md:px-2"
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
            setSharing(["unpublished", "published", "canceled"]);
            setCreatedBy("all");
            updateMany(
              {
                start: undefined,
                end: undefined,
                sort: undefined,
                timing: undefined,
                sharing: undefined,
                p: undefined,
                createdBy: undefined,
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

const LoopCardR = ({
  loop,
}: {
  loop: Awaited<ReturnType<typeof getLoops>>[number];
}) => {
  const [_state, action, pending] = useActionState(removeLoop, "");
  const [_state2, action2, pending2] = useActionState(publishLoop, "");
  const [_state3, action3, pending3] = useActionState(cancelLoop, "");

  useEffect(() => {
    if (!pending) {
      if (_state == "Success") {
        const fd = new FormData();
        fd.append("loop", loop._id);
        toast({
          title: "Success",
          description: "Deleted Loop",
          button: {
            label: "Undo",
            onClick: () => {
              removeLoop("", fd);
            },
          },
        });
      }
    }
  }, [pending]);

  return (
    <div className="brutal-sm p-6 flex flex-col">
      <div className="-mb-8 ml-auto flex items-center gap-2">
        {/* <div
          className="text-sm flex items-center justify-center h-fit brutal-sm font-bold w-fit"
          data-tooltip={loop.published ? "Published" : "Unpublished"}
        >
          {loop.published ? (
            <EyeIcon className="size-5" />
          ) : (
            <EyeSlashIcon className="size-5" />
          )}
        </div> */}
        <Link
          href={"/loops/" + String(loop._id)}
          className="text-sm flex items-center justify-center h-fit brutal-sm font-bold w-fit"
          data-tooltip="View Public Page"
        >
          <ArrowTopRightOnSquareIcon className="size-4" />
        </Link>
      </div>
      <LoopCard data={loop} capDesc="line-clamp-1" />
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={"/dashboard/manage-loops/" + String(loop._id)}
          className="col-span-2 text-sm w-full flex items-center justify-center gap-2 h-fit brutal-sm md:px-4 font-bold"
        >
          <PencilIcon className="size-4" />
          Edit
          <span className="size-4" />
        </Link>
        <Link
          href={"/dashboard/manage-loops?autofill=" + String(loop._id)}
          className="text-sm w-full flex items-center justify-between gap-2 h-fit brutal-sm md:px-4 font-bold"
        >
          <Square2StackIcon className="size-4" />
          Duplicate
          <span className="size-4" />
        </Link>
        <form action={action2} className="flex-shrink-0 w-full">
          <input
            className="hidden"
            name="loop"
            readOnly
            value={String(loop._id)}
          />
          <button
            className={
              (!loop.published
                ? "bg-ncssm-green text-white"
                : "bg-ncssm-yellow text-black") +
              " text-sm w-full flex items-center justify-between gap-2 h-fit brutal-sm md:px-4 font-bold"
            }
            type="submit"
            aria-disabled={pending2}
          >
            {!loop.published ? (
              <EyeIcon className="size-4" />
            ) : (
              <EyeSlashIcon className="size-4" />
            )}
            {!loop.published ? "Publish" : "Unpublish"}
            {pending2 ? "ing" : ""}
            <span className="size-4" />
          </button>
        </form>
        <form action={action3} className="flex-shrink-0 w-full">
          <input
            className="hidden"
            name="loop"
            readOnly
            value={String(loop._id)}
          />
          <button
            className={
              (loop.canceled ? "bg-ncssm-green" : "bg-rose-500") +
              " text-sm w-full text-white flex items-center justify-between gap-2 h-fit brutal-sm md:px-4 font-bold"
            }
            type="submit"
            aria-disabled={pending3}
          >
            <ArchiveBoxXMarkIcon className="size-4" />
            {!loop.canceled ? "Cancel" : "Uncancel"}
            {pending3 ? "ing" : ""}
            <span className="size-4" />
          </button>
        </form>
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
              " text-sm w-full text-white flex items-center justify-between gap-2 h-fit brutal-sm md:px-4 font-bold"
            }
            type="submit"
            aria-disabled={pending}
          >
            <TrashIcon className="size-4" />
            {loop.deleted ? "Restor" : "Delet"}
            {pending ? "ing" : "e"}
            <span className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageLoopsClient;
