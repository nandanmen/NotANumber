import { useStateContext } from "./state-context";

export const PathEditor = ({ id, placeholder = "" }) => {
  const { data, set } =
    useStateContext<Record<string, { value: string } | undefined>>()(id);
  const value = data?.value || "";
  return (
    <div className="relative flex">
      <span className="absolute top-2 right-2 text-gray10">
        <EditIcon />
      </span>
      <textarea
        className="w-full border-gray8 border rounded-md bg-gray3 h-[200px] font-mono px-4 py-3 outline-none outline-[3px] focus-visible:outline-gray10"
        placeholder={placeholder}
        value={value}
        onChange={(e) => set({ value: e.target.value })}
      />
    </div>
  );
};

const EditIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    >
      <path d="M4.75 19.25L9 18.25L18.2929 8.95711C18.6834 8.56658 18.6834 7.93342 18.2929 7.54289L16.4571 5.70711C16.0666 5.31658 15.4334 5.31658 15.0429 5.70711L5.75 15L4.75 19.25Z" />
      <path d="M19.25 19.25H13.75" />
    </svg>
  );
};
