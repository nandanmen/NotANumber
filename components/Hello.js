import clsx from "clsx";
import { motion } from "framer-motion";

export default function Hello({ state }) {
  return (
    <>
      <div className="flex w-full justify-center">
        {state.arr.map((item, index) => (
          <Item key={index} variant={state.window.includes(index) ? "show" : "hide"}>
            {item}
          </Item>
        ))}
      </div>
      <p className="font-mono w-full text-center mt-4">sum: {state.sum}</p>
    </>
  );
}

const variants = {
  hide: {
    opacity: 0.25,
    scale: 0.9,
  },
  show: {
    opacity: 1,
    scale: 1,
  },
};

function Item({ variant = "show", ...props }) {
  return (
    <motion.div
      variants={variants}
      animate={variant}
      transition={{
        scale: {
          type: "spring",
          bounce: 0.75,
        },
      }}
      className={clsx(
        "w-12 h-12 rounded-lg bg-green-400 text-white font-semibold flex items-center justify-center mr-2"
      )}
      {...props}
    />
  );
}
