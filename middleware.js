import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Bypasser la vérification pour la page de connexion administrative
  if (path === "/admin/login") {
    // Si déjà administrateur, rediriger directement vers le dashboard
    if (token && token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 1. Restriction sur le Dashboard Admin Next.js (/admin/*)
  if (path.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login?error=Unauthorized", req.url));
    }
  }

  // 2. Restriction sur l'Espace Lecture VIP (/espace-lecture/*)
  if (path.startsWith("/espace-lecture")) {
    if (!token) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url));
    }
    if (token.role !== "VIP_SUBSCRIBER" && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?error=Unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

// Configuration des routes à intercepter par le Middleware
export const config = {
  matcher: ["/admin/:path*", "/espace-lecture/:path*"],
};
