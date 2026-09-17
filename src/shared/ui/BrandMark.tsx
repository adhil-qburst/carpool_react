import CarPoolLogo from "./CarPoolLogo";

type BrandMarkProps = {
  className?: string;
  variant?: "badge" | "car";
};

const BrandMark = ({ className, variant = "badge" }: BrandMarkProps) => {
  if (variant === "car") {
    return <CarPoolLogo className={className} showText={false} />;
  }

  return (
    <div
      className={
        className ??
        "flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-950/25"
      }
    >
      C
    </div>
  );
};

export default BrandMark;
