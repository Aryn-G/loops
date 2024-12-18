import { SignInButton } from "./page";

export default function Unauthorized() {
  return (
    <main className="pt-20 flex-1 flex flex-col items-center justify-center">
      <div className="mx-auto h-full flex flex-col md:flex-row gap-3 max-w-prose items-center text-center">
        <p className="text-3xl md:text-8xl font-bold px-5 md:border-r md:border-black">
          403
        </p>
        <div className="px-5 h-full flex flex-col gap-2 items-center">
          <p>Please log in to access this resource</p>
          <SignInButton />
        </div>
      </div>
    </main>
  );
}
