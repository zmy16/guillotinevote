export function GuillotineMark({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4v10h20V4" />
      <path d="M9 4v6" />
      <path d="M23 4v6" />
      <path d="M13 9h6l-1 5h-4z" />
      <path d="M8 14v14" />
      <path d="M24 14v14" />
      <path d="M4 28h24" />
      <path d="M10 22h12" />
    </svg>
  );
}
