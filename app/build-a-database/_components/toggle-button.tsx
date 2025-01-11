export function ToggleButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-gray3 border border-gray8 flex items-center h-8 px-2.5 rounded-full text-sm font-medium text-gray11 hover:bg-gray4 disabled:opacity-60 disabled:hover:bg-gray3 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

export function ResetButton({
  onClick,
  label = "Reset",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      className="h-8 w-8 rounded-full bg-gray3 flex items-center justify-center border border-gray8 hover:bg-gray4 text-gray11"
      onClick={onClick}
    >
      <span className="sr-only">{label}</span>
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path d="M11.25 4.75L8.75 7L11.25 9.25" />
        <path d="M12.75 19.25L15.25 17L12.75 14.75" />
        <path d="M9.75 7H13.25C16.5637 7 19.25 9.68629 19.25 13V13.25" />
        <path d="M14.25 17H10.75C7.43629 17 4.75 14.3137 4.75 11V10.75" />
      </svg>
    </button>
  );
}
