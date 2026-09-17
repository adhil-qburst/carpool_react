type ArrowsRightLeftIconProps = {
  className?: string;
};

export default function ArrowsRightLeftIcon({
  className = "h-4 w-4",
}: ArrowsRightLeftIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 16l-4-4 4-4" />
      <path d="M3 12h14" />
      <path d="M17 8l4 4-4 4" />
      <path d="M21 12H7" />
    </svg>
  );
}
