import type { Heading } from "~/lib/content.server";
import { styled } from "~/stitches.config";
import { MobileNavIsland } from "./MobileNavIsland";

export const MobileBottomBar = ({ headings }: { headings: Heading[] }) => {
  return (
    <Wrapper>
      <MobileNavIsland headings={headings} />
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  position: "fixed",
  width: "min(800px, 100vw)",
  bottom: 0,
  padding: "$4",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 20,

  "@media (min-width: 72rem)": {
    display: "none",
  },
});
