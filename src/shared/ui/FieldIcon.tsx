export type FieldIconType =
  | "person"
  | "mail"
  | "lock"
  | "car"
  | "pin"
  | "tag"
  | "users";

const PATHS: Record<FieldIconType, string> = {
  person:
    "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0",
  mail: "M3 6.75h18v10.5H3zM3.5 7.25 12 13l8.5-5.75",
  lock: "M7.5 10.5V7.5a4.5 4.5 0 0 1 9 0v3M5.25 10.5h13.5v9.75H5.25z",
  car: "M4.5 16.5v2.25M19.5 16.5v2.25M3 16.5h18v-4.2l-1.8-4.05A1.5 1.5 0 0 0 17.83 7.5H6.17a1.5 1.5 0 0 0-1.37.75L3 12.3zM6.75 13.5h.01M17.25 13.5h.01",
  pin: "M12 21s6.75-5.25 6.75-10.5a6.75 6.75 0 0 0-13.5 0C5.25 15.75 12 21 12 21ZM12 12.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z",
  tag: "M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3ZM6 6h.008v.008H6V6Z",
  users:
    "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z",
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
