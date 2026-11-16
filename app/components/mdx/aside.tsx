export function Aside({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <details className="full-width rounded-xl bg-gray4 group open:-mx-[var(--content-padding)] open:px-[var(--content-padding)] md:open:mx-0 md:open:px-0 my-5">
      <summary className="p-4 md:p-6 list-none group-open:px-0 group-open:pb-5 group-open:pt-6 md:group-open:py-6 md:group-open:px-6">
        <div className="flex items-center gap-2 w-full max-w-[65ch] mx-auto">
          <svg
            aria-hidden="true"
            width="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="group-open:rotate-45 transition-transform"
          >
            <circle cx="12" cy="12" r="10" className="fill-gray12" />
            <path
              d="M16 11.9999L8 12.0001M12 16V8.00012"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="text-xl font-medium">{label}</h3>
        </div>
      </summary>
      <div className="article-layout article pb-10">{children}</div>
    </details>
  );
}
