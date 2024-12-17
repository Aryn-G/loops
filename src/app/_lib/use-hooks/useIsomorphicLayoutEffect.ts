// modifed version of https://github.com/juliencrn/usehooks-ts/tree/master/packages/usehooks-ts/src/useIsomorphicLayoutEffect

import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
