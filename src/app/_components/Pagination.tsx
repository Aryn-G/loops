"use client";

import React, { useEffect, useRef, useState } from "react";
import CaretRight from "../_icons/CaretRight";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Props = {
  children: JSX.Element[];
  itemsPerPage: number;
  className?: string;
  // initPage?: number;
};

const Pagination = (props: Props) => {
  const searchParams = useSearchParams();
  // const { replace } = useRouter();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("p"))
    ? Math.min(
        Math.max(Number(searchParams.get("p")), 1),
        Math.ceil(props.children.length / props.itemsPerPage)
      )
    : 1;
  const createPageURL = (pageNumber: number) => {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > maxPages) pageNumber = maxPages;

    const params = new URLSearchParams(searchParams);
    params.set("p", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const [items, setItems] = useState(props.children);
  const [itemsPerPage, setItemsPerPage] = useState(props.itemsPerPage);
  const [maxPages, setMaxPages] = useState(
    Math.ceil(items.length / itemsPerPage)
  );

  useEffect(() => {
    setItems(props.children);
    setItemsPerPage(props.itemsPerPage);
    setMaxPages(Math.ceil(props.children.length / props.itemsPerPage));
  }, [props]);

  const pageNumberString = () => {
    const lower = (currentPage - 1) * itemsPerPage;
    const upper = (currentPage - 1) * itemsPerPage + itemsPerPage;
    const l = lower + 1;
    const u = upper > items.length ? items.length : upper;
    if (l === u) {
      return `${l} of ${items.length}`;
    } else {
      return `${l}-${u} of ${items.length}`;
    }
  };

  return (
    <div className="z-10 flex flex-col gap-2">
      <div className="text-center my-3">
        Showing {pageNumberString()}
        <span className="sr-only"> total pages</span>
      </div>
      <div className="flex gap-2 items-center justify-center font-bold mb-5">
        <Link
          href={createPageURL(currentPage - 1)}
          scroll={false}
          className="paginationBtn"
          aria-label="Previous Page"
        >
          <CaretRight className="size-6 rotate-180" />
        </Link>
        <Link
          href={createPageURL(1)}
          scroll={false}
          className={`paginationBtn ${currentPage == 1 ? "underline" : ""}`}
          aria-label="Page 1"
        >
          1
        </Link>
        {maxPages < 3 ? null : currentPage >= 1 && currentPage <= 3 ? (
          <>
            <Link
              href={createPageURL(2)}
              scroll={false}
              className={`paginationBtn ${currentPage == 2 ? "underline" : ""}`}
              aria-label="Page 2"
            >
              2
            </Link>
            {maxPages > 3 && (
              <>
                <Link
                  href={createPageURL(3)}
                  scroll={false}
                  className={`paginationBtn ${
                    currentPage == 3 ? "underline" : ""
                  }`}
                  aria-label="Page 3"
                >
                  3
                </Link>
                {maxPages > 4 && (
                  <DotBtn setPage={createPageURL} maxPage={maxPages} />
                )}
              </>
            )}
          </>
        ) : currentPage >= maxPages - 2 && currentPage <= maxPages ? (
          <>
            {maxPages > 4 && (
              <DotBtn setPage={createPageURL} maxPage={maxPages} />
            )}
            <Link
              href={createPageURL(maxPages - 2)}
              scroll={false}
              className={`paginationBtn ${
                currentPage == maxPages - 2 ? "underline" : ""
              }`}
              aria-label={`Page ${maxPages - 2}`}
            >
              {maxPages - 2}
            </Link>
            <Link
              href={createPageURL(maxPages - 1)}
              scroll={false}
              className={`paginationBtn ${
                currentPage == maxPages - 1 ? "underline" : ""
              }`}
              aria-label={`Page ${maxPages - 1}`}
            >
              {maxPages - 1}
            </Link>
          </>
        ) : (
          <>
            <DotBtn setPage={createPageURL} maxPage={maxPages} />
            <div
              // onClick={() => page(currentPage)}
              className="paginationBtn underline"
              aria-label={`Page ${currentPage}`}
            >
              {currentPage}
            </div>
            <DotBtn setPage={createPageURL} maxPage={maxPages} />
          </>
        )}
        {maxPages > 1 && (
          <Link
            href={createPageURL(maxPages)}
            scroll={false}
            className={`paginationBtn ${
              currentPage == maxPages ? "underline" : ""
            }`}
            aria-label={`Page ${maxPages}`}
          >
            {maxPages}
          </Link>
        )}
        <Link
          href={createPageURL(currentPage + 1)}
          scroll={false}
          className="paginationBtn"
          aria-label="Next Page"
        >
          <CaretRight />
        </Link>
      </div>
      <div className={props.className ?? "flex flex-col gap-2"}>
        {items.filter(
          (item, i) =>
            i >= (currentPage - 1) * itemsPerPage &&
            i < (currentPage - 1) * itemsPerPage + itemsPerPage
        )}
      </div>
    </div>
  );
};

const DotBtn = ({
  setPage,
  maxPage,
}: {
  setPage: (num: number) => string;
  maxPage: number;
}) => {
  const [isBtn, setIsBtn] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isBtn]);

  const { replace } = useRouter();

  const handleSubmit = () => {
    if (!inputRef.current) return;
    if (
      parseInt(inputRef.current.value) > 0 &&
      parseInt(inputRef.current.value) <= maxPage
    ) {
      // setPage(parseInt(inputRef.current.value));
      replace(setPage(parseInt(inputRef.current.value)), { scroll: false });
      setIsBtn(true);
    }
  };

  return (
    <>
      {isBtn && (
        <button
          onClick={() => {
            setIsBtn(false);
          }}
          className="paginationBtn"
          aria-label={`Enter a page`}
        >
          ...
        </button>
      )}
      {!isBtn && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex items-center justify-center"
        >
          <input
            type="number"
            ref={inputRef}
            onBlur={(e) => {
              setIsBtn(true);
              handleSubmit();
              e.target.value = "";
            }}
            className="paginationBtn text-center"
            min={1}
            max={maxPage}
            aria-label={`Enter a page`}
          />
        </form>
      )}
    </>
  );
};

export default Pagination;
