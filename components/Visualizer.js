import React from "react";
import clsx from "clsx";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { FaUndo } from "react-icons/fa";

import useAlgorithm from "../lib/useAlgorithm";

export default function Visualizer({
  Component,
  caption,
  children,
  initialInputs = [],
  controls,
  autoplay,
}) {
  const context = useAlgorithm(getCodeText(children), initialInputs);
  const { play } = context.actions;

  React.useEffect(() => {
    if (autoplay) {
      play();
    }
  }, [autoplay, play]);

  return (
    <div style={{ gridColumn: "2 / -2" }} className="mt-4 mb-8">
      <div
        className={clsx("p-8 rounded-2xl relative", {
          "bg-gray-200": Component,
          "bg-yellow-200": !Component,
        })}
      >
        {!Component && <p className="font-semibold text-center">Implement me!</p>}
        {Component && (
          <>
            <div>
              <Component state={context.models.state} />
            </div>
            {controls && (
              <div className="absolute left-4 bottom-4 text-gray-500">
                <button
                  className="rounded-lg bg-gray-100 p-2 mr-1 font-semibold"
                  onClick={context.actions.prev}
                >
                  <HiArrowLeft />
                </button>
                <button
                  className="rounded-lg bg-gray-100 p-2 font-semibold"
                  onClick={context.actions.next}
                >
                  <HiArrowRight />
                </button>
              </div>
            )}
            <button
              className="absolute top-4 right-4 rounded-lg bg-gray-100 p-2 mr-1 font-semibold text-gray-500"
              onClick={context.actions.toggle}
            >
              <FaUndo />
            </button>
          </>
        )}
      </div>
      {caption && <p className="text-center text-sm mt-4">{caption}</p>}
    </div>
  );
}

const getCodeText = (children) => children.props.children.props.children;
