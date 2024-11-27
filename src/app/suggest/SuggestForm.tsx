"use client";

import React, { useActionState, useEffect, useState } from "react";
import { suggestFormSubmit } from "./actions";
import { ExtendedSession } from "@/auth";
import Input from "../_components/Input";
import TextArea from "../_components/Textarea";

type Props = {
  session: ExtendedSession;
};

const SuggestForm = ({ session }: Props) => {
  const [_state, action, pending] = useActionState(suggestFormSubmit, "");

  const [textArea, setTextArea] = useState("");

  useEffect(() => {}, []);

  return (
    <div>
      <form action={action} className="flex flex-col w-full rounded-lg">
        <input
          name="userId"
          type="text"
          className="hidden"
          readOnly
          value={session.user?.id}
        />
        <Input name="" label="Name" required value={session.user?.name ?? ""} />
        <Input
          name=""
          label="Email"
          required
          value={session.user?.email ?? ""}
        />
        <TextArea
          name="suggestion"
          label="Suggestion"
          maxLength={500}
          placeholder="Start typing your suggested loop here..."
          required
          value={textArea}
          onChange={setTextArea}
        />
        <button
          className="text-sm md:text-base w-full text-white flex items-center justify-center gap-2 h-fit bg-ncssm-blue shadow-brutal-sm ring-1 ring-black px-2 md:px-5 py-2 rounded-lg font-bold"
          type="submit"
          aria-disabled={pending}
        >
          Submit{pending && "ing"}
        </button>
      </form>
    </div>
  );
};

export default SuggestForm;
