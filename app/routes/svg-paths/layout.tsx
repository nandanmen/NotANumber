import "~/app.css";
import { Outlet } from "react-router";
import { BackgroundStripes } from "~/components/stripe-pattern";

export default function Layout() {
  return (
    <div className="relative px-4">
      <BackgroundStripes />
      <main className="grid lg:grid-cols-[min-content_1fr] min-h-screen max-w-[calc(68ch+100vh)] mx-auto bg-gray4 border-x border-gray8 relative">
        <Outlet />
      </main>
    </div>
  );
}
