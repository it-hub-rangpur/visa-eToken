import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLoginUserInfo } from "./app/api/v2/__helpers";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value || "";
  const path = request.nextUrl.pathname;

  // sign-in route
  if (path === "/login") {
    if (accessToken) {
      try {
        const loginInfo = await getLoginUserInfo(accessToken);
        if (loginInfo?.success) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (error) {
        console.log(error);
      }
    }
    return NextResponse.next();
  }

  const WHITELISTED_ROUTES = ["login"];

  // Check whitelist based on route type
  const isWhitelisted = WHITELISTED_ROUTES.find(
    (routePath) => path === routePath
  )
    ? true
    : false;

  if (isWhitelisted) {
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const loginInfo = await getLoginUserInfo(accessToken);

    if (!loginInfo?.success) {
      return NextResponse.redirect(new URL("/login", request.url));
    } else {
      return NextResponse.next();
    }

    // Check if user is COMPANY_ADMIN with null companyId
    // if (user.roles.includes("COMPANY_ADMIN")) {
    //   if (!user.name) {
    //     if (path !== "/sign-up/onboarding") {
    //       return NextResponse.redirect(
    //         new URL("/sign-up/onboarding", request.url)
    //       );
    //     }
    //   } else if (!user.companyId) {
    //     if (!user.companyReqId) {
    //       if (
    //         path !== "/company/onboarding/initial" ||
    //         request.nextUrl.searchParams.get("popup") != "true"
    //       ) {
    //         return NextResponse.redirect(
    //           new URL("/company/onboarding/initial?popup=true", request.url)
    //         );
    //       }
    //     }
    //   }
    // }
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - /_next/static
     * - /_next/image
     * - /favicon.ico
     * - /api
     * - /static (your SVGs)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|api|static).*)",
  ],
};
