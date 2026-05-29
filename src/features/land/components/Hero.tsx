import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecruitmentInfoModal from "@/features/land/components/RecruitmentInfoModal";

interface HeroProps {
  showRecruitmentModal: boolean;
  onRecruitmentToggle: (show: boolean) => void;
}

export default function Hero({ showRecruitmentModal, onRecruitmentToggle }: HeroProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100dvh-3.5rem)] lg:block lg:min-h-0">
      {/* ── 모바일 전용: 타이포 + 모집일정 영역 ── */}
      <div className="lg:hidden bg-[#a855f7] text-black px-5 md:px-10 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-7xl md:text-8xl font-black leading-[0.95] tracking-tighter text-black">
            Solutio
          </h1>
          <p className="text-3xl md:text-4xl font-black tracking-tighter text-black/70 mt-2">
            KYONGGI UNIV.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 space-y-5"
        >
          <p className="text-base md:text-lg font-semibold text-black/70 leading-relaxed">
            O(n<sup className="text-[0.7em]">n</sup>) 같은 인생,<br />
            O(1)로 바꿔보자.
          </p>
          <button
            onClick={() => onRecruitmentToggle(true)}
            className="px-6 py-3 bg-black text-[#a855f7] font-bold text-base hover:bg-black/85 transition-colors flex items-center gap-2"
          >
            모집일정
            <span>→</span>
          </button>
        </motion.div>
      </div>

      {/* ── 로고 그리드 영역 ── */}
      <div id="hero-grid" className="bg-[#a855f7] text-black lg:min-h-[calc(100vh-3.5rem)] relative flex-1 min-h-0 overflow-hidden">
        {/* 십자 교차점 */}
        {[
          { left: "33.333%", top: "28%" },
          { left: "66.666%", top: "28%" },
          { left: "33.333%", top: "64%" },
          { left: "66.666%", top: "64%" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{ left: pos.left, top: pos.top, transform: "translate(-50%, -50%)" }}
          >
            <div className="w-[6px] h-[6px] bg-black/15 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="w-[6px] h-3 bg-black/15 absolute left-1/2 -translate-x-1/2" style={{ bottom: "calc(50% + 3px)" }} />
            <div className="w-[6px] h-3 bg-black/15 absolute left-1/2 -translate-x-1/2" style={{ top: "calc(50% + 3px)" }} />
            <div className="h-[6px] w-3 bg-black/15 absolute top-1/2 -translate-y-1/2" style={{ right: "calc(50% + 3px)" }} />
            <div className="h-[6px] w-3 bg-black/15 absolute top-1/2 -translate-y-1/2" style={{ left: "calc(50% + 3px)" }} />
            <div className="w-px bg-black/8 absolute left-1/2 -translate-x-1/2 h-8 md:h-[60px]" style={{ bottom: "calc(50% + 15px)" }} />
            <div className="w-px bg-black/8 absolute left-1/2 -translate-x-1/2 h-8 md:h-[60px]" style={{ top: "calc(50% + 15px)" }} />
            <div className="h-px bg-black/8 absolute top-1/2 -translate-y-1/2 w-8 md:w-[60px]" style={{ right: "calc(50% + 15px)" }} />
            <div className="h-px bg-black/8 absolute top-1/2 -translate-y-1/2 w-8 md:w-[60px]" style={{ left: "calc(50% + 15px)" }} />
          </div>
        ))}

        {/* EST. 2025 */}
        <span
          className="absolute pointer-events-none text-base md:text-xl font-bold tracking-[0.15em] text-black/20 whitespace-nowrap"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", left: "10px", top: "10px" }}
        >
          EST. 2025
        </span>

        {/* PROBLEM SOLVING */}
        <div className="absolute pointer-events-none" style={{ left: "calc(33.333% + 10px)", top: "10px" }}>
          <span className="text-[10px] font-bold tracking-[0.25em] text-black/20 whitespace-nowrap block">
            PROBLEM SOLVING
          </span>
          <div className="mt-2 space-y-[2px]">
            <p className="text-[8px] text-black/15 whitespace-nowrap">Designing efficient algorithms</p>
            <p className="text-[8px] text-black/15 whitespace-nowrap">to solve complex challenges</p>
            <p className="text-[8px] text-black/15 whitespace-nowrap">within time and memory limits</p>
          </div>
        </div>

        {/* ALGORITHM */}
        <span
          className="absolute pointer-events-none text-[10px] font-bold tracking-[0.25em] text-black/20 whitespace-nowrap"
          style={{ left: "10px", bottom: "calc(36% + 10px)" }}
        >
          ALGORITHM
        </span>

        {/* 로고 — 좌하단 */}
        <div className="absolute left-6 bottom-6 md:left-10 md:bottom-10">
          <motion.img
            src="/solly.svg"
            alt="SOLUTIO"
            draggable={false}
            className="w-40 md:w-48 lg:w-56 h-auto object-contain"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={ready ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        {/* SOLUTIO — 우하단 */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute -right-4 -bottom-6 md:-right-6 md:-bottom-8 text-7xl md:text-8xl lg:text-[120px] select-none pointer-events-none"
          style={{
            fontFamily: "'Black Ops One', cursive",
            background: "linear-gradient(135deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          SOLUTIO
        </motion.span>

        {/* 모집일정 오버레이 */}
        <AnimatePresence>
          {showRecruitmentModal && (
            <RecruitmentInfoModal onClose={() => onRecruitmentToggle(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
