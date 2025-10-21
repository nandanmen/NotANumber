"use client";

import React from "react";
import IsEmail from "isemail";
import clsx from "clsx";
import { motion } from "framer-motion";

export function SubscribeButton() {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!isOpen) {
    return (
      <button
        className="text-sm font-medium rounded-lg bg-gray12 text-gray1 px-2 py-1.5 w-fit"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Subscribe
      </button>
    );
  }
  return <SubscribeForm onCancel={() => setIsOpen(false)} />;
}

export const subscribe = async (email: string) => {
  const isValidEmail = IsEmail.validate(email);
  if (!isValidEmail) {
    return { error: "Please enter a valid email address" };
  }
  const response = await fetch(
    `/api/subscribe?email=${encodeURIComponent(email)}`,
    {
      method: "POST",
    },
  );
  if (!response.ok) {
    const body = await response.json();
    if (body.code === "email_already_exists" || body.code === "loops_error") {
      return {
        error:
          "You're already subscribed to the waitlist! Check your inbox for a confirmation email.",
      };
    }
    return { error: "Something went wrong. Please try again." };
  }
  return { success: true };
};

function SubscribeForm({ onCancel }: { onCancel: () => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [email, setEmail] = React.useState("");

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await subscribe(email);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
  };

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <form
        className="p-3 pl-4 pb-4 bg-gray5 border border-gray8 rounded-xl shadow-inner flex flex-col gap-3 relative"
        onSubmit={handleSubmit}
        onChange={() => setError(null)}
      >
        <label className="flex flex-col">
          <span className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray11">Email</span>
            <button type="button" onClick={onCancel}>
              <span className="sr-only">Cancel</span>
              <svg
                width="24"
                height="24"
                fill="none"
                className="text-gray10"
                viewBox="0 0 24 24"
                aria-hidden="true"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              >
                <path d="M17.25 6.75L6.75 17.25" />
                <path d="M6.75 6.75L17.25 17.25" />
              </svg>
            </button>
          </span>
          <input
            name="email"
            className="bg-transparent border-b py-1 focus-visible:outline-none focus-visible:border-blue9 border-gray12/25"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ref={inputRef}
            autoComplete="off"
          />
        </label>
        <button
          type="submit"
          className={clsx(
            "text-sm flex items-center gap-1 font-medium rounded-lg px-2 py-1.5 w-fit",
            loading && "opacity-30",
            success ? "bg-gray7 text-gray10" : "bg-gray12 text-gray1",
          )}
        >
          <span>{success ? "Subscribed" : "Subscribe"}</span>
          {loading && (
            <span className="animate-spin block">
              <svg
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 4.75V6.25" />
                <path d="M17.1266 6.87347L16.0659 7.93413" />
                <path d="M19.25 12L17.75 12" />
                <path d="M17.1266 17.1265L16.0659 16.0659" />
                <path d="M12 17.75V19.25" />
                <path d="M7.9342 16.0659L6.87354 17.1265" />
                <path d="M6.25 12L4.75 12" />
                <path d="M7.9342 7.93413L6.87354 6.87347" />
              </svg>
            </span>
          )}
          {success && (
            <span>
              <svg
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                  d="M7.75 12.75L10 15.25L16.25 8.75"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </button>
      </form>
      {success && (
        <p className="text-sm text-gray11 bg-gray3 p-4 border border-gray8 rounded-xl -mt-6 pt-10">
          Thanks for subscribing! Check your inbox for a confirmation email.
        </p>
      )}
      {error && (
        <p className="text-sm text-red11 bg-red5 p-4 border border-red8 rounded-xl -mt-6 pt-10">
          {error}
        </p>
      )}
    </div>
  );
}
