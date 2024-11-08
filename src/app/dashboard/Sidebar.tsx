"use client";

import Link from "next/link";
import AcademicCap from "../_icons/AcademicCap";
import UserGroup from "../_icons/UserGroup";
import UserCircle from "../_icons/UserCircle";
import Bookmark from "../_icons/Bookmark";
import Analytics from "../_icons/Analytics";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";

export type SectionType = {
  section: string;
  links: SectionLink[];
  allow: string[];
};
export type SectionLink = { title: string; icon: JSX.Element };
export const SidebarData: SectionType[] = [
  {
    section: "General",
    links: [
      { title: "Profile", icon: <UserCircle /> },
      { title: "My Sign-Ups", icon: <Bookmark /> },
    ],
    allow: ["Student", "Loops", "Admin"],
  },
  {
    section: "Loops",
    links: [
      {
        title: "Manage Loops",
        icon: <span className="size-6 text-center font-medium">∞</span>,
      },
    ],
    allow: ["Loops", "Admin"],
  },
  {
    section: "Admin",
    links: [
      { title: "Analytics", icon: <Analytics /> },
      { title: "Manage Loops Access", icon: <AcademicCap /> },
      { title: "Manage Student Groups", icon: <UserGroup /> },
    ],
    allow: ["Admin"],
  },
];

export default function Sidebar({ session }: { session: Session | null }) {
  return (
    <div className="w-full max-w-sm h-fit flex-shrink-0 bg-ncssm-light-blue shadow-brutal-md ring-1 ring-black rounded-lg p-4 pt-7">
      {SidebarData.map((section) => (
        <Section section={section} key={section.section} session={session} />
      ))}
    </div>
  );
}

function Section({
  section,
  session,
}: {
  section: SectionType;
  session: Session | null;
}) {
  // @ts-ignore
  if (!section.allow.includes(session?.user.role)) {
    return;
  }
  return (
    <div className="mb-2">
      <p className="font-syne text-lg font-black">{section.section}</p>
      <div className="flex flex-col gap-2">
        {section.links.map((link) => (
          <SectionLink key={link.title} link={link} />
        ))}
      </div>
    </div>
  );
}

function SectionLink({ link }: { link: SectionLink }) {
  const href =
    "/dashboard/" + link.title.trim().toLowerCase().replace(/(\W)/g, "-");

  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`flex py-3 px-5 w-full gap-2 rounded-lg ${
        pathname == href
          ? "font-bold bg-white shadow-brutal-sm ring-1 ring-black"
          : "hover:bg-white hover:shadow-brutal-sm hover:ring-1 hover:ring-black"
      }`}
    >
      {link.icon}
      <span>{link.title}</span>
    </Link>
  );
}
