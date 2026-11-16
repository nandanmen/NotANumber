import "~/app.css";
import { Outlet } from "react-router";
import { Prototyper } from "../../prototyper/prototyper";

export default function MainLayout() {
  return (
    <div className="min-h-screen isolate">
      <Outlet />
      {import.meta.env.DEV ? <Prototyper /> : null}
    </div>
  );
}
