import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashbaord() {
  const session = await auth();

  if (!session) return redirect("/");
  return redirect("/dashboard/profile");

  // // @ts-ignore
  // if (session.user.role == "Admin") {
  //   return;
  // }

  // return (
  //   <div className="container">
  //     {/* @ts-ignore */}
  //     <p className="font-mono">Role: {session.user.role}</p>
  //     <p className="font-mono">{JSON.stringify(session)}</p>
  //     <form
  //       action={async () => {
  //         "use server";
  //         await signOut();
  //       }}
  //     >
  //       <button
  //         type="submit"
  //         className="px-6 py-3 border border-black flex items-center justify-center gap-2.5 w-fit rounded-lg font-bold bg-white shadow-brutal-md"
  //       >
  //         <span>Log Out</span>
  //       </button>
  //     </form>
  //   </div>
  // );
}
