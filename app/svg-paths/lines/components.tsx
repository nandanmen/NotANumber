import React from "react";
import { motion } from "framer-motion";
import { Button } from "../components/button";
import { useStateContext } from "./state";

export function HeartCommands() {
  return (
    <ol className="border border-gray8 bg-gray3 px-4 py-3 rounded-md font-mono">
      <li>
        M <span className="bg-gray8 py-1 px-2 rounded-md">11.995 7.23319</span>
      </li>
      <li>C 10.5455 5.60999 8.12832 5.17335 6.31215 6.65972</li>
      <li>C 4.4959 8.14609 4.2403 10.6312 5.66654 12.3892</li>
      <li>L 11.995 18.25</li>
      <li>L 18.3235 12.3892</li>
      <li>C 19.7498 10.6312 19.5253 8.13046 17.6779 6.65972</li>
      <li>
        C 15.8305 5.18899 13.4446 5.60999{" "}
        <span className="bg-gray8 py-1 px-2 rounded-md">11.995 7.23319</span>
      </li>
    </ol>
  );
}

export function ClosePathToggle() {
  const { data, set } = useStateContext("z");
  return (
    <div className="space-y-2">
      <Button onClick={() => set({ active: !data.active })}>Toggle Z</Button>
      <ol className="border border-gray8 bg-gray3 px-4 py-3 rounded-md font-mono">
        <li>M 11.995 7.23319</li>
        <li>C 10.5455 5.60999 8.12832 5.17335 6.31215 6.65972</li>
        <li>C 4.4959 8.14609 4.2403 10.6312 5.66654 12.3892</li>
        <li>L 11.995 18.25</li>
        <li>L 18.3235 12.3892</li>
        <li>C 19.7498 10.6312 19.5253 8.13046 17.6779 6.65972</li>
        <li>C 15.8305 5.18899 13.4446 5.60999 11.995 7.23319</li>
        {data.active && (
          <motion.li
            className="-mx-4 px-3 border-l-4 border-gray8 bg-gray6"
            animate={{ x: 0, opacity: 1 }}
            initial={{ x: -16, opacity: 0 }}
          >
            Z
          </motion.li>
        )}
      </ol>
    </div>
  );
}
