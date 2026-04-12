import { cn } from "~/lib/cn";

type ToolbarProps = {
  /**
   * Indicates which button to highlight. When state === editing, assume mode is inspect.
   */
  activeTool: "add" | "inspect" | null;
  onClick: (tool: "add" | "inspect") => void;
};

export function Toolbar({ activeTool, onClick }: ToolbarProps) {
  return (
    <div
      data-prototyper
      className="fixed bottom-4 right-4 rounded-xl ring-1 ring-black/15 dark:ring-neutral-800 bg-white p-1.5 shadow-2xl flex gap-0.5"
    >
      <button
        type="button"
        onClick={() => onClick("inspect")}
        className={cn(
          "size-10 flex items-center justify-center rounded-lg",
          activeTool === "inspect" ? "bg-gray6" : "hover:bg-gray3",
        )}
        title="Toggle inspect mode (I)"
      >
        <span className="sr-only">Inspect</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          width="20"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.16146 3L11 3C11.5523 3 12 3.44772 12 4C12 4.55228 11.5523 5 11 5H7.2C6.62345 5 6.25117 5.00078 5.96784 5.02393C5.69617 5.04612 5.59546 5.0838 5.54601 5.10899C5.35785 5.20487 5.20487 5.35785 5.109 5.54601C5.0838 5.59545 5.04612 5.69617 5.02393 5.96784C5.00078 6.25117 5 6.62345 5 7.2V16.8C5 17.3766 5.00078 17.7488 5.02393 18.0322C5.04612 18.3038 5.0838 18.4045 5.109 18.454C5.20487 18.6422 5.35785 18.7951 5.54601 18.891C5.59546 18.9162 5.69617 18.9539 5.96784 18.9761C6.25117 18.9992 6.62345 19 7.2 19H16.8C17.3766 19 17.7488 18.9992 18.0322 18.9761C18.3038 18.9539 18.4045 18.9162 18.454 18.891C18.6422 18.7951 18.7951 18.6422 18.891 18.454C18.9162 18.4045 18.9539 18.3038 18.9761 18.0322C18.9992 17.7488 19 17.3766 19 16.8V13C19 12.4477 19.4477 12 20 12C20.5523 12 21 12.4477 21 13V16.8386C21 17.3657 21 17.8205 20.9694 18.195C20.9371 18.5904 20.8658 18.9836 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.9836 20.8658 18.5904 20.9371 18.195 20.9694C17.8205 21 17.3657 21 16.8386 21H7.16144C6.6343 21 6.17954 21 5.80497 20.9694C5.40963 20.9371 5.01641 20.8658 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3.13419 18.9836 3.06287 18.5904 3.03057 18.195C2.99997 17.8205 2.99998 17.3657 3 16.8385V7.16146C2.99998 6.63431 2.99997 6.17954 3.03057 5.80497C3.06287 5.40963 3.13419 5.01641 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.01641 3.13419 5.40963 3.06287 5.80497 3.03057C6.17955 2.99997 6.63431 2.99998 7.16146 3Z"
            fill="currentColor"
          />
          <path
            d="M20.8713 2.9568C19.6997 1.78523 17.8003 1.78523 16.6287 2.9568L8.58579 10.9997C8.21072 11.3748 8 11.8835 8 12.4139V14.9997C8 15.552 8.44772 15.9997 9 15.9997H11.5858C12.1162 15.9997 12.6249 15.789 13 15.4139L21.0429 7.37102C22.2145 6.19944 22.2145 4.29995 21.0429 3.12838L20.8713 2.9568Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <button
        type="button"
        className={cn(
          "size-10 flex items-center justify-center disabled:text-gray9",
          activeTool === "add" && "bg-gray6 rounded-lg",
        )}
        disabled
        title="Toggle add mode (A)"
      >
        <span className="sr-only">Add</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          width="20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 5C2 3.34315 3.34315 2 5 2H15C16.6569 2 18 3.34315 18 5V6H19C20.6569 6 22 7.34315 22 9V19C22 20.6569 20.6569 22 19 22H9C7.34315 22 6 20.6569 6 19V18H5C3.34315 18 2 16.6569 2 15V5ZM16 6H9C7.34315 6 6 7.34315 6 9V16H5C4.44772 16 4 15.5523 4 15V5C4 4.44772 4.44772 4 5 4H15C15.5523 4 16 4.44772 16 5V6ZM15 11C15 10.4477 14.5523 10 14 10C13.4477 10 13 10.4477 13 11V13H11C10.4477 13 10 13.4477 10 14C10 14.5523 10.4477 15 11 15H13V17C13 17.5523 13.4477 18 14 18C14.5523 18 15 17.5523 15 17V15H17C17.5523 15 18 14.5523 18 14C18 13.4477 17.5523 13 17 13H15V11Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}
