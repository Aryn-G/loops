import { auth, signIn } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Params } from "./_lib/types";
import { DESCRIPTION } from "./_lib/constants";
import InstallPrompt from "./InstallPrompt";

export default async function Page({ searchParams }: { searchParams: Params }) {
  const session = await auth();
  if (session) return redirect("/dashboard");

  // displaying search parameters
  const err = (await searchParams).error;

  // jsx
  return (
    <main className="pt-20 flex-1 flex flex-col items-center justify-center">
      <div className="mx-auto h-full flex flex-col gap-3 max-w-prose items-center text-center">
        <h1 className="font-grot font-black text-5xl">NCSSM-Morganton L∞ps</h1>
        <p>{DESCRIPTION}</p>
        <SignInButton />
        {err && <span className="mt-2">There was an error: {err}</span>}
        <InstallPrompt />
      </div>
    </main>
  );
}

const SignInButton = () => (
  <form
    action={async () => {
      "use server";
      await signIn("google", {
        redirect: true,
        redirectTo: "/dashboard",
      });
    }}
  >
    <button
      type="submit"
      className="px-6 py-3 brutal-md flex items-center justify-center gap-2.5 w-fit font-bold"
    >
      <Image
        src="/glogo.png"
        alt="Google Logo"
        width={64}
        height={64}
        className="select-none pointer-events-none size-6"
      />
      <span>Sign in with NCSSM</span>
    </button>
  </form>
);
