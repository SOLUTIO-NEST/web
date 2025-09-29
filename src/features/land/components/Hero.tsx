import Button from "@/components/ui/Button";
import GraphBackground from "@/features/land/components/GraphBackground";
import { InlineMath } from "react-katex";
export default function Hero() {
  return (
    <section className="relative h-[calc(100dvh-64px)] overflow-hidden bg-gradient-to-b from-white to-neutral-50">
      {/* 🔹 배경 그래프 */}
      <GraphBackground />

      {/* 🔹 내용은 그래프 위로 올리기 */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-3 md:px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            O(<InlineMath math="n^n" />)같은 인생,<br className="hidden md:block" />
            O(<InlineMath math="1" />)로 바꿔보자
        </h1>
        <div className="mt-8 flex gap-3">
          <Button variant="brand" size="lg">Get Started</Button>
          <Button variant="brandSoft" size="lg">Learn more</Button>
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-8">
        <p className="text-sm md:text-base font-semibold text-neutral-900/80">
          경기대학교 알고리즘 동아리 <span className="font-extrabold">SOLUTIO</span>
        </p>
      </div>
    </section>
  );
}
