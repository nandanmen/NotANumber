import type { ReactNode } from "react";
import { Connectors } from "./_components/connectors";
import { GridCell } from "./_components/grid-cell";
import { Computer, Router, Server } from "./_components/network-devices";

export function ArticleTitle({
  title,
  description,
}: {
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <header className="text-center space-y-4">
      <h1 className="text-[52px] md:text-[72px] font-serif leading-[1] text-balance">
        {title}
      </h1>
      <p className="text-gray11">{description}</p>
    </header>
  );
}

export function PageHeader({ children }: { children: ReactNode }) {
  return (
    <div className="!col-start-1 col-span-4 grid grid-cols-subgrid relative min-h-[round(up,60vh,var(--grid-size))]">
      <section className="col-start-2 auto-rows-min gap-y-5 leading-relaxed grid">
        {children}
      </section>
      <figure className="col-start-4 flex flex-col items-center">
        <GridCell className="relative" margin={{ y: 2 }}>
          <Connectors />
          <div className="relative flex flex-col items-center">
            <div className="flex justify-between">
              <GridCell className="flex items-center" width={2} height={2}>
                <Server />
              </GridCell>
              <GridCell
                className="flex items-center"
                margin={{ left: 2 }}
                width={2}
                height={2}
              >
                <Server />
              </GridCell>
            </div>
            <GridCell className="flex items-center" width={2} height={2}>
              <Router />
            </GridCell>
            <GridCell
              margin={{ top: 1 }}
              className="flex items-center"
              width={2}
              height={2}
            >
              <Router />
            </GridCell>
            <GridCell className="flex">
              <GridCell
                className="flex items-center"
                margin={{ right: 4 }}
                width={2}
                height={2}
              >
                <Computer />
              </GridCell>
              <GridCell className="flex items-center" width={2} height={2}>
                <Computer />
              </GridCell>
            </GridCell>
            <GridCell className="flex items-center" width={2} height={2}>
              <Computer />
            </GridCell>
          </div>
        </GridCell>
      </figure>
    </div>
  );
}
