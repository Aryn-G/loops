"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { DebouncedState, useDebouncedCallback } from "use-debounce";

/**
 * Use URL Search Parameter Abstracted
 *
 * @param paramName name of search param in url
 * @param defaultValue if search param is null, default to this value
 * @param del true if search param should delete if it is empty
 * @param debounceDelay debounce delay in ms
 * @returns
 */
export function useSearchParam(
  paramName: string,
  defaultValue: string = "",
  del: boolean = true,
  debounceDelay: number = 300
): [
  string,
  string,
  Dispatch<SetStateAction<string>>,
  DebouncedState<(value: string) => void>
] {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const param =
    searchParams.get(paramName) !== null
      ? searchParams.get(paramName)!
      : defaultValue;

  const [p, setP] = useState(param);

  const update = useDebouncedCallback((value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    params.set("p", "1");
    if (value) {
      params.set(paramName, value);
    } else {
      if (del) params.delete(paramName);
      else params.set(paramName, "");
    }
    replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }, debounceDelay);

  return [param, p, setP, update];
}
