"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { removeGroup } from "./actions";

import { formatDate, isDateBetween, toISOStringOffset } from "@/app/_lib/time";

import Search, { CheckBoxFilter } from "@/app/_components/Search";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import {
  useManyParams,
  useSearchParam,
} from "@/app/_lib/use-hooks/useSearchParam";
import title from "title";
import { getFilteredUsers } from "@/app/_db/queries/users";
import Image from "next/image";
import { Session } from "next-auth";
import { getGroups } from "@/app/_db/queries/groups";
import Link from "next/link";
import toast from "@/app/_components/Toasts/toast";
type Props = {
  allGroups: Awaited<ReturnType<typeof getGroups>>;
};

const ManageGroupsClient = ({ allGroups }: Props) => {
  const { updateMany } = useManyParams();

  const [sharingParam, _sharing, _setSharing, updateSharing] = useSearchParam(
    "type",
    "all",
    (s) => s,
    false
  );
  const [sharing, setSharing] = useState<("all" | "deleted")[]>(
    (["all", "deleted"] as const).filter(
      (opt) => _sharing.split(" ").indexOf(opt) != -1
    )
  );
  return (
    <Search
      all={allGroups}
      name="Groups"
      inputClassName="my-5 flex flex-col gap-2"
      itemsPerPage={25}
      paginationClassName="divide-y divide-black flex flex-col md:gap-2"
      render={(item, i) => <GroupCard key={i} group={item} />}
      filterString={(filtered, query) => (
        <>
          {filtered.length === 0
            ? query
              ? `No Results `
              : "No Groups Exist"
            : ""}
          {query && "for "}
          {query && <span className="font-bold">{`"${query}"`}</span>}
        </>
      )}
      filterLogic={(all, query) => {
        return all
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter((item) => {
            const queryMatches = item.name
              ?.toLowerCase()
              .includes(query.toLowerCase());

            if (!queryMatches) return false;

            let sharingMatches = true;

            if (item.deleted === true && !sharing.includes("deleted")) {
              sharingMatches = false;
            } else if (item.deleted === true) {
              sharingMatches = true;
            }

            if (item.deleted === false && !sharing.includes("all")) {
              sharingMatches = false;
            }

            if (!sharingMatches) return false;

            return true;
          });
      }}
      renderShortenedFilters={(Chip) => (
        <div className="flex flex-wrap gap-2">
          {(["all", "deleted"] as const).map((opt) => {
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
          })}
        </div>
      )}
    >
      <div className="w-full flex flex-col gap-2">
        {/* Sharing Filter */}
        <div className="flex items-center gap-2 mt-2">
          <ArchiveBoxIcon className="size-6" />
          <p className="font-bold flex-1">Group Type</p>
          <button
            className="underline underline-offset-2"
            onClick={() => {
              updateSharing(undefined);
              setSharing(["all"]);
            }}
          >
            Reset
          </button>
        </div>
        <CheckBoxFilter
          opts={["all", "deleted"] as const}
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

        <button
          className="underline underline-offset-2 mx-auto"
          onClick={() => {
            setSharing(["all"]);
            updateMany(
              {
                sharing: undefined,
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

const GroupCard = ({
  group,
}: {
  group: Awaited<ReturnType<typeof getGroups>>[number];
}) => {
  const [_state, action, pending] = useActionState(removeGroup, "");

  useEffect(() => {
    if (!pending) {
      if (_state == "Success") {
        const fd = new FormData();
        fd.append("remove", group._id);
        toast({
          title: "Success",
          description: "Updated Group",
          button: {
            label: "Undo",
            onClick: () => {
              removeGroup("", fd);
            },
          },
        });
      }
    }
  }, [pending]);

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
          <p className="text-base">
            Contains {group.count} {group.count === 1 ? "Person" : "People"}
          </p>
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
