"use client";

import Link from "next/link";
import AcademicCap from "../_icons/AcademicCap";
import UserGroup from "../_icons/UserGroup";
import UserCircle from "../_icons/UserCircle";
import Bookmark from "../_icons/Bookmark";
import Analytics from "../_icons/Analytics";
import { usePathname } from "next/navigation";
import CaretRight from "../_icons/CaretRight";
import { ExtendedSession } from "@/auth";
import Bell from "../_icons/Bell";
import Megaphone from "../_icons/Megaphone";

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
      // { title: "Profile", icon: <UserCircle /> },
      { title: "My Sign-Ups", icon: <Bookmark /> },
      { title: "Notications", icon: <Bell /> },
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
      {
        title: "Suggestions",
        icon: <Megaphone />,
      },
    ],
    allow: ["Loops", "Admin"],
  },
  {
    section: "Admin",
    links: [
      // { title: "Analytics", icon: <Analytics /> },
      { title: "Manage Loops Access", icon: <AcademicCap /> },
      { title: "Manage Student Groups", icon: <UserGroup /> },
    ],
    allow: ["Admin"],
  },
];

export default function Sidebar({
  session,
  noBorder,
  showOnMobile,
}: {
  session: ExtendedSession | null;
  noBorder?: boolean;
  showOnMobile?: boolean;
}) {
  return (
    <div
      className={`w-full max-w-sm h-fit flex-shrink-0 bg-ncssm-light-blue ${
        !noBorder ? "sticky top-20 brutal-md p-4" : ""
      } ${!showOnMobile ? "hidden lg:block" : ""}`}
    >
      {SidebarData.map((section) => (
        <Section
          section={section}
          key={section.section}
          session={session}
          noBorder={noBorder}
        />
      ))}
    </div>
  );
}

function Section({
  section,
  session,
  noBorder,
}: {
  section: SectionType;
  session: ExtendedSession | null;
  noBorder?: boolean;
}) {
  if (!section.allow.includes(session?.user?.role ?? "")) {
    return;
  }
  return (
    <div className="mb-2">
      <p className="font-syne text-lg font-black">{section.section}</p>
      <div
        className={`flex flex-col ${
          noBorder ? "divide-y divide-black" : "gap-2"
        }`}
      >
        {section.links.map((link) => (
          <SectionLink key={link.title} link={link} noBorder={noBorder} />
        ))}
      </div>
    </div>
  );
}

function SectionLink({
  link,
  noBorder,
}: {
  link: SectionLink;
  noBorder?: boolean;
}) {
  const href =
    "/dashboard/" + link.title.trim().toLowerCase().replace(/(\W)/g, "-");

  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`flex w-full gap-2 ${
        pathname == href ? "font-bold brutal-sm" : ""
      } ${
        noBorder
          ? "py-4 group"
          : "rounded-lg py-3 px-5 hover:brutal-sm hover:py-3 hover:px-5"
      }`}
    >
      {link.icon}
      <span className="flex-1 text-neutral-700 group-hover:text-black group-hover:underline underline-offset-2">
        {link.title}
      </span>
      {noBorder && <CaretRight />}
    </Link>
  );
}
