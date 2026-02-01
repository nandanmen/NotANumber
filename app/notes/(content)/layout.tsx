export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#EDEAE5] pt-24 min-h-screen flex flex-col">
      <main className="bg-[#fcfaf6] max-w-[1200px] mx-auto grow w-full flex">
        <div className="px-2 border-r border-[#E5E2DC] flex flex-col justify-around text-[#EDEAE5]">
          {Array.from({ length: 8 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className="size-6 bg-current rounded-full" />
          ))}
        </div>
        <div className="py-24 px-16">{children}</div>
      </main>
    </div>
  );
}
