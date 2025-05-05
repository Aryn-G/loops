import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Loops • Offline",
};

export default function Page() {
  return (
    <main className="pt-20 flex-1 flex flex-col items-center justify-center">
      <div className="mx-auto h-full flex flex-col max-w-prose items-center text-center">
        <h2 className="font-grot font-black text-3xl mb-3">💔🙊</h2>
        <h1 className="font-grot font-black text-2xl mb-3">No Internet</h1>
        <p>
          You Are Offline!
          {/* Check your connection and{" "}
          <form
            action={async () => {
              "use server";
              console.log("");
            }}
          >
            <button type="submit" className="underline underline-offset-2">
              try again
            </button>
          </form> */}
        </p>
      </div>
    </main>
  );
}
