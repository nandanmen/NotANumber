import { MobileNavIsland } from "./MobileNavIsland";

const headings = [
  {
    text: "Layout Changes",
    id: "layout-changes",
  },
  {
    text: "Animating With CSS",
    id: "animating-with-css",
  },
  {
    text: "Introducing FLIP",
    id: "introducing-flip",
  },
  {
    text: "Animating Size",
    id: "animating-size",
  },
  {
    text: "Consolidating Size with Position",
    id: "consolidating-size-with-position",
  },
  {
    text: "Correcting Child Distortions",
    id: "correcting-child-distortions",
  },
  {
    text: "Summary",
    id: "summary",
  },
];

export const Default = () => <MobileNavIsland headings={headings} />;
