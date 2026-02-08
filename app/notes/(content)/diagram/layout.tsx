import { WorkflowDiagram } from "./_components/workflows/diagram";
import { workflowManyOdd } from "./_components/workflows/example";

export default function DiagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <article className="grid grid-cols-2 [&>*]:col-start-1 auto-rows-min gap-y-4 pl-12 pb-20 relative gap-x-12 leading-relaxed isolate">
      {/* <div className="absolute top-[72px] right-0 text-right text-sm font-mono text-gray9">
        <p>Nanda_Syahrasyad</p>
        <p>4/Feb/2026</p>
      </div> */}
      <header className="pt-20 pb-16 col-span-2">
        <h1 className="font-serif text-7xl text-balance leading-[1.1]">
          DOM-Based Diagrams
        </h1>
        <p className="text-gray11 mt-2">
          An approach to visualizing control flow graphs with HTML and CSS
        </p>
      </header>
      <p>
        Over the last few weeks, I've been toying with visualizing directed
        acyclic graphs (DAGs for short)—specifically ones that track the
        execution of code. After a ton of experimenting, I landed on an approach
        that primarily uses HTML and CSS for both laying out the nodes and
        rendering the connectors. The final technique was used in Cloudflare's
        latest workflows visualization launch.
      </p>
      <p className="mb-16">
        In this post, I want to talk more deeply about how it works and why I
        chose this approach over something like SVGs.
      </p>
      <div className="border-l border-borderSoft shrink-0 flex pt-12 justify-center !col-start-2 row-span-6 row-start-2 -mr-12">
        <WorkflowDiagram workflow={workflowManyOdd} />
      </div>
      {children}
    </article>
  );
}
