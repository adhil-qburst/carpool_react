type LeafIconProps = {
  className?: string;
};

export default function LeafIcon({ className = "h-5 w-5" }: LeafIconProps) {
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
      <path d="M11 20A7 7 0 0 1 4 13C4 8.5 7.5 5 12 4c4.5 0 8 3.5 8 8 0 4.5-3.5 8-8 8Z" />
      <path d="M4 13c3.5 0 7 2 8 7" />
      <path d="M12 4c0 4.5 2.5 8 7 8" />
    </svg>
  );
}
