import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  console.log("URL: ", url);
  const domain =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";

  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams ? `?${searchParams}` : ""}`;

  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;
  const BUILDER_DOMAIN = `builder.${ROOT_DOMAIN}`;

  if (domain === BUILDER_DOMAIN) {
    return NextResponse.rewrite(
      new URL(`/builder${path === "/" ? "" : path}`, request.url)
    );
  }
}

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};
