import { FaPlus, FaMinus } from "react-icons/fa";
import { Row } from "./layout/Row";

export function Callout({ label, children }) {
  return (
    <details className="group rounded-md border border-gray8 p-4 [&>:not(summary)]:mt-2">
      <summary className="flex cursor-pointer items-center gap-2 font-bold text-gray11">
        <Row center="all" className="group-open:hidden">
          <FaPlus />
        </Row>
        <Row center="all" className="hidden group-open:flex">
          <FaMinus />
        </Row>
        {label}
      </summary>
      {children}
    </details>
  );
}
