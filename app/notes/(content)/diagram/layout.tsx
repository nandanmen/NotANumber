export default function DiagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <article className="grid grid-cols-1 [&>*]:col-start-1 [&>p]:max-w-[60ch] auto-rows-min gap-y-4">
      <header className="mb-16 flex gap-20 -mr-20">
        <div className="space-y-16">
          <div className="space-y-2">
            <h1 className="font-serif text-6xl text-balance">
              A Diagram Without SVGs
            </h1>
            <p className="text-[#5F5C57]">
              A different approach to visualizing control flow graphs
            </p>
          </div>
          <p>
            Over the last few weeks, I've been toying with visualizing control
            flow graphs—a type of graph that represents all the possible
            execution paths a program can take. Perhaps rather unintuitively,
            the solution that I ended up with does not use SVGs in its
            implementation. In this post, I want to go over the iterative
            process I took to build the diagram.
          </p>
        </div>
        <div className="bg-white -my-16 w-[400px] shrink-0 flex items-center justify-center">
          hello
        </div>
      </header>
      {children}
    </article>
  );
}
