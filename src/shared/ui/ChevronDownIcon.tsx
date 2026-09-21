export type ChevronDownIconProps = {
  className?: string;
};

const ChevronDownIcon = ({ className = "h-4 w-4" }: ChevronDownIconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
};

export default ChevronDownIcon;
