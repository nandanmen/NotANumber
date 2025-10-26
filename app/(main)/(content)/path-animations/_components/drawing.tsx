"use client";

import { Hello } from "./hello";
import { PathParts } from "./path-parts";
import { Figure } from "./figure";
import * as styles from "./styles.module.css";
import { ToggleButton } from "../../database/_components/toggle-button";
import { useAnimate } from "motion/react";

export function Drawing() {
  return (
    <Figure
      variant="grid"
      className="px-8 flex items-center justify-center h-[320px]"
    >
      <div className="w-full max-w-[450px] relative">
        <Hello />
      </div>
    </Figure>
  );
}

const CHECK_STROKE = "M7 13L10 16L17 8";
const CHECK_FILL =
  "M17.6585 7.24744C18.0741 7.61112 18.1163 8.24288 17.7526 8.65852L10.7526 16.6585C10.5703 16.8668 10.3099 16.9902 10.0333 16.9995C9.75666 17.0087 9.4886 16.9028 9.29289 16.7071L6.29289 13.7071C5.90237 13.3166 5.90237 12.6834 6.29289 12.2929C6.68342 11.9024 7.31658 11.9024 7.70711 12.2929L9.95129 14.5371L16.2474 7.34151C16.6111 6.92587 17.2429 6.88375 17.6585 7.24744Z";

export function Checkmarks({ showSkeleton = false }) {
  const [scope, animate] = useAnimate();
  return (
    <Figure
      variant="grid"
      controls={
        <ToggleButton
          onClick={async () => {
            await animate(
              ".path",
              { strokeDashoffset: [0, -16] },
              { type: "spring", bounce: 0, duration: 1 }
            );
            await animate(
              ".path",
              { strokeDashoffset: [16, 0] },
              { type: "spring", bounce: 0, duration: 1 }
            );
          }}
        >
          Play
        </ToggleButton>
      }
    >
      <div
        ref={scope}
        className="grid h-full grid-cols-2 divide-x divide-borderStrong"
      >
        <div className="flex justify-center relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            width="100%"
            className="max-w-[300px]"
          >
            <path
              d={CHECK_STROKE}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="16"
              strokeDashoffset="0"
              className="path"
            />
            {showSkeleton && <PathParts d={CHECK_STROKE} />}
          </svg>
        </div>
        <div className="flex justify-center relative border-l border-borderStrong">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            width="100%"
            className="max-w-[300px]"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d={CHECK_FILL}
              fill="currentColor"
              className="path"
            />
            {showSkeleton && <PathParts d={CHECK_FILL} />}
          </svg>
        </div>
      </div>
    </Figure>
  );
}
