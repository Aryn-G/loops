import { auth, signIn } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import Sessions from "./_mongo/models/Sessions";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (session) return redirect("/dashboard");

  const err = (await searchParams).error;

  return (
    <main className="pt-20 flex-1 flex flex-col items-center justify-center">
      <div className="mx-auto h-full flex flex-col gap-3 max-w-prose items-center text-center">
        <h1 className="font-grot font-black text-5xl">NCSSM-Morganton L∞ps</h1>
        <p>
          Loops provide students with easy access to essential shopping, dining,
          and recreational activities during their time on campus.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button
            type="submit"
            className="px-6 py-3 ring-1 ring-black flex items-center justify-center gap-2.5 w-fit rounded-lg font-bold bg-white shadow-brutal-md"
          >
            <Image src="/glogo.png" alt="Google Logo" width={24} height={24} />
            <span>Sign in with NCSSM</span>
          </button>
        </form>
        {err && <span className="mt-2">There was an error: {err}</span>}
      </div>
    </main>
  );
}
