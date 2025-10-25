import { Wide } from "~/components/mdx/Wide";
import { Hello } from "./hello";
import { BackgroundGrid } from "~/components/stripe-pattern";

export function Drawing() {
  return (
    <Wide>
      <div className="border-y md:border-x border-borderStrong h-[320px] md:rounded-lg px-8 flex items-center justify-center relative">
        <BackgroundGrid />
        <div className="w-full max-w-[450px] relative">
          <Hello />
        </div>
      </div>
    </Wide>
  );
}

export function Checkmarks() {
  return (
    <Wide>
      <div className="border-y md:border-x border-borderStrong md:rounded-lg relative">
        <BackgroundGrid />
        <div className="relative grid grid-cols-2 divide-x divide-borderStrong h-full">
          <div>
            <CheckStroke />
          </div>
          <div>
            <CheckFill />
          </div>
        </div>
      </div>
    </Wide>
  );
}

function CheckStroke() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 13L10 16L17 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 13L10 16L17 8"
        className="stroke-blue9"
        strokeWidth="4"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckFill() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.6585 7.24744C18.0741 7.61112 18.1163 8.24288 17.7526 8.65852L10.7526 16.6585C10.5703 16.8668 10.3099 16.9902 10.0333 16.9995C9.75666 17.0087 9.4886 16.9028 9.29289 16.7071L6.29289 13.7071C5.90237 13.3166 5.90237 12.6834 6.29289 12.2929C6.68342 11.9024 7.31658 11.9024 7.70711 12.2929L9.95129 14.5371L16.2474 7.34151C16.6111 6.92587 17.2429 6.88375 17.6585 7.24744Z"
        fill="currentColor"
        className="stroke-blue9"
        strokeWidth="4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
