import { auth, ExtendedSession, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashbaord({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session: ExtendedSession | null = await auth();

  if (!session) return redirect("/");

  const query = (await searchParams).q;

  return <div></div>;
}
