"use client";

import React, { useActionState, useEffect, useState } from "react";
import { multiRemoveFromLoop, removeFromLoop } from "./actions";

import Image from "next/image";
import { getLoop } from "@/app/_db/queries/loops";
import { formatDate, formatTime, toISOStringOffset } from "@/app/_lib/time";
import Search, { CheckBox } from "@/app/_components/Search";
import toast from "@/app/_components/Toasts/toast";

type Loop = NonNullable<Awaited<ReturnType<typeof getLoop>>>;
type Props = {
  loop: Loop;
};

const ManageLoopSignUps = (props: Props) => {
  const [_state, action, pending] = useActionState(multiRemoveFromLoop, "");

  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (selected.length > 0 && !pending) {
      if (_state == "Success") {
        toast({
          title: "Success",
          description:
            "Removed " +
            selected.length +
            " student" +
            (selected.length != 1 ? "s" : ""),
          button: {
            label: "Close",
            onClick: () => {},
          },
        });
      }
      setSelected([]);
    }
  }, [pending]);

  return (
    <Search
      all={props.loop.filled}
      name="Users"
      inputClassName="my-5 flex flex-col gap-2"
      itemsPerPage={25}
      paginationClassName="divide-y divide-black flex flex-col md:gap-2"
      render={(item, i) => (
        <div
          key={item.user.email}
          className={`w-full flex items-center justify-center py-1`}
        >
          <button
            type="button"
            onClick={() => {
              if (selected.includes(item._id)) {
                setSelected((s) => s.filter((s2) => s2 !== item._id));
              } else {
                setSelected((s) => [...s, item._id]);
              }
            }}
          >
            <CheckBox selected={selected.includes(item._id)} className="m-4" />
          </button>
          <PersonCard u={item} loop={props.loop._id} key={item.user._id} />
        </div>
      )}
      filterString={(filtered, query) => (
        <>
          {filtered.length === 0
            ? query
              ? `No Results `
              : "No Loops Accounts Exist"
            : ""}
          {query && "for "}
          {query && <span className="font-bold">{`"${query}"`}</span>}
        </>
      )}
      filterLogic={(all, query) => {
        return all
          .sort((a, b) =>
            (a.user.email ?? "").localeCompare(b.user.email ?? "")
          )
          .filter((item) => {
            const queryMatches =
              (item.user.email ?? "")
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              item.user.name?.toLowerCase().includes(query.toLowerCase());

            if (!queryMatches) return false;

            return true;
          });
      }}
      renderShortenedFilters={(Chip) => (
        <div className="flex flex-wrap gap-2"></div>
      )}
      selectedString={(itemsOnPage) => {
        const allSelected = itemsOnPage.every((item) =>
          selected.includes(item._id)
        );
        const someSelected = itemsOnPage.some((item) =>
          selected.includes(item._id)
        );

        return (
          <>
            <div className="flex w-full mb-2 items-center">
              <button
                type="button"
                onClick={() => {
                  if (allSelected) {
                    setSelected((s) =>
                      s.filter(
                        (id) => !itemsOnPage.some((user) => user._id === id)
                      )
                    );
                  } else {
                    setSelected((s) => [
                      ...new Set([
                        ...s,
                        ...itemsOnPage.map((user) => user._id),
                      ]),
                    ]);
                  }
                }}
              >
                <CheckBox
                  selected={someSelected}
                  className="m-4"
                  partial={!allSelected}
                />
              </button>
              <div>
                {selected.length} of {props.loop.filled.length} account(s)
                selected.
              </div>
              <div className="ml-auto flex items-center justify-center">
                <form action={action} className="flex-shrink-0 w-fit">
                  {selected.map((id) => (
                    <input
                      className="hidden"
                      name="remove"
                      readOnly
                      value={id}
                      key={id}
                    />
                  ))}
                  <input
                    className="hidden"
                    name="loop"
                    readOnly
                    value={props.loop._id}
                  />
                  <button
                    className="bg-rose-500 text-sm w-full text-white flex items-center justify-center gap-2 h-fit brutal-sm md:px-4 font-bold"
                    type="submit"
                    aria-disabled={selected.length === 0 || pending}
                  >
                    Remov{pending ? "ing" : "e"}
                  </button>
                </form>
              </div>
            </div>
          </>
        );
      }}
    />
  );
};

const PersonCard = ({
  u,
  loop,
}: {
  u: Loop["filled"][number];
  loop: string;
}) => {
  const [_state, action, pending] = useActionState(removeFromLoop, "");
  useEffect(() => {
    if (!pending) {
      if (_state == "Success") {
        toast({
          title: "Success",
          description: "Removed student from loop",
          button: {
            label: "close",
            onClick: () => {},
          },
        });
      }
    }
  }, [pending]);
  return (
    <div
      // key={u._id}
      className="py-3 flex flex-row gap-2 w-full items-center justify-center"
    >
      <div className="flex gap-2 flex-1 w-full items-center">
        {u.user.picture ? (
          <Image
            src={u.user.picture}
            alt="profile pic"
            className="brutal-sm p-0 size-10 md:size-12 select-none pointer-events-none"
            width={48}
            height={48}
            unoptimized
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="brutal-sm p-0 size-10 md:size-12 flex items-center justify-center">
            {u.user.email?.at(0)}
          </div>
        )}
        <div className="flex flex-col flex-1">
          <p className="text-base md:text-lg font-bold">{u.user.name}</p>
          <p className="text-sm md:text-base font-thin break-words">
            {u.user.email}
          </p>
          <p className="text-sm md:text-base font-thin break-words">
            {formatDate(toISOStringOffset(u.createdAt), false)}{" "}
            {formatTime(toISOStringOffset(u.createdAt))}
            {/* {toISOStringOffset(u.createdAt)} */}
          </p>
          {u.group && (
            <p className="text-sm md:text-base break-words">
              {u.group.name} Reservation
            </p>
          )}
        </div>
      </div>
      <form action={action} className="flex-shrink-0 w-fit">
        <input className="hidden" name="loop" readOnly value={loop} />
        <input className="hidden" name="remove" readOnly value={u._id} />
        <button
          className=" text-sm w-fit text-white flex items-center justify-center gap-2 h-fit bg-rose-500 brutal-sm md:px-4 font-bold"
          type="submit"
          aria-disabled={pending}
        >
          Remov{pending ? "ing" : "e"}
        </button>
      </form>
    </div>
  );
};

export default ManageLoopSignUps;
