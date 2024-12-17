import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loops • Offline",
};

export default function Page() {
  return (
    <main className="pt-20 flex-1 flex flex-col items-center justify-center">
      <div className="mx-auto h-full flex flex-col gap-3 max-w-prose items-center text-center">
        <h1 className="font-grot font-black text-5xl">🙊</h1>
        <p>You Are Offline!</p>
      </div>
    </main>
  );
}
