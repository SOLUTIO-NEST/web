import type { ButtonHTMLAttributes } from "react"; // type-only import (verbatimModuleSyntax 대응)

type Variant = "brand" | "brandSoft" | "outline";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center justify-center rounded-xl font-medium transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // 보라색(924ED1)
  brand: "bg-[#924ED1] text-white hover:bg-[#8440c4]",
  // 연보라 배경(F2EDF7) + 보라 글자
  brandSoft: "bg-[#F2EDF7] text-[#924ED1] hover:bg-[#eae3f3]",
  // 테두리형
  outline: "border border-[#924ED1] text-[#924ED1] hover:bg-[#F2EDF7]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4",
  lg: "h-12 px-6 text-lg",
};

export default function Button({
  variant = "brand",
  size = "md",
  className = "",
  ...rest
}: Props) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    />
  );
}
