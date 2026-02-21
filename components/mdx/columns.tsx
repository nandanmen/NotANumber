import { X } from "../icons";

export function Columns({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-subgrid relative col-span-3 !max-w-full">
      {children}
    </section>
  );
}

export function ColumnRight({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden lg:block col-start-3 row-start-1 border-l border-borderSoft -my-10">
      {children}
    </div>
  );
}
