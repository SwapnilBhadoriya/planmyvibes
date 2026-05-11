import { NextRequest, NextResponse } from "next/server"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only run on protected paths
  if (!pathname.startsWith("/admin") && pathname !== "/login") {
    return NextResponse.next()
  }

  // Fetch session from the NextAuth endpoint (runs in Node.js, has DB access)
  let session: { user?: { role?: string } } | null = null
  try {
    const res = await fetch(new URL("/api/auth/session", req.url), {
      headers: { cookie: req.headers.get("cookie") ?? "" },
      cache: "no-store",
    })
    session = await res.json()
  } catch {
    // If session fetch fails, treat as unauthenticated
  }

  const user = session?.user

  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
