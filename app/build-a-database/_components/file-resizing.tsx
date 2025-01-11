"use client";

import { useState } from "react";
import { ResetButton, ToggleButton } from "./toggle-button";

export function FileResizing() {
  const [updated, setUpdated] = useState(false);
  return (
    <>
      <div className="flex gap-1">
        <ToggleButton onClick={() => setUpdated(true)}>Update</ToggleButton>
        <ResetButton onClick={() => setUpdated(false)} />
      </div>
      <p className="rounded-lg bg-gray3 border border-gray8 p-5 font-mono text-sm">
        <span>001:Lorem ipsum\n</span>
        <span className="bg-blue6">
          018:{updated ? "amet, consectetur" : "dolor sit"}
        </span>
        <span>
          \n006:vel mauris\n014:adipiscing elit.\n020:Vestibulum
          varius\n013:iaculus pharetra.
        </span>
      </p>
    </>
  );
}
