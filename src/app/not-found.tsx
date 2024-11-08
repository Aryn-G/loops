"use client";

export default function NotFound() {
  return (
    <main className="pt-20 flex-1 flex flex-col items-center justify-center">
      <div className="mx-auto h-full flex gap-3 max-w-prose items-center text-center">
        <p className="text-8xl font-syne font-bold px-5 border-r border-black">
          404
        </p>
        <div className="px-5 h-full">
          We couldn&apos;t find the page you requested
        </div>
      </div>
    </main>
  );
}
