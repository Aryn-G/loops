"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { DebouncedState, useDebouncedCallback } from "use-debounce";

type maybeString = string | undefined | null;

export function useManyParams(debounceDelay: number = 300) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  return {
    updateMany: useDebouncedCallback(
      (values: Record<string, maybeString>, del: boolean = true) => {
        const params = new URLSearchParams(searchParams);
        params.set("p", "1");

        for (const key in values) {
          if (typeof values[key] === "string") {
            params.set(key, values[key]);
          } else {
            if (del) params.delete(key);
            else params.set(key, "");
          }
        }
        replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      },
      debounceDelay
    ),
  };
}

/**
 * Use URL Search Parameter Abstracted
 *
 * @param paramName name of search param in url
 * @param defaultValue if search param is null, default to this value
 * @param del true if search param should delete if it is empty
 * @param debounceDelay debounce delay in ms
 * @param validator validate inputs
 * @returns [param (debounced), state (not debounced), setState (not debounced), update (debounced)]
 */
export function useSearchParam(
  paramName: string,
  defaultValue: string = "",
  validator: (input: maybeString) => maybeString = (input) => input,
  del: boolean = true,
  debounceDelay: number = 300
): [
  string,
  string,
  Dispatch<SetStateAction<string>>,
  DebouncedState<(value: maybeString) => void>
] {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const param =
    searchParams.get(paramName) !== null
      ? searchParams.get(paramName)!
      : defaultValue;

  const [p, setP] = useState(validator(param) ?? "");

  const update = useDebouncedCallback((value?: maybeString) => {
    value = validator(value);
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
