import React from "react";
import { CgSpinner } from "react-icons/cg";
import { FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import { styled } from "~/stitches.config";
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

const submitButtonTypeMap = {
  [FormState.Start]: undefined,
  [FormState.Loading]: "loading",
  [FormState.Done]: "success",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useSubscribe = () => {
  const [state, dispatch] = React.useReducer(transition, FormState.Start);

  const handleSubmit = async (email?: string) => {
    dispatch(FormEvent.Submit);
    console.log(`submitting: ${email}`);
    await sleep(1000);
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
      <InputGroup>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="john@doe.com"
          onChange={() => dispatch(FormEvent.Change)}
        />
        <SubmitButton
          as={motion.button}
          center="all"
          whileHover={{ scale: 0.95 }}
          whileTap={{ scale: 0.9 }}
          disabled={state === FormState.Loading}
          type={submitButtonTypeMap[state]}
        >
          {state === FormState.Start && (
            <Row center="all">
              <FaPaperPlane />
            </Row>
          )}
          {state === FormState.Loading && (
            <Row
              center="all"
              as={motion.span}
              animate={{ rotate: 360 }}
              transition={{
                type: "tween",
                duration: 1,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              <CgSpinner />
            </Row>
          )}
          {state === FormState.Done && "🎉"}
        </SubmitButton>
      </InputGroup>
      {state === FormState.Done && (
        <SuccessText>
          Thanks! Check your inbox — we sent you a confirmation email.
        </SuccessText>
      )}
    </form>
  );
}

const SuccessText = styled("p", {
  marginTop: "$2",
  fontFamily: "$mono",
  fontSize: "$sm",
});

const InputGroup = styled("div", {
  border: "1px solid $gray8",
  borderRadius: 4,
  display: "flex",
  background: "$gray1",
  overflow: "hidden",
  alignItems: "center",
  paddingRight: 7,
});

const Label = styled("label", {
  display: "none",
  padding: "$4",
  borderRight: "1px solid $gray8",
  color: "$gray11",
  background: "$gray4",

  "@md": {
    display: "block",
  },
});

const SubmitButton = styled(Row, {
  background: "$blue8",
  width: "$10",
  height: "$10",
  flexShrink: 0,
  borderRadius: 4,

  variants: {
    type: {
      success: {
        background: "$green7",
      },
      loading: {
        background: "$gray4",
      },
    },
  },
});

const Input = styled("input", {
  flexGrow: 1,
  background: "$gray1",
  padding: "$4",
});

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
