export type FieldIconType = "person" | "mail" | "lock" | "car" | "pin";

const PATHS: Record<FieldIconType, string> = {
  person:
    "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0",
  mail: "M3 6.75h18v10.5H3zM3.5 7.25 12 13l8.5-5.75",
  lock: "M7.5 10.5V7.5a4.5 4.5 0 0 1 9 0v3M5.25 10.5h13.5v9.75H5.25z",
  car: "M4.5 16.5v2.25M19.5 16.5v2.25M3 16.5h18v-4.2l-1.8-4.05A1.5 1.5 0 0 0 17.83 7.5H6.17a1.5 1.5 0 0 0-1.37.75L3 12.3zM6.75 13.5h.01M17.25 13.5h.01",
  pin: "M12 21s6.75-5.25 6.75-10.5a6.75 6.75 0 0 0-13.5 0C5.25 15.75 12 21 12 21ZM12 12.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z",
};

type FieldIconProps = {
  type: FieldIconType;
  className?: string;
};

export default function FieldIcon({
  type,
  className = "h-5 w-5",
}: FieldIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[type]} />
    </svg>
  );
}
