import type React from "react";

type LinkProps = {
  href?: string;
  children: React.ReactNode;
};

const linkClassName =
  "text-blue9 no-underline hover:underline hover:decoration-wavy hover:decoration-blue8";

export const Link = ({ href, children }: LinkProps) => {
  if (href?.startsWith("http")) {
    return (
      <a className={linkClassName} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <a className={linkClassName} href={href}>
      {children}
    </a>
  );
};
