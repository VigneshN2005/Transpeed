import Link from "next/link";

// Real Transpeed logo mark (public/images/logo/transpeed-logo.png), supplied
// by the client and background-removed for use here. Replaces the earlier
// in-code SVG placeholder (a plain red square + white arrow) that stood in
// while no logo graphic was on hand.
export default function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  const textColor = variant === "dark" ? "text-white" : "text-brand-dark";

  return (
    <Link href="/" className="flex items-center gap-3">
      <span
        className={
          variant === "dark"
            ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white p-2"
            : "flex h-12 w-12 shrink-0 items-center justify-center"
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo/transpeed-logo.png"
          alt="Transpeed Logistics"
          className="h-full w-full object-contain"
        />
      </span>
      <span className={`flex flex-col leading-none ${textColor}`}>
        <span className="text-2xl font-bold tracking-tight">TRANSPEED</span>
        <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.1em] text-brand">
          Logistics Private Limited
        </span>
      </span>
    </Link>
  );
}
