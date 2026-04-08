import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login", "/register"]
const adminRoutes = ["/admin"]
const customerRoutes = ["/dashboard"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionId = req.cookies.get("sessionId")?.value

  const isPublic = publicRoutes.some((r) => pathname.startsWith(r))

  if (!sessionId) {
    if (isPublic) return NextResponse.next()
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const res = await fetch(new URL("/api/auth/session", req.url), {
    headers: { cookie: `sessionId=${sessionId}` },
  })

  const data = await res.json()

  if (!data) {
    const response = NextResponse.redirect(new URL("/login", req.url))
    response.cookies.set("sessionId", "", { path: "/", maxAge: 0 })
    return response
  }

  const { role, hasBarberShop } = data 

  if (isPublic) {
    if (role === "ADMIN") {
      const dest = hasBarberShop ? "/admin" : "/admin/setup"
      return NextResponse.redirect(new URL(dest, req.url))
    }
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (pathname === "/admin/setup" && hasBarberShop) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  const isAdmin = adminRoutes.some((r) => pathname.startsWith(r))
  const isCustomer = customerRoutes.some((r) => pathname.startsWith(r))

  if (isAdmin && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (isCustomer && role !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
}