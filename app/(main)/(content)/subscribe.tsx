"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/cn";
import { motion } from "motion/react";
import { Popover } from "./popover";
import IsEmail from "isemail";
import { subscribe } from "app/(main)/subscribe";

export function Subscribe() {
  const [isOpen, setIsOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".subscribe-form")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

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

  return (
    <Popover
      open={isOpen && (success || error !== null)}
      content={
        <p>
          {error ||
            "Thanks for subscribing! Check your inbox for a confirmation email."}
        </p>
      }
    >
      <motion.form
        className={cn(
          "bg-gray12 text-gray1 rounded-full subscribe-form h-8 overflow-hidden ring-green9 ring-offset-2 ring-offset-gray4",
          isOpen && "focus-within:ring-2",
        )}
        animate={{ width: isOpen ? "210px" : "89px" }}
        initial={{ width: "89px" }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 18,
          mass: 0.3,
        }}
        onSubmit={handleSubmit}
      >
        <div className="flex h-full w-[210px]">
          <input
            ref={inputRef}
            className={cn(
              "bg-transparent h-full flex items-center pl-4 text-sm placeholder:text-gray9 grow focus-visible:outline-none",
              !isOpen && "hidden",
            )}
            type="email"
            name="email"
            placeholder="nanda@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            onBlur={() => {
              if (email && !IsEmail.validate(email)) {
                setError("Please enter a valid email address.");
              }
            }}
          />
          <button
            className={cn(
              "font-medium text-sm h-full flex items-center px-3 bg-gray12 text-gray1 rounded-full",
              isOpen && "hidden",
            )}
            type="button"
            onClick={() => {
              setEmail("");
              setError(null);
              setLoading(false);
              setSuccess(false);
              setIsOpen(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 100);
            }}
          >
            Subscribe
          </button>
          {isOpen && (
            <button
              className="font-medium text-sm h-full flex items-center px-3 bg-gray12 text-gray1 rounded-full"
              type="submit"
              key="form-submit"
            >
              <span className="sr-only">Subscribe</span>

              {loading ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  width="16"
                  aria-hidden="true"
                  className="animate-spin block -mr-0.5"
                >
                  <path
                    d="M20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12Z"
                    stroke="currentColor"
                    strokeOpacity="0.3"
                    strokeWidth="3"
                  />
                  <path
                    d="M20.3681 13.5C19.7463 16.9921 16.9921 19.7463 13.5 20.3681"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  fill="none"
                  aria-hidden="true"
                  className="block -mr-0.5"
                >
                  <path
                    d="M2.80255 5.57199C2.2424 3.89155 3.98199 2.36617 5.57485 3.14107L20.0884 10.2017C21.5885 10.9315 21.5885 13.0689 20.0884 13.7987L5.57485 20.8593C3.98199 21.6342 2.24241 20.1088 2.80255 18.4284L4.61202 13H8.9994C9.55168 13 9.9994 12.5523 9.9994 12C9.9994 11.4477 9.55168 11 8.9994 11H4.61189L2.80255 5.57199Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </motion.form>
    </Popover>
  );
}
