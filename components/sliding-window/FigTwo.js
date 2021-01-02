import { motion, AnimateSharedLayout } from "framer-motion";
import { BsTriangleFill } from "react-icons/bs";
import Item from "../shared/Item";

export default ({ state }) => {
  return (
    <>
      <div className="flex w-full justify-center">
        <AnimateSharedLayout>
          {state.arr.map((item, index) => (
            <Item
              key={index}
              variant={(state.subarray || []).includes(index) ? "show" : "hide"}
              className="relative"
            >
              {item}
              {index === state.i && (
                <motion.div
                  layoutId="caret"
                  className="absolute top-full mt-1 text-green-500"
                  style={{
                    fontSize: "8px",
                  }}
                >
                  <BsTriangleFill />
                </motion.div>
              )}
            </Item>
          ))}
        </AnimateSharedLayout>
      </div>
      <p className="font-mono w-full text-center mt-4">
        {JSON.stringify(state.result)}
      </p>
    </>
  );
};
