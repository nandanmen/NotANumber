import { FaPlus, FaMinus } from "react-icons/fa";
import { styled } from "~/stitches.config";
import { Row } from "./layout/Row";

export function Callout({ label, defaultOpen = false, children }) {
  return (
    <Details open={defaultOpen}>
      <Summary as="summary" center="vertical">
        <Row data-closed-icon center="all">
          <FaPlus />
        </Row>
        <Row data-opened-icon center="all">
          <FaMinus />
        </Row>
        {label}
      </Summary>
      {children}
    </Details>
  );
}

const Details = styled("details", {
  border: "1px solid $gray8",
  padding: "$4",
  borderRadius: "$base",
  background: "$gray3",
  overflow: "hidden",

  "> :not(summary)": {
    marginTop: "$2",

    "&:nth-child(2)": {
      marginTop: "$8",
    },
  },

  "[data-opened-icon]": {
    display: "none",
  },

  "&[open]": {
    "> summary": {
      borderBottom: "1px dashed $gray8",
    },

    "[data-closed-icon]": {
      display: "none",
    },

    "[data-opened-icon]": {
      display: "flex",
    },
  },
});

const Summary = styled(Row, {
  fontWeight: "bold",
  color: "$gray11",
  gap: "$2",
  cursor: "pointer",
  margin: "-$4",
  padding: "$4",

  "&:hover": {
    background: "$gray6",
  },
});
