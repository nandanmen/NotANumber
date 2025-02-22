import clsx from "clsx";
import styles from "./scroll-group.module.css";

export function ScrollGroup({ children }: { children: React.ReactNode }) {
  return (
    <section className={clsx(styles.article, "!col-span-2 relative")}>
      {children}
    </section>
  );
}

export function ScrollFigure({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="!col-start-2 row-start-1 absolute bottom-[-40px] top-[-40px] border-l border-borderSoft border-dashed p-5"
      style={{
        width: "calc(100% + 40px)",
      }}
    >
      <div className="h-full bg-gray5 rounded-xl p-5">
        <div
          className="sticky"
          style={{
            // 57px for header + 20px for padding
            top: 77,
          }}
        >
          {children}
        </div>
      </div>
      <div className="text-gray9">
        <div className="absolute top-0 left-0 -translate-x-2.5 -translate-y-2.5">
          <XIcon />
        </div>
        <div className="absolute bottom-0 left-0 -translate-x-2.5 translate-y-2.5">
          <XIcon />
        </div>
      </div>
    </div>
  );
}

const XIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    >
      <path d="M17.25 6.75L6.75 17.25" />
      <path d="M6.75 6.75L17.25 17.25" />
    </svg>
  );
};
