import { FaPlus, FaMinus } from "react-icons/fa";
import { styled } from "~/stitches.config";
import { Row } from "./layout/Row";

export function Callout({ label, children }) {
  return (
    <Details>
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

  "> :not(summary)": {
    marginTop: "$2",
  },

  "[data-opened-icon]": {
    display: "none",
  },

  "&[open]": {
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
});
