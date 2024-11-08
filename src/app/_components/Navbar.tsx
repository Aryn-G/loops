import { auth } from "@/auth";
import Link from "next/link";
import { Suspense } from "react";

export const NavLinks = [
  { href: "/loops", title: "Home" },
  { href: "/dashboard", title: "Dashboard" },
];

export default async function Navbar() {
  const session = await auth();
  if (!session) return <></>;

  return (
    <>
      <nav className="flex gap-3 justify-center items-center rounded-lg mt-7 bg-ncssm-light-blue/50 backdrop-blur-sm fixed top-0 inset-x-0 max-w-sm mx-auto px-2.5 py-1">
        <div className="flex gap-3 justify-between items-center max-w-sm mx-auto w-full">
          <p className="font-syne text-tfblue font-bold text-xl">L∞ps</p>
          <div className="flex gap-3">
            {NavLinks.map((link) => (
              <Link href={link.href} className="underline" key={link.href}>
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
