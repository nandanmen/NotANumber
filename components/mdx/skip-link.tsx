export function SkipLink({
  to,
  label,
  children,
}: { to: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      {children}
      <a
        className="text-sm text-gray11 hover:underline underline-offset-2 flex gap-0.5"
        href={to}
      >
        {label}
        <svg
          width="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="translate-y-1"
        >
          <path
            d="M5 4H14C14.5523 4 15 4.44772 15 5V19M11 16L15 20L19 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}
