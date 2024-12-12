"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";

type Props = {
  filterString?: JSX.Element;
  children?: JSX.Element[];
  itemsPerPage: number;
  className?: string;
  // initPage?: number;
};

const Pagination = (props: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("p"))
    ? Math.min(
        Math.max(Number(searchParams.get("p")), 1),
        Math.ceil((props.children ?? []).length / props.itemsPerPage)
      )
    : 1;
  const createPageURL = (pageNumber: number) => {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > maxPages) pageNumber = maxPages;

    const params = new URLSearchParams(searchParams);
    params.set("p", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const [items, setItems] = useState(props.children ?? []);
  const [itemsPerPage, setItemsPerPage] = useState(props.itemsPerPage);
  const [maxPages, setMaxPages] = useState(
    Math.ceil(items.length / itemsPerPage)
  );

  useEffect(() => {
    setItems(props.children ?? []);
    setItemsPerPage(props.itemsPerPage);
    setMaxPages(Math.ceil((props.children ?? []).length / props.itemsPerPage));
  }, [props]);

  const pageNumberString = () => {
    const lower = (currentPage - 1) * itemsPerPage;
    const upper = (currentPage - 1) * itemsPerPage + itemsPerPage;
    const l = lower + 1;
    const u = upper > items.length ? items.length : upper;
    if (l === u) {
      return (
        <>
          <span className="font-bold">{l}</span>
          {" of "}
          <span className="font-bold">{items.length}</span>
        </>
      );
    } else {
      return (
        <>
          <span className="font-bold">
            {l}-{u}
          </span>
          {" of "}
          <span className="font-bold">{items.length}</span>
        </>
      );
    }
  };

  return (
    <div className="z-10 flex flex-col gap-2">
      <div className="text-center my-3">
        {items.length === 0 ? "" : <>Showing {pageNumberString()}</>}{" "}
        {props.filterString}
        <span className="sr-only"> total pages</span>
      </div>
      {items.length !== 0 && (
        <div className="flex gap-2 items-center justify-center font-bold mb-5">
          <Link
            href={createPageURL(currentPage - 1)}
            scroll={false}
            className="paginationBtn"
            aria-label="Previous Page"
          >
            <ChevronLeftIcon className="size-5" />
          </Link>
          <PageBtn
            createPageURL={createPageURL}
            currentPage={currentPage}
            page={1}
          />
          {maxPages < 3 ? null : currentPage >= 1 && currentPage <= 3 ? (
            <>
              <PageBtn
                createPageURL={createPageURL}
                currentPage={currentPage}
                page={2}
              />
              {maxPages > 3 && (
                <>
                  <PageBtn
                    createPageURL={createPageURL}
                    currentPage={currentPage}
                    page={3}
                  />
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
              <PageBtn
                createPageURL={createPageURL}
                currentPage={currentPage}
                page={maxPages - 2}
              />

              <PageBtn
                createPageURL={createPageURL}
                currentPage={currentPage}
                page={maxPages - 1}
              />
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
            <PageBtn
              createPageURL={createPageURL}
              currentPage={currentPage}
              page={maxPages}
            />
          )}
          <Link
            href={createPageURL(currentPage + 1)}
            scroll={false}
            className="paginationBtn"
            aria-label="Next Page"
          >
            <ChevronRightIcon className="size-5" />
          </Link>
        </div>
      )}
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

const PageBtn = ({
  createPageURL,
  page,
  currentPage,
}: {
  currentPage: number;
  page: number;
  createPageURL: (pagenumber: number) => string;
}) => {
  return (
    <Link
      href={createPageURL(page)}
      scroll={false}
      className={`paginationBtn ${currentPage == page ? "underline" : ""}`}
      aria-label={`Page ${page}`}
    >
      {page}
    </Link>
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
