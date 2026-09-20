type RupeeIconProps = {
  className?: string;
};

const RupeeIcon = ({ className = "h-5 w-5" }: RupeeIconProps) => {
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
      <path d="M6 3h12M6 8h12M6 13l7.5 8M6 13h3a4 4 0 0 0 0-8H6" />
    </svg>
  );
};

export default RupeeIcon;
