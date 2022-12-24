import React from "react";
import { darkTheme, styled } from "~/stitches.config";
import { violet, blackA } from "@radix-ui/colors";
import { FaCheck } from "react-icons/fa";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

const StyledCheckbox = styled(CheckboxPrimitive.Root, {
  all: "unset",
  backgroundColor: "white",
  width: 22,
  height: 22,
  borderRadius: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid $gray8",
  "&:hover": { backgroundColor: violet.violet3 },
  "&:focus": { borderColor: "$gray12" },

  [`.${darkTheme} &`]: {
    backgroundColor: "$gray2",
  },
});

const StyledIndicator = styled(CheckboxPrimitive.Indicator, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// Your app...
const Flex = styled("div", { display: "flex" });
const Label = styled("label", {
  userSelect: "none",
});

export const Checkbox = ({ label, ...props }) => {
  const id = React.useId();
  return (
    <Flex css={{ alignItems: "center" }}>
      <StyledCheckbox {...props} id={id}>
        <StyledIndicator>
          <FaCheck size={12} />
        </StyledIndicator>
      </StyledCheckbox>
      <Label css={{ paddingLeft: "$2" }} htmlFor={id}>
        {label}
      </Label>
    </Flex>
  );
};
