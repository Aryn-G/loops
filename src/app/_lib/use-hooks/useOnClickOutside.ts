// modifed version of https://github.com/juliencrn/usehooks-ts/tree/master/packages/usehooks-ts/src/useOnClickOutside

import { RefObject } from "react";
import useEventListener from "./useEventListener";

type Handler = (event: MouseEvent) => void;

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  mouseEvent: "mousedown" | "mouseup" | "touchstart" = "mousedown"
): void {
  useEventListener(mouseEvent, (event) => {
    const el = ref?.current;

    // Do nothing if clicking ref's element or descendent elements
    if (!el || el.contains(event.target as Node)) {
      return;
    }

    // Explicit type for "mousedown" event.
    handler(event as unknown as MouseEvent);
  });
}

export default useOnClickOutside;
