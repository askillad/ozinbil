import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Detects the language (cookie → Accept-Language → default) and redirects / → /ru
export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
