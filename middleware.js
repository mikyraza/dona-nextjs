import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Restriction sur le Dashboard Admin Next.js (/admin/*)
    // Seuls les utilisateurs ADMIN ont l'autorisation d'accéder à l'administration
    if (path.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // 2. Restriction sur l'Espace Lecture VIP (/espace-lecture/*)
    // Seuls les utilisateurs abonnés (VIP_SUBSCRIBER) et ADMIN ont l'autorisation d'y accéder
    if (path.startsWith("/espace-lecture")) {
      if (token?.role !== "VIP_SUBSCRIBER" && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Règle de base : l'utilisateur doit posséder un jeton de session actif
      // pour que les routes spécifiées dans le matcher soient accessibles.
      authorized: ({ token }) => !!token,
    },
  }
);

// Configuration des routes à intercepter par le Middleware
export const config = {
  matcher: ["/admin/:path*", "/espace-lecture/:path*"],
};
