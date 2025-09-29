import type { HTMLAttributes } from "react";

type Size = "xl" | "2xl" | "wide";
type Pad  = "none" | "sm" | "md" | "lg";

const sizeMap: Record<Size, string> = {
  xl:  "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  wide: "max-w-[1600px]",
};

const padMap: Record<Pad, string> = {
  none: "px-0",
  sm:   "px-3 md:px-4",
  md:   "px-4 md:px-6",
  lg:   "px-6 md:px-8",
};

type Props = HTMLAttributes<HTMLDivElement> & {
  /** true면 최대폭을 해제(가득) */
  fluid?: boolean;
  size?: Size;
  pad?: Pad;
};

export default function Container({
  className = "",
  fluid = false,
  size = "xl",
  pad = "md",
  ...rest
}: Props) {
  const widthClass = fluid ? "max-w-none" : sizeMap[size];
  return (
    <div
      className={`mx-auto w-full ${widthClass} ${padMap[pad]} ${className}`}
      {...rest}
    />
  );
}
