import React from "react";
import clsx from "clsx";
import { HiArrowLeft, HiArrowRight, HiPencil, HiX } from "react-icons/hi";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import { FaUndo } from "react-icons/fa";
import { motion } from "framer-motion";

import useAlgorithm from "../lib/useAlgorithm";

export default function Visualizer({
  Component,
  caption,
  children,
  initialInputs = [],
  controls,
  editable,
  readOnly,
}) {
  const code = getCodeText(children);
  const [showForm, toggle] = React.useReducer((show) => !show, false);
  const context = useAlgorithm(code, initialInputs);
  const { state, steps, isPlaying, inputs, params } = context.models;

  return (
    <div style={{ gridColumn: "2 / -2" }} className="mt-4 mb-8 z-0">
      <div
        className={clsx("px-8 py-16 rounded-2xl relative z-20", {
          "bg-gray-200": Component,
          "bg-yellow-200": !Component,
        })}
      >
        {!Component && <p className="font-semibold text-center">Implement me!</p>}
        {Component && (
          <>
            <div>
              <Component {...context.models} />
            </div>
            {!readOnly && (
              <>
                <div className="absolute left-0 w-full px-4 text-gray-500 bottom-4 flex justify-between">
                  <div>
                    <Button className="mr-1" onClick={context.actions.toggle}>
                      {isPlaying ? (
                        <BsPauseFill />
                      ) : state.__done ? (
                        <span className="text-sm">
                          <FaUndo />
                        </span>
                      ) : (
                        <BsPlayFill />
                      )}
                    </Button>
                    {controls && (
                      <>
                        <Button className="mr-1" onClick={context.actions.prev}>
                          <HiArrowLeft />
                        </Button>
                        <Button className="mr-1" onClick={context.actions.next}>
                          <HiArrowRight />
                        </Button>
                      </>
                    )}
                  </div>
                  {editable && (
                    <Button onClick={toggle}>
                      {showForm ? <HiX /> : <HiPencil />}
                    </Button>
                  )}
                </div>
                <p className="absolute right-5 top-4 text-gray-500">
                  {steps.indexOf(state) + 1} / {steps.length}
                </p>
              </>
            )}
          </>
        )}
      </div>
      {showForm && (
        <InputForm
          inputs={params.map((name, index) => [name, inputs[index]])}
          onSubmit={(inputs) =>
            context.actions.setInputs(inputs.map((entry) => entry[1]))
          }
          className="z-10"
          variants={{
            show: {
              y: 0,
              opacity: 1,
            },
            hide: {
              y: "-100%",
              opacity: 0,
            },
          }}
          initial="hide"
          animate="show"
        />
      )}
      {caption && <p className="text-center text-sm mt-4">{caption}</p>}
    </div>
  );
}

function Button({ className, ...props }) {
  return (
    <button
      className={clsx(
        "shadow-md rounded-lg bg-gray-100 w-8 h-8 flex items-center justify-center font-semibold text-gray-500",
        className
      )}
      {...props}
    />
  );
}

function InputForm({ inputs, onSubmit, className, ...props }) {
  const [errors, setErrors] = React.useState({});

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const entries = [...new FormData(evt.target).entries()];
    if (entries.every(validate)) {
      onSubmit(entries.map(([name, value]) => [name, JSON.parse(value)]));
    }
  };

  const validate = ([name, value]) => {
    try {
      JSON.parse(value);
      setErrors({ ...errors, [name]: null });
      return true;
    } catch (err) {
      setErrors({ ...errors, [name]: `Please enter a serializable value.` });
      return false;
    }
  };

  return (
    <motion.form
      className={clsx("flex w-3/4 mx-auto mt-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      {inputs.map(([name, value]) => (
        <label key={name} className="font-mono flex-1 mx-1">
          <input
            name={name}
            className="w-full p-2 rounded-lg border-2"
            type="text"
            defaultValue={JSON.stringify(value)}
            onBlur={(evt) => validate([name, evt.target.value])}
          />
          <span className="block">{name}</span>
          {errors[name] && <p>{errors[name]}</p>}
        </label>
      ))}
      <button type="submit"></button>
    </motion.form>
  );
}

const getCodeText = (children) => children.props.children.props.children;
