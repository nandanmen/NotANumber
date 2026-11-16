import "~/app.css";
import { Outlet } from "react-router";
import { NotesHeader } from "./_components/header";

export default function NotesLayout() {
  return (
    <div className="bg-gray4 min-h-screen pb-32">
      <NotesHeader />
      <main className="bg-gray2 ring-1 ring-black/15 mx-10 flex shadow-xs">
        <div className="px-2 border-r border-border-soft flex flex-col justify-around text-gray4">
          {Array.from({ length: 8 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className="size-6 bg-current rounded-full" />
          ))}
        </div>
        <Outlet />
        <div className="w-10 border-l border-border-soft shrink-0" />
      </main>
    </div>
  );
}
