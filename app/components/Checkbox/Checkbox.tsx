import React from "react";
import { FaCheck } from "react-icons/fa";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

export const Checkbox = ({ label, ...props }) => {
  const id = React.useId();
  return (
    <div className="flex items-center">
      <CheckboxPrimitive.Root
        {...props}
        id={id}
        className="flex h-[22px] w-[22px] items-center justify-center rounded-[4px] border border-gray8 bg-white hover:bg-violet3 focus:border-gray12 dark:bg-gray2"
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
          <FaCheck size={12} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label className="pl-2 select-none" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};
