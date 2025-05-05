"use client";

import { useSearchParam } from "../_lib/use-hooks/useSearchParam";
import React, { ReactNode, useRef, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Pagination from "./Pagination";
import { CheckIcon } from "@heroicons/react/16/solid";

type Props<T> = {
  name: string;
  inputClassName: string;
  itemsPerPage: number;
  paginationClassName: string;
  all: T[];
  render: (item: T, i: number) => ReactNode;
  filterLogic: (all: T[], query: string) => T[];
  filterString?: (filtered: T[], query: string) => ReactNode;
  renderShortenedFilters?: (
    Chip: (pros: {
      value: ReactNode | string;
      action: () => void;
    }) => React.JSX.Element
  ) => ReactNode;
  children?: ReactNode;
  selectedString?: (itemsOnPage: T[]) => ReactNode;
};

export const Seperator = () => (
  <div className="shrink-0 md:w-0.5 w-full h-0.5 md:h-auto rounded-full bg-neutral-200"></div>
);

export function RadioFilter<T, T2>({
  opts,
  state,
  onClick,
  render,
  equal,
  className = "",
}: {
  opts: T[];
  state: T2;
  onClick: (opt: T) => void;
  render: (opt: T) => ReactNode;
  equal: (state: T2, opt: T) => boolean;
  className?: string;
}) {
  return (
    <div className="w-full flex flex-col md:flex-row brutal-sm gap-2 items-center justify-center px-4 p-3 md:p-2">
      {opts.map((opt, i) => (
        <div className={"flex md:flex-row flex-col gap-3 " + className} key={i}>
          {i != 0 && <Seperator />}
          <button
            onClick={() => onClick(opt)}
            className="flex items-center md:justify-center md:gap-2 gap-3"
          >
            <div className="rounded-full brutal-sm flex items-center justify-center size-4">
              {equal(state, opt) && (
                <div className="flex-shrink-0 rounded-full size-3 bg-black"></div>
              )}
            </div>
            {render(opt)}
          </button>
        </div>
      ))}
    </div>
  );
}

export function CheckBoxFilter<T, T2>({
  opts,
  state,
  onClick,
  render,
  selected,
  className = "",
}: {
  opts: T[];
  state: T2[];
  onClick: (opt: T, prevState: boolean) => void;
  render: (opt: T) => ReactNode;
  selected: (state: T2[], opt: T) => boolean;
  className?: string;
}) {
  return (
    <div className="w-full flex flex-col md:flex-row brutal-sm gap-2 items-center justify-center px-4 p-3 md:p-2">
      {opts.map((opt, i) => (
        <div className={"flex md:flex-row flex-col gap-3 " + className} key={i}>
          {i != 0 && <Seperator />}
          <button
            onClick={() => onClick(opt, selected(state, opt))}
            className="flex items-center md:justify-center md:gap-2 gap-3 w-full"
          >
            <CheckBox selected={selected(state, opt)} />
            {render(opt)}
          </button>
        </div>
      ))}
    </div>
  );
}

export function CheckBox({
  selected,
  className,
  activeClassName = "bg-black",
  partial = false,
}: {
  selected: boolean;
  className?: string;
  activeClassName?: string;
  partial?: boolean;
}) {
  return (
    <div
      className={`rounded-[3px] brutal-sm flex items-center justify-center size-4 ${
        !partial ? "text-white" : "text-black"
      } ${className} ${selected && !partial && activeClassName}`}
    >
      {selected && <CheckIcon className={"size-3 shrink-0 text-inherit"} />}
    </div>
  );
}

export const Chip = ({
  value,
  action,
}: {
  value: ReactNode | string;
  action: () => void;
}) => (
  <div className="brutal-sm w-fit h-fit text-sm gap-1 flex px-3 py-2">
    <button onClick={() => action()}>
      <XMarkIcon className="size-4 text-rose-700" />
    </button>
    {value}
  </div>
);

export default function Search<T>(props: Props<T>) {
  const [query, q, setQ, updateQ] = useSearchParam("q");
  const inputRef = useRef<HTMLInputElement>(null);

  const [showFilters, setShowFilters] = useState(false);

  const filtered = props.filterLogic(props.all, query);

  return (
    <>
      <div className={props.inputClassName}>
        <div
          className="flex flex-1 gap-2 px-4 brutal-sm focus-within:[outline:-webkit-focus-ring-color_auto_1px]"
          tabIndex={-1}
        >
          <MagnifyingGlassIcon className="size-5 my-auto flex-shrink-0" />
          <input
            type="text"
            name="q"
            value={q}
            className="bg-transparent outline-none ring-0 w-full"
            placeholder={`Search ${props.name}...`}
            onChange={(e) => {
              setQ(e.target.value);
              updateQ(e.target.value);
            }}
            ref={inputRef}
          />
          {q && (
            <button
              className="size-6 flex items-center justify-center"
              onClick={() => {
                setQ("");
                updateQ("");
                inputRef.current?.focus();
              }}
            >
              <XMarkIcon className="size-5" />
            </button>
          )}
          {props.children && (
            <>
              <div className="w-0.5 rounded-full bg-neutral-200 shrink-0"></div>
              <button
                className="px-2 text-nowrap"
                onClick={() => setShowFilters((f) => !f)}
              >
                {!showFilters ? "Show " : "Hide "}Filters
              </button>
            </>
          )}
        </div>
        {showFilters ? (
          <div className="flex flex-col">{props.children}</div>
        ) : (
          <></>
        )}
        <>
          {props.renderShortenedFilters && props.renderShortenedFilters(Chip)}
        </>
      </div>

      <Pagination
        itemsPerPage={props.itemsPerPage}
        className={props.paginationClassName}
        filterString={props.filterString && props.filterString(filtered, query)}
        selectedString={props.selectedString}
        render={props.render}
      >
        {filtered}
      </Pagination>
    </>
  );
}
