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
import useSWR from "swr";
import { usePathname } from "next/navigation";

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo("en-US");

const isVisible = (element: HTMLElement) => {
  const { top } = element.getBoundingClientRect();
  return top < window.innerHeight / 2;
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
    <section className="first-of-type:-mt-16 group first-of-type:pt-16 relative px-8 pb-8 max-w-[100vw] lg:px-16 flex flex-col justify-between gap-16">
      <div
        ref={ref}
        className={clsx(
          styles.section,
          "gap-y-6 lg:space-y-[1.5em] lg:min-h-[50vh]",
          "grid grid-cols-[1fr_min(100%,60ch)_1fr] lg:block"
        )}
      >
        <hr className="border-gray8 border-dashed mb-10 lg:mb-16 group-first-of-type:hidden" />
        {children}
      </div>
      <CommentsList index={index} />
    </section>
  );
}

const useLocation = (index: number) => {
  const path = usePathname();
  const match = path.split("/svg-paths/")[1];
  if (!match) return `index/${index}`;
  return `${match}/${index}`;
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
              <li key={comment.id} className="p-4 space-y-1">
                <header className="flex gap-2 items-center">
                  <Image
                    width="24"
                    height="24"
                    className="rounded-full shrink-0"
                    src={comment.author.picture}
                    alt={comment.author.username}
                  />
                  <p className="font-bold">{comment.author.username}</p>
                  <p className="text-sm text-gray11">
                    {timeAgo.format(new Date(comment.created_at))}
                  </p>
                </header>
                <p>{comment.content}</p>
              </li>
            );
          })}
          <li className="p-4 space-y-2">
            {session?.user ? (
              <AddCommentForm user={session.user} />
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

function AddCommentForm({ user }) {
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
      <form className="gap-2 flex flex-col items-end">
        <textarea
          className="w-full block bg-gray4 border-gray6 border rounded-[4px] p-2 min-h-[100px]"
          placeholder="Add your comment here..."
        />
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
