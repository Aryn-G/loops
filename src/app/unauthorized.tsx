import { headers } from "next/headers";
import { SignInButton } from "./page";

export default async function Unauthorized() {
  const h = await headers();
  const pathname = h.get("x-current-path");
  // console.log("redirect to: " + pathname);

  return (
    <main className="pt-20 flex-1 flex flex-col items-center justify-center">
      <div className="mx-auto h-full flex flex-col md:flex-row gap-3 max-w-prose items-center text-center">
        <p className="text-3xl md:text-8xl font-bold px-5 md:border-r md:border-black">
          403
        </p>
        <div className="px-5 h-full flex flex-col gap-2 items-center">
          <p>Please log in to access this resource</p>
          <SignInButton redirectTo={pathname ?? undefined} />
        </div>
      </div>
    </main>
  );
}
