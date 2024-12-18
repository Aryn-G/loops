import Link from "next/link";

export default function NotFound() {
  return (
    <main className="pt-20 flex-1 flex flex-col items-center justify-center">
      <div className="mx-auto h-full flex flex-col gap-3 max-w-prose items-center text-center">
        <p className="text-3xl font-bold px-5">404</p>
        <div className="px-5 h-full max-w-sm">
          We couldn&apos;t find the Group you requested.{" "}
          <Link
            href="/dashboard/manage-student-groups"
            className="underline underline-offset-2"
          >
            Return to Dashboard / Manage Student Groups
          </Link>
        </div>
      </div>
    </main>
  );
}
