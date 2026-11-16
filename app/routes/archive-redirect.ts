import { redirect } from "react-router";
import type { Route } from "./+types/archive-redirect";

/** Posts that moved to the archive site. Temporary (307), like before. */
export function loader({ request }: Route.LoaderArgs) {
  const { pathname } = new URL(request.url);
  return redirect(`https://nan-archive.vercel.app${pathname}`, 307);
}
