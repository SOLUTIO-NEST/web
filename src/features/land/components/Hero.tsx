import GraphBackground from "@/features/land/components/GraphBackground";
import { InlineMath } from "react-katex";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-neutral-50 h-[calc(100svh-80px)] md:h-[calc(100svh-64px-70px)]">
      {/* 🔹 배경 그래프 */}
      <GraphBackground />

      {/* 🔹 메인 콘텐츠 */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-3 md:px-4 space-y-5">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          O(<InlineMath math="n^n" />) 같은 인생,
        </h1>

        <p className="text-lg md:text-2xl font-semibold text-neutral-800 flex items-center gap-2">
          <span className="font-extrabold text-purple-700">SOLUTIO</span>에{" "}
          <Link
            to="/signup"
            className="cursor-pointer px-3 py-1 rounded-lg bg-purple-600 text-white font-bold shadow-md hover:bg-purple-700 transition"
          >
            합류
          </Link>{" "}
          해
        </p>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          O(<InlineMath math="1" />)로 바꿔보자
        </h1>
      </div>

      {/* 🔹 하단 텍스트 */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-8">
        <p className="text-sm md:text-base font-semibold text-neutral-900/80">
          경기대학교 알고리즘 동아리 <span className="font-extrabold">SOLUTIO</span>
        </p>
      </div>
    </section>
  );
}
