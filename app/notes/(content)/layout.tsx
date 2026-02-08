import { NotesHeader } from "./_components/header";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray4 min-h-screen pb-32">
      <NotesHeader />
      <main className="bg-gray2 ring-1 ring-black/15 w-full max-w-[1500px] mx-auto flex shadow-sm">
        <div className="px-2 border-r border-borderSoft flex flex-col justify-around text-gray4">
          {Array.from({ length: 8 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className="size-6 bg-current rounded-full" />
          ))}
        </div>
        {children}
        <div className="w-10 border-l border-borderSoft shrink-0" />
      </main>
    </div>
  );
}
