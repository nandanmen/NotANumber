import React from "react";
import { CgSpinner } from "react-icons/cg";
import { FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import { cn } from "~/lib/cn";
import { Row } from "./layout/Row";

export enum FormEvent {
  Change,
  Submit,
  Saved,
}

export enum FormState {
  Start,
  Loading,
  Done,
}

const machine = {
  [FormState.Start]: {
    [FormEvent.Submit]: FormState.Loading,
  },
  [FormState.Loading]: {
    [FormEvent.Saved]: FormState.Done,
  },
  [FormState.Done]: {
    [FormEvent.Change]: FormState.Start,
  },
};

const transition = (state: FormState, event: FormEvent): FormState => {
  return machine[state][event] ?? state;
};

const submitButtonClassNames = {
  [FormState.Start]: undefined,
  [FormState.Loading]: "bg-gray4",
  [FormState.Done]: "bg-green7",
};

export const useSubscribe = () => {
  const [state, dispatch] = React.useReducer(transition, FormState.Start);

  const handleSubmit = async (email?: string) => {
    dispatch(FormEvent.Submit);
    await subscribe(email);
    dispatch(FormEvent.Saved);
  };

  return [handleSubmit, { state, dispatch }] as const;
};

export function SubscribeInput() {
  const [subscribe, { state, dispatch }] = useSubscribe();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const email = evt.target.email.value;
    return subscribe(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center overflow-hidden rounded-[4px] border border-gray8 bg-gray1 pr-[7px]">
        <label
          htmlFor="email"
          className="hidden border-r border-gray8 bg-gray4 p-4 text-gray11 md:block"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="john@doe.com"
          className="grow bg-gray1 p-4"
          onChange={() => dispatch(FormEvent.Change)}
        />
        <motion.button
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-blue8 dark:bg-blue9 dark:text-gray1",
            submitButtonClassNames[state],
          )}
          whileHover={{ scale: 0.95 }}
          whileTap={{ scale: 0.9 }}
          disabled={state === FormState.Loading}
        >
          {state === FormState.Start && (
            <Row center="all">
              <FaPaperPlane />
            </Row>
          )}
          {state === FormState.Loading && (
            <motion.span
              className="flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{
                type: "tween",
                duration: 1,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              <CgSpinner />
            </motion.span>
          )}
          {state === FormState.Done && "🎉"}
        </motion.button>
      </div>
      {state === FormState.Done && (
        <p className="mt-2 font-mono text-[0.875rem]">
          Thanks! Check your inbox — we sent you a confirmation email.
        </p>
      )}
    </form>
  );
}

function subscribe(email?: string) {
  if (!email) {
    return;
  }
  const params = new URLSearchParams({ email } as Record<string, string>);
  return new Promise((resolve, reject) => {
    window.fetch(`/api/subscribe?${params}`).then((response) => {
      if (response.ok) {
        resolve(response);
      } else {
        reject(response);
      }
    });
  });
}
