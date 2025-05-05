import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// adds base url and pathname to headers
// used in `unauthorized.tsx` for error screen
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
