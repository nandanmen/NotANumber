import { WorkflowDiagram } from "./_components/workflows/diagram";
import { workflowManyOdd } from "./_components/workflows/example";

export default function DiagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <article className="grid grid-cols-2 [&>*]:col-start-1 auto-rows-min gap-y-4 pl-12 pb-20 relative gap-x-12 leading-relaxed">
      {/* <div className="absolute top-[72px] right-0 text-right text-sm font-mono text-gray9">
        <p>Nanda_Syahrasyad</p>
        <p>4/Feb/2026</p>
      </div> */}
      <header className="pt-20 pb-16 col-span-2">
        <h1 className="font-serif text-7xl text-balance leading-[1.1]">
          Diagramming Workflows
        </h1>
        <p className="text-gray11 mt-2">
          An approach to visualizing control flow graphs with HTML and CSS
        </p>
      </header>
      <p className="mb-16">
        Over the last few weeks, I've been toying with visualizing Cloudflare
        Workflows, the result of which we launched publicly last week. Here, I
        want to talk a bit about the process of building the diagram you see on
        the right; as you might expect, it proved to be quite a bit of a
        journey.
      </p>
      <div className="border-l border-borderSoft shrink-0 flex items-center justify-center !col-start-2 row-span-6 -mr-12">
        <WorkflowDiagram workflow={workflowManyOdd} />
      </div>
      {children}
    </article>
  );
}
