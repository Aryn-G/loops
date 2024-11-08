import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashbaord() {
  const session = await auth();

  if (!session) return redirect("/");
  // // @ts-ignore
  // if (session.user.role == "Admin") {
  //   return;
  // }

  return (
    <div>
      <div className="max-w-md">
        <h1 className="font-black text-xl">Profile (WIP)</h1>
        {/* <p>
          Your profile is public. This means your name, email, and image
          attached to your account will be accessable to any authenticated user
          using this application.
        </p> */}
        {/* @ts-ignore */}
        <p>Role: {session.user?.role}</p>
        <p>Name: {session.user?.name}</p>
        <p>Email: {session.user?.email}</p>
        <p>
          Photo:
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="profile pic"
              className="rounded-lg ring-1 ring-black shadow-brutal-xl"
            />
          )}
        </p>
      </div>
    </div>
  );
}
