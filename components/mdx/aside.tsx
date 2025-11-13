export function Aside({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <details className="!col-start-1 !col-span-3 !max-w-[initial] -m-4 rounded-xl bg-gray5 group">
      <summary className="p-4 md:p-6 list-none">
        <div className="flex items-center gap-2 w-[min(60ch,100%)] lg:w-[min(900px,100%)] mx-auto">
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
      <div className="grid auto-rows-min gap-y-5 grid-cols-[1fr_min(60ch,100%)_1fr] lg:grid-cols-[1fr_min(900px,100%)_1fr] leading-relaxed [&>*]:col-start-2 [&>*]:max-w-[60ch] -mt-1 mb-6 px-4 md:px-6">
        {children}
      </div>
    </details>
  );
}
