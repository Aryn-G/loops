"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AcademicCapIcon,
  UserGroupIcon,
  BookmarkIcon,
  RectangleGroupIcon,
  BellIcon,
  ArrowLeftStartOnRectangleIcon,
  PaintBrushIcon,
  BuildingLibraryIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";

import { ChevronRightIcon } from "@heroicons/react/20/solid";

import { Session } from "next-auth";

import { ReactNode, useState } from "react";

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/20/solid";
import { signOutAction } from "./actions";
import toast from "../_components/Toasts/toast";

export type SectionType = {
  section: string;
  links: SectionLink[];
  allow: string[];
};
export type SectionLink = { title: string; icon: ReactNode; logout?: boolean };

export const SidebarData: SectionType[] = [
  {
    section: "General",
    links: [
      
      // maps to `/dashboard/appearance`
      { title: "Appearance", icon: <PaintBrushIcon className="size-6" /> },

      { title: "My Sign-Ups", icon: <BookmarkIcon className="size-6" /> },
      { title: "My Groups", icon: <UserGroupIcon className="size-6" /> },

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
        title: "Manage Accounts",
        icon: <BuildingLibraryIcon className="size-6" />,
      },
      {
        title: "Manage Loops Access",
        icon: <AcademicCapIcon className="size-6" />,
      },
      // { title: "Clean Up", icon: <FolderOpenIcon className="size-6" /> },
    ],
    allow: ["Admin"],
  },
  {
    section: "Settings",
    links: [
      { title: "Sessions", icon: <RectangleGroupIcon className="size-6" /> },
      {
        title: "Log Out",
        icon: <ArrowLeftStartOnRectangleIcon className="size-6" />,
        logout: true,
      },
    ],
    allow: ["No", "Student", "Loops", "Admin"],
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
      id="sidebar"
      className={`max-w-sm h-fit flex-shrink-0 bg-ncssm-light-blue ${
        !noBorder
          ? "sticky top-20 brutal-md p-4 max-h-[calc(100vh-7rem)] overflow-y-auto"
          : ""
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
      {!collapsed ? (
        <p className="text-lg font-black">{section.section}</p>
      ) : (
        // <div className="shrink-0 w-full h-0.5 rounded-full bg-black my-0.5"></div>
        <></>
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
  // add logout
  const href =
    "/dashboard/" + link.title.trim().toLowerCase().replace(/(\W)/g, "-");

  const pathname = usePathname();

  if (link.logout) {
    return (
      <button
        onClick={() => signOutAction()}
        className={`text-left flex items-center w-full gap-2  ${
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
      </button>
    );
  }

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
