import { X } from "../icons";

export function Columns({ children }: { children: React.ReactNode }) {
  return (
    <section className="!col-span-3 relative !max-w-full grid lg:grid-cols-2 gap-x-10">
      {children}
    </section>
  );
}

export function ColumnRight({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="!col-start-2 row-start-1 absolute bottom-[-40px] top-[-40px] border-l border-borderSoft border-dashed p-5"
      style={{
        width: "calc(100% + 40px)",
      }}
    >
      {children}
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
