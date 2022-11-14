import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

import { GridOverflowBox } from "~/components/Grid";
import { styled } from "~/stitches.config";

const phases = ["Tokenize", "Parse", "Transform", "Generate"];

export const Pipeline = () => {
  return (
    <GridOverflowBox>
      <PhaseList>
        {phases.map((phase) => (
          <>
            <IconWrapper>
              <FaArrowRight />
            </IconWrapper>
            <Phase>{phase}</Phase>
          </>
        ))}
        <IconWrapper>
          <FaArrowRight />
        </IconWrapper>
      </PhaseList>
    </GridOverflowBox>
  );
};

const IconWrapper = styled("li", {
  color: "$gray11",
  display: "flex",
  alignItems: "center",
});

const PhaseList = styled("ul", {
  listStyle: "none",
  gap: "$2",
  display: "grid",
  gridTemplateColumns: "repeat(4, $space$4 1fr) $space$4",
  alignItems: "center",
});

const Phase = styled(motion.li, {
  border: "1px solid $gray8",
  padding: "$3",
  borderRadius: "$base",
  background: "$gray2",
  fontSize: "$sm",
  fontFamily: "$mono",
  textAlign: "center",
});
