import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SuggestForm from "./SuggestForm";

export default async function Page() {
  const session = await auth();
  if (!session) return redirect("/");

  return (
    <div className="mx-auto w-full max-w-sm lg:max-w-screen-sm flex flex-col">
      <h1 className="text-xl font-bold">Suggest Loops</h1>
      <p className="mb-4">
        Use this form to suggest any Loops you would like the school provide.
        This is just a suggestion, meaning the school isn't required to follow
        it. Final discretion is always in the school's hand.
      </p>
      <SuggestForm session={session} />
    </div>
  );
}
