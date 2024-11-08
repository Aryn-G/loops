import React, { useEffect, useRef, useState } from "react";
import CaretRight from "../_icons/CaretRight";

type Props = {
  children: JSX.Element[];
  itemsPerPage: number;
  className?: string;
};

const Pagination = (props: Props) => {
  const [items, setItems] = useState(props.children);
  const [itemsPerPage, setItemsPerPage] = useState(props.itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(
    Math.ceil(items.length / itemsPerPage)
  );
  const [lower, setLower] = useState(0);
  const [upper, setUpper] = useState(itemsPerPage);
  useEffect(() => {
    setItems(props.children);
    setItemsPerPage(props.itemsPerPage);
    setCurrentPage(1);
    setLower(0);
    setUpper(props.itemsPerPage);
    setMaxPages(Math.ceil(props.children.length / props.itemsPerPage));
  }, [props]);
  const next = () => {
    if (upper < items.length) {
      setLower(lower + itemsPerPage);
      setUpper(upper + itemsPerPage);
      setCurrentPage(currentPage + 1);
    }
  };
  const prev = () => {
    if (lower > 0) {
      setLower(lower - itemsPerPage);
      setUpper(upper - itemsPerPage);
      setCurrentPage(currentPage - 1);
    }
  };
  const page = (num: number) => {
    setLower((num - 1) * itemsPerPage);
    setUpper((num - 1) * itemsPerPage + itemsPerPage);
    setCurrentPage(num);
  };

  const pageNumberString = () => {
    let l = lower + 1;
    let u = upper > items.length ? items.length : upper;
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
        <button
          onClick={prev}
          className="paginationBtn"
          aria-label="Previous Page"
        >
          <CaretRight className="size-6 rotate-180" />
        </button>
        <button
          onClick={() => page(1)}
          className={`paginationBtn ${currentPage == 1 ? "underline" : ""}`}
          aria-label="Page 1"
        >
          1
        </button>
        {maxPages < 3 ? null : currentPage >= 1 && currentPage <= 3 ? (
          <>
            <button
              onClick={() => page(2)}
              className={`paginationBtn ${currentPage == 2 ? "underline" : ""}`}
              aria-label="Page 2"
            >
              2
            </button>
            {maxPages > 3 && (
              <>
                <button
                  onClick={() => page(2)}
                  className={`paginationBtn ${
                    currentPage == 3 ? "underline" : ""
                  }`}
                  aria-label="Page 3"
                >
                  3
                </button>
                {maxPages > 4 && <DotBtn setPage={page} maxPage={maxPages} />}
              </>
            )}
          </>
        ) : currentPage >= maxPages - 2 && currentPage <= maxPages ? (
          <>
            {maxPages > 4 && <DotBtn setPage={page} maxPage={maxPages} />}
            <button
              onClick={() => page(maxPages - 2)}
              className={`paginationBtn ${
                currentPage == maxPages - 2 ? "underline" : ""
              }`}
              aria-label={`Page ${maxPages - 2}`}
            >
              {maxPages - 2}
            </button>
            <button
              onClick={() => page(maxPages - 1)}
              className={`paginationBtn ${
                currentPage == maxPages - 1 ? "underline" : ""
              }`}
              aria-label={`Page ${maxPages - 1}`}
            >
              {maxPages - 1}
            </button>
          </>
        ) : (
          <>
            <DotBtn setPage={page} maxPage={maxPages} />
            <button
              onClick={() => page(currentPage)}
              className="paginationBtn underline"
              aria-label={`Page ${currentPage}`}
            >
              {currentPage}
            </button>
            <DotBtn setPage={page} maxPage={maxPages} />
          </>
        )}
        {maxPages > 1 && (
          <button
            onClick={() => page(maxPages)}
            className={`paginationBtn ${
              currentPage == maxPages ? "underline" : ""
            }`}
            aria-label={`Page ${maxPages}`}
          >
            {maxPages}
          </button>
        )}
        <button onClick={next} className="paginationBtn" aria-label="Next Page">
          <CaretRight />
        </button>
      </div>
      <div className={props.className ?? "flex flex-col gap-2"}>
        {items.filter((item, i) => i >= lower && i < upper)}
      </div>
    </div>
  );
};

const DotBtn = ({
  setPage,
  maxPage,
}: {
  setPage: (num: number) => void;
  maxPage: number;
}) => {
  const [isBtn, setIsBtn] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isBtn]);

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
            if (!inputRef.current) return;
            if (
              parseInt(inputRef.current.value) > 0 &&
              parseInt(inputRef.current.value) <= maxPage
            ) {
              setPage(parseInt(inputRef.current.value));
              setIsBtn(true);
            }
          }}
          className="flex items-center justify-center"
        >
          <input
            type="number"
            ref={inputRef}
            onBlur={(e) => {
              setIsBtn(true);
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
