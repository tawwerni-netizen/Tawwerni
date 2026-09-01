import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  REFERRAL_COOKIE,
  REFERRAL_COOKIE_MAX_AGE,
  REFERRAL_PARAM,
} from "@/lib/referral-constants";
import { PUBLIC_COURSE_PAGE } from "@/lib/public-routes";

const SESSION_COOKIE = "tawwerni_session";

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

/**
 * Stores `?ref=CODE` on the response so the credit survives the visitor
 * browsing around and coming back days later. Attribution to an account
 * happens server-side at signup — this only carries the code.
 */
function captureReferral(request: NextRequest, response: NextResponse) {
  const code = request.nextUrl.searchParams.get(REFERRAL_PARAM);
  if (!code) return response;

  response.cookies.set(REFERRAL_COOKIE, code.trim().toUpperCase().slice(0, 16), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: REFERRAL_COOKIE_MAX_AGE,
  });
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected =
    (pathname.startsWith("/app") && !PUBLIC_COURSE_PAGE.test(pathname)) ||
    pathname.startsWith("/onboarding");
  const isLoginPage = pathname === "/login";

  const loggedIn = await hasValidSession(request);

  if (isProtected && !loggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return captureReferral(request, NextResponse.redirect(url));
  }

  if (isLoginPage && loggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return captureReferral(request, NextResponse.redirect(url));
  }

  // `app/app/layout.tsx` runs its own independent auth check and has no
  // other way to know which page it's wrapping — Server Component layouts
  // don't receive a leaf route's pathname. This is the one channel available
  // to tell it "this one's the public exception too".
  const headers = new Headers(request.headers);
  headers.set("x-pathname", pathname);
  return captureReferral(request, NextResponse.next({ request: { headers } }));
}

export const config = {
  // Referral links land on the marketing pages, so the matcher has to cover
  // the whole site, not just the authenticated area.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
