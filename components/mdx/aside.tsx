export function Aside({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <details className="!col-start-1 !col-span-3 !max-w-[initial] -m-4 rounded-xl bg-gray5 group">
      <summary className="p-4 md:p-6 list-none">
        <div className="flex items-center gap-1.5 w-[min(60ch,100%)] lg:w-[min(900px,100%)] mx-auto">
          <svg
            aria-hidden="true"
            width="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="group-open:rotate-45 transition-transform"
            style={{
              transitionDuration: "460.52ms",
              transitionTimingFunction: `linear(
  0 0%,
  0.00935 1%,
  0.034933 2%,
  0.073343 3%,
  0.121559 4%,
  0.176933 5%,
  0.237164 6%,
  0.300282 7.000000000000001%,
  0.364621 8%,
  0.428795 9%,
  0.491674 10%,
  0.552354 11%,
  0.610135 12%,
  0.664498 13%,
  0.715078 14.000000000000002%,
  0.761645 15%,
  0.804085 16%,
  0.842377 17%,
  0.87658 18%,
  0.906817 19%,
  0.933259 20%,
  0.956116 21%,
  0.975624 22%,
  0.992037 23%,
  1.005618 24%,
  1.016636 25%,
  1.025356 26%,
  1.032036 27%,
  1.036926 28.000000000000004%,
  1.040261 28.999999999999996%,
  1.042263 30%,
  1.043137 31%,
  1.043072 32%,
  1.04224 33%,
  1.040793 34%,
  1.038871 35%,
  1.036594 36%,
  1.034067 37%,
  1.031382 38%,
  1.028616 39%,
  1.025833 40%,
  1.023087 41%,
  1.020422 42%,
  1.017869 43%,
  1.015456 44%,
  1.013201 45%,
  1.011116 46%,
  1.009207 47%,
  1.007478 48%,
  1.005927 49%,
  1.00455 50%,
  1.00334 51%,
  1.002289 52%,
  1.001387 53%,
  1.000624 54%,
  0.999987 55.00000000000001%
)`,
            }}
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
          <h3 className="text-xl font-medium">Aside: {label}</h3>
        </div>
      </summary>
      <div className="grid auto-rows-min gap-y-5 grid-cols-[1fr_min(60ch,100%)_1fr] lg:grid-cols-[1fr_min(900px,100%)_1fr] leading-relaxed [&>*]:col-start-2 [&>*]:max-w-[60ch] -mt-1 mb-6 px-4 md:px-6">
        {children}
      </div>
    </details>
  );
}
