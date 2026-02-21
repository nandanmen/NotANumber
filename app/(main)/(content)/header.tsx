import type { ReactNode } from "react";

export function Header({
  title,
  description,
}: {
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <header className="mt-24 mb-16">
      <h1 className="text-[52px] md:text-[72px] font-serif leading-[1] text-balance">
        {title}
      </h1>
      <p className="text-gray11">{description}</p>
    </header>
  );
}
