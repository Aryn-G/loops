"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSearchParam } from "../_lib/use-hooks/useSearchParam";
import React, {
  createContext,
  memo,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Pagination from "./Pagination";
import { DebouncedState } from "use-debounce";
import { objectMap } from "../_lib/util";

type Props<T> = {
  name: string;
  inputClassName: string;
  itemsPerPage: number;
  paginationClassName: string;
  all: T[];
  render: (item: T, i: number) => ReactNode;
  filterLogic: (
    all: T[],
    filters: Record<string, string>,
    query: string
  ) => T[];
  filterString: (
    filtered: T[],
    filters: Record<string, string>,
    query: string
  ) => ReactNode;
  children?: (states: {
    [key: string]: React.Dispatch<React.SetStateAction<string>>;
  }) => ReactNode;
};

function findFilters(children: Props<any>["children"]) {
  const filters: [string, { defaultValue: string; value: string }][] = [];

  // console.log(typeof children == "function" ? children({}) : null);
  React.Children.forEach(
    typeof children == "function" ? children({}) : null,
    (child) => {
      let childNode = child;
      // console.log(childNode);

      if (React.isValidElement(childNode)) {
        if (childNode.type === SearchFilters) {
          const { name, defaultValue = "" } = childNode.props;
          filters.push([name, { defaultValue, value: defaultValue }]);
        } else if (childNode.props && childNode.props.children) {
          filters.push(...findFilters(childNode.props.children));
        }
      }
    }
  );

  // console.log(filters);
  return filters;
}

type SearchContextType = {
  states: {
    [key: string]: React.Dispatch<React.SetStateAction<string>>;
  };
  setStates: React.Dispatch<
    React.SetStateAction<{
      [key: string]: React.Dispatch<React.SetStateAction<string>>;
    }>
  >;
};

export const SearchContext = createContext<SearchContextType>(
  {} as SearchContextType
);

export default function Search<T>(props: Props<T>) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [query, q, setQ, updateQ] = useSearchParam("q");

  const inputRef = useRef<HTMLInputElement>(null);

  const filterNames = Object.fromEntries(findFilters(props.children));

  const filters: Record<string, { value: string }> = {};
  Object.keys(filterNames).forEach((name) => {
    filters[name] = {
      value:
        searchParams.get(name) !== null
          ? searchParams.get(name)!
          : filterNames[name].defaultValue,
    };
  });

  const [showFilters, setShowFilters] = useState(false);

  const filtered = props.filterLogic(
    props.all,
    objectMap(filters, (f) => f.value),
    query
  );

  const [states, setStates] = useState<{
    [key: string]: React.Dispatch<React.SetStateAction<string>>;
  }>({});

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams);
    for (const key in filters) {
      // somehow call setV in children
      if (states[key]) states[key](filterNames[key].defaultValue);
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <SearchContext.Provider value={{ states, setStates }}>
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
              <div className="w-0.5 rounded-full bg-neutral-200"></div>
              <button
                className="px-2 text-nowrap"
                onClick={() => setShowFilters((f) => !f)}
              >
                {!showFilters ? "Show " : "Hide "}Filters
              </button>
            </>
          )}
        </div>
        <div className={`flex flex-col ${!showFilters && "hidden"}`}>
          {props.children && props.children(states)}
          <button
            className="mt-2 block w-full text-center underline underline-offset-2"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>

      <Pagination
        itemsPerPage={props.itemsPerPage}
        className={props.paginationClassName}
        filterString={props.filterString(
          filtered,
          objectMap(filters, (f) => f.value),
          query
        )}
      >
        {filtered.map(props.render)}
      </Pagination>
    </SearchContext.Provider>
  );
}

export const SearchFilters = memo(
  ({
    children,
    name,
    defaultValue = "",
    noDel = false,
    debounceDelay = 300,
  }: {
    children: (
      v: string,
      // setV: (newValue: string) => void,
      setV: React.Dispatch<React.SetStateAction<string>>,
      updateV: DebouncedState<(value: string) => void>
    ) => ReactNode;
    name: string;
    defaultValue?: string;
    noDel?: boolean;
    debounceDelay?: number;
  }) => {
    const context = useContext(SearchContext);
    if (!context) {
      throw new Error("<Search.Filters /> must be used within a <Search />");
    }

    const [_param, v, setV, updateV] = useSearchParam(
      name,
      defaultValue,
      !noDel,
      debounceDelay
    );

    useEffect(() => {
      context.setStates((s) => ({ ...s, [name]: setV }));
    }, [defaultValue, !noDel, debounceDelay]);

    return <>{children(v, setV, updateV)}</>;
  }
);

SearchFilters.displayName = "SearchFilters";
