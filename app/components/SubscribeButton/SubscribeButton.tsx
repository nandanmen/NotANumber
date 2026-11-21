import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "~/lib/cn";
import { FaPaperPlane, FaTimes } from "react-icons/fa";

import { PrimaryButton } from "../PrimaryButton";
import { FormEvent, FormState, useSubscribe } from "../SubscribeInput";
import { CgSpinner } from "react-icons/cg";
import { motion } from "framer-motion";

export const SubscribeButton = ({ small = false }) => {
  const [subscribe, { state, dispatch }] = useSubscribe();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    const target = evt.target as HTMLFormElement;
    subscribe(target.email.value);
  };

  const success = state === FormState.Done;

  return (
    <Dialog.Root onOpenChange={() => dispatch(FormEvent.Change)}>
      <Dialog.Trigger asChild>
        <PrimaryButton small={small}>Subscribe</PrimaryButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[rgba(0,0,0,0.2)] backdrop-blur-[4px]" />
        <Dialog.Content className="fixed top-[15%] left-1/2 w-[min(420px,calc(100vw-2*--spacing(8)))] -translate-x-1/2 md:top-[20%]">
          <motion.article
            className="relative rounded-xl border border-gray12 bg-[linear-gradient(-45deg,var(--color-green6),var(--color-green4))] p-(--padding) shadow-[2px_2px_0_var(--color-gray12)] [--padding:--spacing(10)] md:[--padding:--spacing(12)] dark:border-gray1 dark:bg-[linear-gradient(-45deg,var(--color-green9),var(--color-green6))] dark:text-gray1 dark:shadow-[2px_2px_0_var(--color-gray1)]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="absolute -top-5 -right-5 flex h-10 w-10 items-center justify-center rounded-full border border-gray12 bg-gray3 dark:border-gray1 dark:bg-gray2 dark:text-gray12"
              >
                <FaTimes />
              </button>
            </Dialog.Close>
            <Dialog.Title className="mb-10 font-serif text-[2.5rem] leading-[1.1]">
              Get new content sent straight to your inbox.
            </Dialog.Title>
            <p className={textClassName}>
              Be the first to know when a new blog post is released. I'll also
              send occasional updates on cool things I'm working on!
            </p>
            <p className={textClassName}>Unsubscribe anytime.</p>
            <form className="flex gap-6" onSubmit={handleSubmit}>
              <label htmlFor="subscribe-email" hidden>
                Email
              </label>
              <input
                id="subscribe-email"
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full border-b border-gray12 py-2 dark:border-gray1 dark:text-gray1 dark:placeholder:text-green11"
                disabled={state === FormState.Loading}
                onChange={() => dispatch(FormEvent.Change)}
              />
              <PrimaryButton
                className={cn(
                  "flex h-full w-10 items-center justify-center border-none p-0 pt-0 hover:border hover:border-solid hover:border-gray12",
                  success &&
                    "bg-[linear-gradient(-45deg,var(--color-green8),var(--color-green6))]",
                )}
                disabled={state === FormState.Loading}
              >
                {state === FormState.Start && <FaPaperPlane />}
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
                {success && "🎉"}
              </PrimaryButton>
            </form>
            {success && (
              <motion.p
                className="absolute right-(--padding) left-(--padding) mt-6 rounded-md border border-gray12 bg-green3 p-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
              >
                Thanks! Check your inbox—we sent you a confirmation email.
              </motion.p>
            )}
          </motion.article>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const textClassName = "leading-[1.7] [&:not(:last-child)]:mb-4";
