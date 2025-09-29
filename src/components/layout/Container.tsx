import type { HTMLAttributes } from "react";

export default function Container(props: HTMLAttributes<HTMLDivElement>) {
  const { className = "", ...rest } = props;
  return (
    <div className={`mx-auto w-full max-w-screen-xl px-4 md:px-6 ${className}`} {...rest} />
  );
}
