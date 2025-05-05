"use client";

import React, {
  useActionState,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { deleteUser, multiDeleteUser } from "./actions";

import { formatDate, isDateBetween, toISOStringOffset } from "@/app/_lib/time";

import Search, { CheckBox, CheckBoxFilter } from "@/app/_components/Search";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import {
  useManyParams,
  useSearchParam,
} from "@/app/_lib/use-hooks/useSearchParam";
import title from "title";
import { getFilteredUsers } from "@/app/_db/queries/users";
import Image from "next/image";
import { Session } from "next-auth";

type FilteredUser = Awaited<ReturnType<typeof getFilteredUsers>>[number];

type Props = {
  session: Session;
  allUsers: FilteredUser[];
};
const ManageAccountsClient = (props: Props) => {
  const [_state, action, pending] = useActionState(multiDeleteUser, "");

  const { updateMany } = useManyParams();

  const [sharingParam, _sharing, _setSharing, updateSharing] = useSearchParam(
    "type",
    "unlinked linked",
    (s) => s,
    false
  );
  const [sharing, setSharing] = useState<("unlinked" | "linked" | "deleted")[]>(
    (["unlinked", "linked", "deleted"] as const).filter(
      (opt) => _sharing.split(" ").indexOf(opt) != -1
    )
  );

  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (selected.length > 0 && !pending) {
      setSelected([]);
    }
  }, [pending]);

  return (
    <Search
      all={props.allUsers}
      name="Accounts"
      inputClassName="my-5 flex flex-col gap-2"
      itemsPerPage={25}
      paginationClassName="divide-y divide-black flex flex-col"
      render={(item, i) => (
        <div
          key={item.email}
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
            {item.role !== "Admin" && item.role !== "Loops" ? (
              <CheckBox
                selected={selected.includes(item._id)}
                className="m-4"
              />
            ) : (
              <div className="size-4 m-4" />
            )}
          </button>
          <PersonCard
            selected={selected}
            setSelected={setSelected}
            session={props.session}
            key={i}
            u={item}
          />
        </div>
      )}
      filterString={(filtered, query) => (
        <>
          {filtered.length === 0
            ? query
              ? `No Results `
              : "No Users Exist"
            : ""}
          {query && "for "}
          {query && <span className="font-bold">{`"${query}"`}</span>}
        </>
      )}
      filterLogic={(all, query) => {
        return all
          .sort((a, b) => a.email.localeCompare(b.email))
          .filter((item) => {
            const queryMatches =
              item.email.toLowerCase().includes(query.toLowerCase()) ||
              item.name?.toLowerCase().includes(query.toLowerCase());

            if (!queryMatches) return false;

            let sharingMatches = false;
            // if anything is not selected
            // user doesn't want to see those
            if (item.linked === true && sharing.includes("linked")) {
              sharingMatches = true;
            }
            if (item.linked === false && sharing.includes("unlinked")) {
              sharingMatches = true;
            }
            if (item.deleted === true && !sharing.includes("deleted")) {
              sharingMatches = false;
            } else if (item.deleted === true) {
              sharingMatches = true;
            }

            if (!sharingMatches) return false;

            return true;
          });
      }}
      renderShortenedFilters={(Chip) => (
        <div className="flex flex-wrap gap-2">
          {(["unlinked", "linked", "deleted"] as const).map((opt) => {
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
      selectedString={(itemsOnPage) => {
        itemsOnPage = itemsOnPage.filter(
          (item) => item.role !== "Admin" && item.role !== "Loops"
        );

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
                {selected.length} of {props.allUsers.length} account(s)
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
                  <button
                    className={
                      (selected.length !== 0 &&
                      props.allUsers
                        .filter((user) => selected.includes(user._id))
                        .every((item) => item.deleted)
                        ? "bg-ncssm-green"
                        : "bg-rose-500") +
                      " text-sm w-full text-white flex items-center justify-center gap-2 h-fit brutal-sm md:px-4 font-bold"
                    }
                    type="submit"
                    aria-disabled={selected.length === 0 || pending}
                  >
                    {selected.length !== 0 &&
                    props.allUsers
                      .filter((user) => selected.includes(user._id))
                      .every((item) => item.deleted)
                      ? "Restor"
                      : "Delet"}
                    {pending ? "ing" : "e"}
                  </button>
                </form>
              </div>
            </div>
          </>
        );
      }}
    >
      <div className="w-full flex flex-col gap-2">
        {/* Sharing Filter */}
        <div className="flex items-center gap-2 mt-2">
          <ArchiveBoxIcon className="size-6" />
          <p className="font-bold flex-1">Account Type</p>
          <button
            className="underline underline-offset-2"
            onClick={() => {
              updateSharing(undefined);
              setSharing(["unlinked", "linked"]);
            }}
          >
            Reset
          </button>
        </div>
        <CheckBoxFilter
          opts={["unlinked", "linked", "deleted"] as const}
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
            setSharing(["unlinked", "linked"]);
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

const PersonCard = <T,>({
  session,
  u,
  selected,
  setSelected,
}: {
  session: Session;
  u: FilteredUser;
  selected: T[];
  setSelected: React.Dispatch<React.SetStateAction<T[]>>;
}) => {
  const [_state, action, pending] = useActionState(deleteUser, "");

  return (
    <div
      key={u.email}
      className="py-3 flex flex-row gap-2 w-full items-center justify-center"
    >
      <div className="flex gap-2 flex-1 w-full items-center">
        {u.picture ? (
          <Image
            src={u.picture}
            alt="profile pic"
            className="brutal-sm p-0 size-10 md:size-12 select-none pointer-events-none"
            width={48}
            height={48}
            unoptimized
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="brutal-sm p-0 size-10 md:size-12 flex items-center justify-center">
            {u.email?.at(0)}
          </div>
        )}
        <div className="flex flex-col flex-1">
          <p className="text-base font-bold">
            {/* {!u.linked && "(UNLINKED) "} */}
            {u.deleted && "(DELETED) "}
            {u.name}
          </p>
          <p className="text-sm font-thin break-words">{u.email}</p>
        </div>
      </div>
      {u.role !== "Admin" && u.role !== "Loops" && u._id !== session.userId ? (
        <form action={action} className="flex-shrink-0 w-fit">
          <input className="hidden" name="remove" readOnly value={u._id} />
          <button
            className={
              (u.deleted ? "bg-ncssm-green" : "bg-rose-500") +
              " text-sm w-full text-white flex items-center justify-center gap-2 h-fit brutal-sm md:px-4 font-bold"
            }
            type="submit"
            aria-disabled={pending}
          >
            {u.deleted ? "Restor" : "Delet"}
            {pending ? "ing" : "e"}
          </button>
        </form>
      ) : (
        <span>{u._id === session.userId ? "You" : u.role + " Account"}</span>
      )}
    </div>
  );
};

export default ManageAccountsClient;
