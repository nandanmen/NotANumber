"use client";

import { useActiveIndex } from "~/components/mdx/scroll-group";
import { GridPath } from "./connectors";
import { Computer, Router } from "./network-devices";
import { NetworkDiagram } from "./network-diagram";

export function BGPScrollVisual() {
  const index = useActiveIndex();
  return (
    <div className="aspect-square">
      {index === 0 && (
        <NetworkDiagram
          nodes={[
            {
              x: 1,
              y: 1,
              content: <Computer label="1.1" labelColor="bg-blue9" />,
            },
            { x: 1, y: 4, content: <Router label={1} /> },
            { x: 5, y: 4, content: <Router label={2} /> },
            { x: 9, y: 4, content: <Router label={3} /> },
            {
              x: 9,
              y: 7,
              content: <Computer label="3.1" labelColor="bg-yellow10" />,
            },
          ]}
          edges={[
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
          ]}
        />
      )}
      {(index === 1 || index === 2) && (
        <NetworkDiagram
          nodes={[
            { x: 1, y: 4, content: <Router label={1} /> },
            { x: 5, y: 4, content: <Router label={2} /> },
            { x: 9, y: 4, content: <Router label={3} /> },
          ]}
          edges={[
            [0, 1],
            [1, 2],
          ]}
        />
      )}

      {index === 3 && (
        <NetworkDiagram
          nodes={[
            { x: 1, y: 4, content: <Router label={1} /> },
            { x: 5, y: 4, content: <Router label={2} /> },
            { x: 9, y: 4, content: <Router label={3} /> },
          ]}
          edges={[
            [0, 1],
            [1, 2],
          ]}
        >
          <GridPath
            points={[
              [2, 6],
              [2, 7],
              [10, 7],
              [10, 6],
            ]}
          />
        </NetworkDiagram>
      )}
    </div>
  );
}
