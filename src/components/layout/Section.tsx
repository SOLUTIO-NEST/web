import type { HTMLAttributes } from "react";

export default function Section(props: HTMLAttributes<HTMLElement>) {
  const { className = "", ...rest } = props;
  return <section className={`py-16 md:py-24 ${className}`} {...rest} />;
}
