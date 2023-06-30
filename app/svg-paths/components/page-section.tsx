import React from "react";
import { signIn } from "next-auth/react";
import { clsx } from "clsx";
import { useIndexContext } from "./index-provider";
import styles from "./page-section.module.css";
import { useSession } from "../provider";
import Image from "next/image";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { motion } from "framer-motion";
import useSWR, { useSWRConfig } from "swr";
import { usePathname } from "next/navigation";

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo("en-US");

const isVisible = (element: HTMLElement) => {
  const { top } = element.getBoundingClientRect();
  return top < window.innerHeight / 2;
};

const Spinner = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4.75V6.25"></path>
      <path d="M17.1266 6.87347L16.0659 7.93413"></path>
      <path d="M19.25 12L17.75 12"></path>
      <path d="M17.1266 17.1265L16.0659 16.0659"></path>
      <path d="M12 17.75V19.25"></path>
      <path d="M7.9342 16.0659L6.87354 17.1265"></path>
      <path d="M6.25 12L4.75 12"></path>
      <path d="M7.9342 7.93413L6.87354 6.87347"></path>
    </svg>
  );
};

export function PageSection({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { set } = useIndexContext();

  React.useEffect(() => {
    if (ref.current && isVisible(ref.current)) {
      set(index);
    }
  }, [index, set]);

  React.useEffect(() => {
    const handleScroll = () => {
      if (ref.current && isVisible(ref.current)) {
        set(index);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [index, set]);

  return (
    <section
      ref={ref}
      className={clsx(
        styles.section,
        "group relative px-8 pb-8 max-w-[100vw] lg:px-16",
        "gap-y-6 lg:space-y-[1.5em] lg:min-h-[50vh]",
        "grid grid-cols-[1fr_min(100%,60ch)_1fr] lg:block"
      )}
    >
      <hr className="border-gray8 border-dashed mb-10 lg:mb-16 group-first-of-type:hidden" />
      {children}
      <CommentsList index={index} />
    </section>
  );
}

const useLocation = (index: number) => {
  const path = usePathname();
  const match = path.split("/svg-paths/")[1];
  if (!match) return `index-${index}`;
  return `${match}-${index}`;
};

type Comment = {
  id: string;
  location: string;
  author: {
    username: string;
    picture: string;
  };
  content: string;
  created_at: string;
};

function CommentsList({ index }) {
  const session = useSession();
  const location = useLocation(index);
  const [showComments, setShowComments] = React.useState(false);
  const { data } = useSWR<Comment[]>(
    `/api/comments?location=${encodeURIComponent(location)}`,
    (url) => {
      return fetch(url).then((res) => res.json());
    }
  );
  return (
    <motion.div
      animate={{ opacity: data ? 1 : 0 }}
      initial={{ opacity: 0 }}
      className="relative max-w-[60ch] w-full mx-auto"
    >
      <button
        className="text-sm text-gray11 font-semibold"
        onClick={() => setShowComments(!showComments)}
      >
        Comments {data?.length ? `(${data.length})` : ""}
      </button>
      {showComments && (
        <motion.ul
          className="divide-y divide-gray6 bg-gray3 rounded-md border border-gray8"
          animate={{ scale: 1, opacity: 1 }}
          initial={{ scale: 0.96, opacity: 0 }}
          exit={{ scale: 0.96, opacity: 0 }}
          style={{ originX: 0, originY: 0 }}
          transition={{
            type: "spring",
            bounce: 0,
            duration: 0.15,
          }}
        >
          {data?.map((comment) => {
            return (
              <li
                key={comment.id}
                className={clsx(
                  "p-4 space-y-1",
                  comment.id === "optimistic" && "text-gray10"
                )}
              >
                <header className="flex gap-2 items-center">
                  <div className="w-6 h-6 bg-gray10 rounded-full shrink-0">
                    <Image
                      width="24"
                      height="24"
                      className="rounded-full"
                      src={comment.author.picture}
                      alt={comment.author.username}
                    />
                  </div>
                  <p className="font-bold">{comment.author.username}</p>
                  <p className="text-sm text-gray11">
                    {timeAgo.format(new Date(comment.created_at))}
                  </p>
                  {comment.id === "optimistic" && (
                    <div className="ml-auto animate-spin">
                      <Spinner />
                    </div>
                  )}
                </header>
                <p>{comment.content}</p>
              </li>
            );
          })}
          <li className="p-4 space-y-2">
            {session?.user ? (
              <AddCommentForm user={session.user} location={location} />
            ) : (
              <button
                className="py-1 px-2 bg-gray12 text-gray1 font-semibold text-sm rounded-md"
                onClick={() => signIn("github")}
              >
                Login with GitHub
              </button>
            )}
          </li>
        </motion.ul>
      )}
    </motion.div>
  );
}

function AddCommentForm({ user, location }) {
  const session = useSession();
  const { mutate } = useSWRConfig();
  return (
    <>
      <header className="flex gap-2 items-center">
        <Image
          width="24"
          height="24"
          className="rounded-full shrink-0"
          src={user.image}
          alt={user.username}
        />
        <p className="font-bold">{user.username}</p>
      </header>
      <form
        className="gap-2 flex flex-col items-end"
        onSubmit={async (e) => {
          e.preventDefault();
          const content = e.currentTarget.elements.namedItem(
            "content"
          ) as HTMLTextAreaElement;
          const value = content.value;
          e.currentTarget.reset();
          mutate(
            `/api/comments?location=${encodeURIComponent(location)}`,
            fetch("/api/comments", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ location, content: value }),
            }).then((res) => res.json()),
            {
              optimisticData: (comments: Comment[]) => [
                ...comments,
                {
                  id: "optimistic",
                  location,
                  content: value,
                  created_at: new Date().toISOString(),
                  author: { username: user.username, picture: user.image },
                },
              ],
              rollbackOnError: true,
            }
          );
        }}
      >
        <label className="w-full block">
          <span className="sr-only">Comment</span>
          <textarea
            className="w-full block bg-gray4 border-gray6 border rounded-[4px] p-2 min-h-[100px]"
            placeholder="Add your comment here..."
            name="content"
          />
        </label>
        <button
          type="submit"
          className="text-gray1 bg-gray12 font-semibold text-sm px-2 py-1 rounded-md"
        >
          Add Comment
        </button>
      </form>
    </>
  );
}
