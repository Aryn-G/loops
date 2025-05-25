import { auth } from "@/auth";
import { redirect, unauthorized } from "next/navigation";
import SearchLoops from "./SearchLoops";
import { getLoops } from "../_db/queries/loops";
import { Metadata } from "next";
import { getFilteredUsers } from "../_db/queries/users";

export const metadata: Metadata = {
  title: "Loops • Browse",
};

export default async function Page() {
  const session = await auth();
  if (!session) return unauthorized();

  const allUsers = await getFilteredUsers();

  const whoToEmail = allUsers
    .filter((user) => user.role === "Admin")
    .map((user) => user.email);

  if (
    (session.user.role !== "Admin" &&
      session.user.role !== "Student" &&
      session.user.role !== "Loops") ||
    session.user.deleted
  )
    return (
      <div className="pt-20">
        <h1 className="text-center font-black text-xl md:text-3xl">
          NCSSM-Morganton Loops
        </h1>
        <p className="mx-auto text-center mt-2 max-w-[65ch]">
          You <span className="font-semibold">do not</span> have access to this
          application. If you think this is a mistake, please contact{" "}
          {whoToEmail.map((email, i) => (
            <span key={email}>
              <a
                className="font-semibold underline underline-offset-2"
                href={`mailto:${email}`}
              >
                {email}
              </a>
              {whoToEmail.length > 2 && whoToEmail.length > i + 1 && ", "}
              {whoToEmail.length > 1 && whoToEmail.length == i + 2 && " or "}
            </span>
          ))}
          .
        </p>
      </div>
    );

  return (
    <div className="pt-20">
      <h1 className="text-center font-black text-xl md:text-3xl">
        NCSSM-Morganton Loops
      </h1>
      <SearchLoops allLoops={await getLoops()} />
    </div>
  );
}
