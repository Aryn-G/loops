"use client";

import React, { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { removeAccessAction } from "./actions";

import Search from "@/app/_icons/Search";
import Trash from "@/app/_icons/Trash";
import Pagination from "@/app/_components/Pagination";

type FilteredUser = {
  _id: string;
  name: string;
  email: string;
  photo: string | undefined;
  role: "Student" | "Loops" | "Admin" | undefined;
};

type Props = {
  allUsers: FilteredUser[];
};

const ManageAccess = (props: Props) => {
  const loopsAccess = props.allUsers.filter((u) => u.role === "Loops");
  // const students = props.allUsers;
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="w-full flex flex-col gap-2 my-3">
      <div className="flex flex-col px-5 py-2 bg-white shadow-brutal-sm ring-1 ring-black flex-1 rounded-lg focus-within:outline">
        <div className="flex gap-2">
          <Search />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="bg-transparent outline-none ring-0 flex-1"
            placeholder="Search Loops Access..."
          />
        </div>
      </div>
      {loopsAccess.filter(
        (l) =>
          l.email.toLowerCase().includes(value.toLowerCase()) ||
          l.name.toLowerCase().includes(value.toLowerCase())
      ).length === 0 ? (
        <p className="text-center pt-3">No Loops Access Accounts</p>
      ) : (
        <Pagination itemsPerPage={3}>
          {loopsAccess
            .filter(
              (l) =>
                l.email.toLowerCase().includes(value.toLowerCase()) ||
                l.name.toLowerCase().includes(value.toLowerCase())
            )
            .map((u) => (
              <PersonCard u={u} key={u._id} />
            ))}
        </Pagination>
      )}
    </div>
  );
};

const PersonCard = ({ u }: { u: FilteredUser }) => {
  const [state, action, pending] = useFormState(removeAccessAction, "");

  return (
    <div
      // key={u._id}
      className="flex gap-2 w-full shadow-brutal-sm p-5 bg-white ring-1 ring-black rounded-lg items-center justify-center"
    >
      {u.photo && (
        <img
          src={u.photo}
          alt="profile pic"
          className="rounded-lg ring-1 ring-black shadow-brutal-md size-12"
        />
      )}
      <div className="flex flex-col flex-1">
        <p className="text-lg font-bold">{u.name}</p>
        <p className="font-thin">{u.email}</p>
      </div>
      <form action={action}>
        <input className="hidden" name="remove" readOnly value={u._id} />
        <button
          className="text-white flex items-center justify-center gap-2 h-fit bg-rose-500 shadow-brutal-md ring-1 ring-black px-5 py-2 rounded-lg font-bold"
          type="submit"
          aria-disabled={pending}
        >
          Remov{pending ? "ing" : "e"} Access
          <Trash />
        </button>
      </form>
    </div>
  );
};

export default ManageAccess;
