// modifed version of https://github.com/juliencrn/usehooks-ts/tree/master/packages/usehooks-ts/src/useEventListener

import { RefObject, useEffect, useRef } from "react";

function useEventListener<T extends HTMLElement = HTMLElement>(
  eventName: keyof WindowEventMap | string,
  handler: (event: Event) => void,
  element?: RefObject<T>
) {
  const savedHandler = useRef<(event: Event) => void>();

  useEffect(() => {
    const targetElement: T | Window = element?.current || window;
    if (!(targetElement && targetElement.addEventListener)) return;
    // @ts-ignore
    if (savedHandler !== handler) {
      savedHandler.current = handler;
    }

    const eventListener = (event: Event) => {
      if (!!savedHandler?.current) {
        savedHandler.current(event);
      }
    };

    targetElement.addEventListener(eventName, eventListener);

    return () => targetElement.removeEventListener(eventName, eventListener);
  }, [eventName, element, handler]);
}

export default useEventListener;
