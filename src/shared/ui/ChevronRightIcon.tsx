export type ChevronRightIconProps = {
  className?: string;
};

const ChevronRightIcon = ({ className = "h-4 w-4" }: ChevronRightIconProps) => {
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
      <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
};

export default ChevronRightIcon;
