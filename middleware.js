import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "dona-magazine-super-secret-key-987654321" });
  const path = req.nextUrl.pathname;

  const allowedAdminRoles = ["Super-Admin", "Éditeur", "Journaliste", "Traducteur"];

  // Bypasser la vérification pour la page de connexion administrative
  if (path === "/admin/login") {
    // Si déjà administrateur, rediriger directement vers le dashboard
    if (token && allowedAdminRoles.includes(token.role)) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 1. Restriction sur le Dashboard Admin Next.js (/admin/*)
  if (path.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!allowedAdminRoles.includes(token.role)) {
      return NextResponse.redirect(new URL("/login?error=Unauthorized", req.url));
    }

    // Role restriction for Super-Admin settings & plans
    const isSettingsOrPlans = path.startsWith("/admin/settings") || path.startsWith("/admin/plans");
    if (isSettingsOrPlans && token.role !== "Super-Admin") {
      return NextResponse.redirect(new URL("/admin/dashboard?error=AccessDenied", req.url));
    }
  }

  // 2. Restriction sur l'Espace Lecture VIP (/espace-lecture/*)
  if (path.startsWith("/espace-lecture")) {
    if (!token) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url));
    }
    const isVip = token.role === "VIP_SUBSCRIBER" || allowedAdminRoles.includes(token.role);
    if (!isVip) {
      return NextResponse.redirect(new URL("/login?error=Unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

// Configuration des routes à intercepter par le Middleware
export const config = {
  matcher: ["/admin/:path*", "/espace-lecture/:path*"],
};
