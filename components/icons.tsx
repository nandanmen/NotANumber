export const X = ({ width = 20, strokeWidth = 3 }) => {
    return (
        <svg
            width={width}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
        >
            <path d="M17.25 6.75L6.75 17.25" />
            <path d="M6.75 6.75L17.25 17.25" />
        </svg>
    );
};
