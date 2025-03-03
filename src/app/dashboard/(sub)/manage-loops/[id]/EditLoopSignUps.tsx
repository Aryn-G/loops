"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { editLoopSignUps, froceLoopSignUps } from "./actions";
import { UserPlusIcon } from "@heroicons/react/24/outline";

import MultiSelect from "@/app/_components/Inputs/MultiSelect";
import { getLoop } from "@/app/_db/queries/loops";
import { getFilteredUsers } from "@/app/_db/queries/users";
import toast from "@/app/_components/Toasts/toast";

type FilteredUser = Awaited<ReturnType<typeof getFilteredUsers>>[number];
type Loop = NonNullable<Awaited<ReturnType<typeof getLoop>>>;

type Props = {
  loop: Loop;
  allUsers: FilteredUser[];
};

const EditLoopSignUps = ({ loop, allUsers }: Props) => {
  const filtered = allUsers.filter(
    (u) => loop.filled.filter((slot) => slot.user._id === u._id).length === 0
  );

  const [_state, action, pending] = useActionState(editLoopSignUps, "");
  const [_state2, action2, pending2] = useActionState(froceLoopSignUps, "");

  const [selected, setSelected] = useState<FilteredUser[]>([]);

  useEffect(() => {
    if (!pending) {
      if (_state == "Success")
        toast({
          title: "Success",
          description:
            "Signed up " +
            selected.length +
            " student" +
            (selected.length != 1 ? "s" : ""),
          button: { label: "Close", onClick: () => {} },
        });
      setSelected([]);
    }
  }, [pending]);
  useEffect(() => {
    if (!pending2) {
      setSelected([]);
    }
  }, [pending2]);

  return (
    <>
      <div className="w-full flex flex-col @xl:flex-row gap-2 mt-3">
        <MultiSelect
          icon={<UserPlusIcon className="size-6 flex-shrink-0" />}
          allItems={filtered}
          maxSearch={3}
          selected={selected}
          setSelected={setSelected}
          id={(u) => u._id}
          render={(u) => u.email}
          filter={(u) => u.email}
          placeholder="Type or paste in emails..."
        />
        <div className="flex gap-2">
          <form action={action} className="w-full @xl:w-fit">
            <input className="hidden" name="loop" readOnly value={loop._id} />
            {selected.map((s) => (
              <input
                className="hidden"
                name="selected"
                readOnly
                value={s._id}
                key={s._id}
              />
            ))}
            <button
              className="w-full @xl:w-fit h-fit bg-ncssm-green  text-white brutal-sm px-4 font-bold"
              type="submit"
              aria-disabled={pending}
            >
              Sign{pending ? "ing" : ""} Up
            </button>
          </form>
          <form action={action2} className="w-full @xl:w-fit">
            <input className="hidden" name="loop" readOnly value={loop._id} />
            {selected.map((s) => (
              <input
                className="hidden"
                name="selected"
                readOnly
                value={s._id}
                key={s._id}
              />
            ))}

            <button
              className="w-full @xl:w-fit h-fit bg-ncssm-blue  text-white brutal-sm px-4 font-bold"
              type="submit"
              aria-disabled={pending2}
            >
              Forc{pending2 ? "ing" : "e"} Sign Up
              <span className="text-ncssm-light-blue">*</span>
            </button>
          </form>
        </div>
      </div>
      <p className="mt-1">
        <span className="text-ncssm-blue">*</span>Force Sign Up creates a sign
        up regardless of reservations or capacity.
      </p>
      {_state != "Success" && (
        <p className="mt-1 mb-3 text-rose-700">
          {allUsers.reduce(
            (str, u) => str.replaceAll(u._id, `${u.name}`),
            _state
          )}
        </p>
      )}
    </>
  );
};

export default EditLoopSignUps;
