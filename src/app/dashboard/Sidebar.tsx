"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AcademicCapIcon,
  UserGroupIcon,
  BookmarkIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";

import { ChevronRightIcon } from "@heroicons/react/20/solid";

import { Session } from "next-auth";

import { useState } from "react";

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/20/solid";

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
      { title: "My Sign-Ups", icon: <BookmarkIcon className="size-6" /> },
      { title: "My Groups", icon: <UserGroupIcon className="size-6" /> },
      { title: "Sessions", icon: <RectangleGroupIcon className="size-6" /> },
      // { title: "Notications", icon: <Bell /> },
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
        title: "Manage Student Groups",
        icon: <UserGroupIcon className="size-6" />,
      },
      // {
      //   title: "Suggestions",
      //   icon: <Megaphone />,
      // },
    ],
    allow: ["Loops", "Admin"],
  },
  {
    section: "Admin",
    links: [
      // { title: "Analytics", icon: <Analytics /> },
      {
        title: "Manage Loops Access",
        icon: <AcademicCapIcon className="size-6" />,
      },
    ],
    allow: ["Admin"],
  },
];

export default function Sidebar({
  session,
  noBorder,
  showOnMobile,
}: {
  session: Session;
  noBorder?: boolean;
  showOnMobile?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`max-w-sm h-fit flex-shrink-0 bg-ncssm-light-blue ${
        !noBorder ? "sticky top-20 brutal-md p-4" : ""
      } ${!showOnMobile ? "hidden lg:block" : ""} ${
        !noBorder && collapsed ? " p-3.5" : "w-full p-4 pt-7"
      }`}
    >
      {!noBorder && (
        <button
          className={`${
            !noBorder && collapsed
              ? "mx-auto relative"
              : "absolute top-4 right-4"
          } w-10 h-10 flex items-center justify-center`}
          onClick={() => setCollapsed((v) => !v)}
        >
          {/* <CaretRight className={`size-5 ${!collapsed && "rotate-180"}`} /> */}
          {/* {collapsed ? <EyeClosedIcon /> : <EyeIcon />} */}
          {/* {collapsed ? "show" : "expand"} */}
          {collapsed ? (
            <ChevronDoubleRightIcon className="size-5" />
          ) : (
            <ChevronDoubleLeftIcon className="size-5" />
          )}
        </button>
      )}
      {SidebarData.map((section) => (
        <Section
          section={section}
          key={section.section}
          session={session}
          noBorder={noBorder}
          collapsed={!noBorder && collapsed}
        />
      ))}
    </div>
  );
}

function Section({
  section,
  session,
  noBorder,
  collapsed,
}: {
  section: SectionType;
  session: Session;
  noBorder?: boolean;
  collapsed: boolean;
}) {
  if (!section.allow.includes(session?.user?.role ?? "")) {
    return;
  }
  return (
    <div className="mb-2">
      {!collapsed && (
        <p className="font-syne text-lg font-black">{section.section}</p>
      )}
      <div
        className={`flex flex-col ${
          noBorder ? "divide-y divide-black" : "gap-2"
        }`}
      >
        {section.links.map((link) => (
          <SectionLink
            key={link.title}
            link={link}
            noBorder={noBorder}
            collapsed={collapsed}
          />
        ))}
      </div>
    </div>
  );
}

function SectionLink({
  link,
  noBorder,
  collapsed,
}: {
  link: SectionLink;
  noBorder?: boolean;
  collapsed: boolean;
}) {
  const href =
    "/dashboard/" + link.title.trim().toLowerCase().replace(/(\W)/g, "-");

  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`flex items-center w-full gap-2 ${
        pathname.split("/")[2] == href.split("/")[2]
          ? "font-bold brutal-sm"
          : ""
      } ${
        noBorder
          ? "py-4 group"
          : `${
              collapsed
                ? "p-2 hover:brutal-sm"
                : "py-3 px-5 hover:brutal-sm hover:py-3 hover:px-5"
            }`
      }`}
    >
      {link.icon}
      {!collapsed && (
        <>
          <span className="flex-1 text-neutral-700 group-hover:text-black group-hover:underline underline-offset-2">
            {link.title}
          </span>
          {noBorder && <ChevronRightIcon className="size-5" />}
        </>
      )}
    </Link>
  );
}
