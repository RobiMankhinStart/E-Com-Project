import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || process.env.JWT_SEC;
const SECRET = new TextEncoder().encode(secretKey);

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  console.log("pathname", pathname);

  // Protecting /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("X-AS-Token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    console.log(SECRET);

    try {
      // Verify JWT
      const { payload } = await jwtVerify(token, SECRET);

      // Optional: role-based check
      if (!["admin", "editor"].includes(payload.role)) {
        return NextResponse.redirect(new URL("/signin", request.url));
      }

      // Token is valid → continue
      return NextResponse.next();
    } catch (err) {
      console.log("cookie-error : ", err);
      request.cookies.delete("X-RF-Token");
      request.cookies.delete("X-AS-Token");
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

// Applying middleware only to admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
