import React from "react";
import { signIn } from "next-auth/react";
import { clsx } from "clsx";
import { useIndexContext } from "./index-provider";
import styles from "./page-section.module.css";
import { useSession } from "../provider";
import Image from "next/image";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

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
    <section className="first-of-type:-mt-16 group first-of-type:pt-16 relative px-8 pb-8 max-w-[100vw] lg:px-16 flex flex-col">
      <div
        ref={ref}
        className={clsx(
          styles.section,
          "gap-y-6 lg:space-y-[1.5em] lg:min-h-[50vh]",
          "grid grid-cols-[1fr_min(100%,60ch)_1fr] lg:block mb-16"
        )}
      >
        <hr className="border-gray8 border-dashed mb-10 lg:mb-16 group-first-of-type:hidden" />
        {children}
      </div>
      <CommentsList />
    </section>
  );
}

const comments = [
  {
    id: "1",
    author_username: "johndoe",
    author_picture: "https://avatars.githubusercontent.com/u/31267630?v=4",
    content: "This is a comment",
    created_at: "2021-10-01T00:00:00.000Z",
  },
  {
    id: "2",
    author_username: "johndoe",
    author_picture: "https://avatars.githubusercontent.com/u/31267630?v=4",
    content: "This is a comment",
    created_at: "2021-10-01T00:00:00.000Z",
  },
];

function CommentsList() {
  const session = useSession();
  const [showComments, setShowComments] = React.useState(false);

  return (
    <div className="relative mt-auto max-w-[60ch] w-full mx-auto">
      <button
        className="text-sm text-gray11 font-semibold"
        onClick={() => setShowComments(!showComments)}
      >
        Comments
      </button>
      {showComments && (
        <ul className="divide-y divide-gray6 bg-gray3 rounded-md border border-gray6">
          {comments.map((comment) => {
            return (
              <li key={comment.id} className="p-4 space-y-1">
                <header className="flex gap-2 items-center">
                  <Image
                    width="24"
                    height="24"
                    className="rounded-full shrink-0"
                    src={comment.author_picture}
                    alt={comment.author_username}
                  />
                  <p className="font-bold">{comment.author_username}</p>
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
        </ul>
      )}
    </div>
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
