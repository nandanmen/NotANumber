import clsx from "clsx";
import styles from "./scroll-group.module.css";
import { X } from "../icons";

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
      <div className="h-full bg-gray5 rounded-lg p-5 border border-borderSoft">
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
          <X />
        </div>
        <div className="absolute bottom-0 left-0 -translate-x-2.5 translate-y-2.5">
          <X />
        </div>
      </div>
    </div>
  );
}
