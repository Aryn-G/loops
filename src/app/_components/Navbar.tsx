import { auth, signOut } from "@/auth";
import Link from "next/link";

export const NavLinks = [
  // { href: "/loops", title: "Home" },
  { href: "/dashboard", title: "Dashboard" },
];

export default async function Navbar() {
  const session = await auth();
  if (!session) return <></>;

  return (
    <>
      <nav className="z-50 flex flex-col gap-1 justify-center items-center  pt-7 bg-ncssm-light-blue backdrop-blur-sm fixed top-0 inset-x-0 max-w-screen-xl mx-auto px-2.5 py-1">
        <div className="flex gap-3 justify-between items-center max-w-sm mx-auto w-full">
          <Link href={"/loops"}>
            <p className="text-tfblue font-bold text-xl px-1.5">L∞ps</p>
          </Link>
          <div className="flex">
            {NavLinks.map((link) => (
              <Link
                href={link.href}
                className="underline-offset-2 hover:underline text-neutral-700 hover:text-current px-1.5"
                key={link.href}
              >
                {link.title}
              </Link>
            ))}
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="underline-offset-2 hover:underline text-neutral-700 hover:text-current px-1.5"
              >
                <span>Log Out</span>
              </button>
            </form>
          </div>
        </div>
        <div className="h-px w-3/12 bg-current rounded-full mx-auto max-w-40"></div>
      </nav>
    </>
  );
}
