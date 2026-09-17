type CarPoolLogoProps = {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
};

export default function CarPoolLogo({
  className = "flex items-center gap-2.5",
  iconClassName = "h-8 w-8 text-[#0f5132]",
  showText = true,
}: CarPoolLogoProps) {
  return (
    <div className={className}>
      <svg
        className={iconClassName}
        viewBox="0 0 36 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Car body */}
        <path
          d="M6 18.5C6 17.1193 7.11929 16 8.5 16H27.5C28.8807 16 30 17.1193 30 18.5V23C30 23.5523 29.5523 24 29 24H27V25C27 25.5523 26.5523 26 26 26H24C23.4477 26 23 25.5523 23 25V24H13V25C13 25.5523 12.5523 26 12 26H10C9.44772 26 9 25.5523 9 25V24H7C6.44772 24 6 23.5523 6 23V18.5Z"
          fill="currentColor"
        />
        {/* Roof / cabin */}
        <path
          d="M9.8 15.5L12.3 8.8C12.7 7.7 13.7 7 14.9 7H21.1C22.3 7 23.3 7.7 23.7 8.8L26.2 15.5H9.8Z"
          fill="currentColor"
        />
        {/* Windshield cutout */}
        <path
          d="M13.2 14.5L14.7 9.8C14.8 9.4 15.2 9.1 15.6 9.1H20.4C20.8 9.1 21.2 9.4 21.3 9.8L22.8 14.5H13.2Z"
          fill="white"
        />
        {/* Headlights */}
        <circle cx="9.5" cy="19.5" r="1.5" fill="white" />
        <circle cx="26.5" cy="19.5" r="1.5" fill="white" />
        {/* Grille line */}
        <rect x="14" y="20.5" width="8" height="1.5" rx="0.75" fill="white" />
        {/* Wheels */}
        <circle cx="11" cy="24.5" r="2.5" fill="#1e293b" />
        <circle cx="11" cy="24.5" r="1" fill="white" />
        <circle cx="25" cy="24.5" r="2.5" fill="#1e293b" />
        <circle cx="25" cy="24.5" r="1" fill="white" />
      </svg>
      {showText && (
        <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Car<span className="text-[#0f5132]">Pool</span>
        </span>
      )}
    </div>
  );
}
