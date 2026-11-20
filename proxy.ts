import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/** Faqat tizimga kirgan foydalanuvchi ko'ra oladigan sahifalar */
const isAccountRoute = createRouteMatcher(["/profile(.*)", "/orders(.*)", "/settings(.*)"]);

export default clerkMiddleware(
  async (auth, request) => {
    // Kirmagan foydalanuvchi /sign-in?redirect_url=... ga yuboriladi
    if (isAccountRoute(request)) await auth.protect();
  },
  { signInUrl: "/sign-in", signUpUrl: "/sign-up" }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
