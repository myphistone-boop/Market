import { clerkMiddleware } from "@clerk/nextjs/server";

// Middleware Clerk actif seulement si la clé est configurée ;
// sinon passe-plat (aucune requête bloquée).
const enabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const middleware = enabled ? clerkMiddleware() : function middleware() {};

export default middleware;

export const config = {
  matcher: ["/((?!_next|.*\\.[\\w]+$).*)", "/"],
};
