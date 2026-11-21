type IconProps = {
  type: "reset" | "play" | "pause";
  size?: number;
};

export function Icon({ type, size = 20 }: IconProps) {
  switch (type) {
    case "reset":
      return (
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19.2617 20.25V16.25H15.2617" />
          <path d="M4.75 3.75V7.75H8.75" />
          <path d="M3.81383 10.9688C3.7717 11.3066 3.75 11.6508 3.75 12C3.75 16.5563 7.44365 20.25 12 20.25C14.6766 20.25 17.1111 18.9754 18.6322 17" />
          <path d="M20.186 13.0312C20.2281 12.6934 20.2498 12.3492 20.2498 12C20.2498 7.44365 16.5562 3.75 11.9998 3.75C9.32326 3.75 6.88871 5.02463 5.36768 7" />
        </svg>
      );
    case "play":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 5.5C7 4.73 7.83 4.25 8.5 4.63L18.5 10.63C19.17 11.02 19.17 11.98 18.5 12.37L8.5 18.37C7.83 18.75 7 18.27 7 17.5V5.5Z" />
        </svg>
      );
    case "pause":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      );
  }
}
