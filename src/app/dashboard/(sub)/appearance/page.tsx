import { auth } from "@/auth";
import { unauthorized, forbidden } from "next/navigation";
import Refresh from "@/app/_components/Refresh";
import Link from "next/link";

import { Metadata } from "next";
import AppearanceClient from "./AppearanceClient";

import { Session } from "next-auth";
import Users from "@/app/_db/models/Users";

export const metadata: Metadata = {
  title: "Loops • Dashboard / Appearance",
};

export default async function Page() {
  const session = await auth();

  if (!session) return unauthorized();
  if (session.user?.role === "No") return forbidden();

  return (
    <>
      <Link
        href={"/dashboard"}
        className="flex gap-2 items-center lg:hidden text-sm underline underline-offset-2"
      >
        Back to Dashboard
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="font-black text-xl">Appearance</h1>
        <div className="flex items-center">
          <Refresh tag={"appearance"} />
        </div>
      </div>
      <p>
        Select a theme for the application. This theme syncs across all devices
        logged into this account.
      </p>

      {/* Client Side Method */}
      <AppearanceClient
        currentTheme={session.user?.appearance ?? "Morganton Theme"}
      />

      {/* All Server Side Method */}

      {/* <EasierMethod session={session} /> */}
    </>
  );
}

// async function EasierMethod({ session }: { session: Session }) {
//   const themes = [
//     { title: "Morganton Theme", className: "bg-ncssm-light-blue text-black" },
//     { title: "Durham Theme", className: "bg-ncssm-blue text-white" },
//     { title: "Neutral Theme", className: "bg-neutral-200 text-neutral-700" },
//     { title: "High Constrast Theme", className: "bg-black text-white" },
//   ];

//   return (
//     <div className="mt-8 grid @3xl:grid-cols-3 @xl:grid-cols-2 grid-cols-1 gap-4">
//       {themes.map((theme) => (
//         <div
//           key={theme.title}
//           className={`brutal-md overflow-hidden p-0 w-full ${
//             session.user.appearance === theme.title &&
//             "ring-offset-1 ring-offset-black ring-8 ring-ncssm-orange/50"
//           }`}
//           onClick={async () =>
//             await Users.findByIdAndUpdate(session.userId, {
//               $set: { appearance: theme.title },
//             })
//           }
//         >
//           <div
//             className={
//               "h-48 w-full flex items-center justify-center " + theme.className
//             }
//           >
//             <div className="h-4 w-1/2 bg-current rounded"></div>
//           </div>
//           <div className="flex items-center justify-center gap-2 p-2">
//             <div className="rounded-full brutal-sm size-4 flex p-0.5">
//               {session.user.appearance === theme.title && (
//                 <div className="rounded-full bg-black size-3"></div>
//               )}
//             </div>
//             {theme.title}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
