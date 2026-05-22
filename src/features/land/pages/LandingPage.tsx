import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/features/land/components/Hero";
import Sections from "@/features/land/components/Sections";

const TOC = [
  { id: "section-about", num: "01", label: "Solutio에 대해" },
  { id: "section-activities", num: "02", label: "주요 활동" },
  { id: "section-join", num: "03", label: "가입 방법" },
];

export default function LandingPage() {
  const [active, setActive] = useState(-1);
  const [pastHero, setPastHero] = useState(false);
  const [showRecruitmentModal, setShowRecruitmentModal] = useState(false);
  const heroGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 히어로 그리드를 지났는지 감지
    const heroObs = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    const heroEl = document.getElementById("hero-grid");
    if (heroEl) heroObs.observe(heroEl);

    // 섹션 활성 상태 감지
    const sectionObs: IntersectionObserver[] = [];
    TOC.forEach((item, i) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(i); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      sectionObs.push(obs);
    });

    return () => {
      heroObs.disconnect();
      sectionObs.forEach((o) => o.disconnect());
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="lg:overflow-x-clip relative">
      {/* ── 데스크탑 좌측 패널 (absolute 래퍼 + sticky) ── */}
      <div className="hidden lg:block absolute left-0 top-0 w-[38%] h-full z-20 pt-14">
        <div className="sticky top-0 h-screen bg-[#a855f7] border-r border-black/15 flex flex-col justify-between px-10 xl:px-14 pt-12 pb-[calc(3rem+3.5rem)]">
          {/* 타이틀 */}
          <div>
            <h1 className="text-8xl xl:text-9xl font-black leading-[0.95] tracking-tighter text-black">
              Solutio
            </h1>
            <p className="text-4xl xl:text-5xl font-black tracking-tighter text-black/70 mt-2">
              KYONGGI UNIV.
            </p>
          </div>

          {/* 하단: 문구/모집일정 ↔ 목차 전환 */}
          <AnimatePresence mode="wait">
            {!pastHero ? (
              <motion.div
                key="tagline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                <p className="text-base xl:text-lg font-semibold text-black/70 leading-relaxed">
                  O(n<sup className="text-[0.7em]">n</sup>) 같은 인생,<br />
                  O(1)로 바꿔보자.
                </p>
                <button
                  onClick={() => setShowRecruitmentModal(true)}
                  className="px-6 py-3 bg-black text-[#a855f7] font-bold text-base hover:bg-black/85 transition-colors flex items-center gap-2"
                >
                  모집일정
                  <span>→</span>
                </button>
              </motion.div>
            ) : (
              <motion.nav
                key="toc"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                {TOC.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="block text-left w-full group transition-all duration-500"
                  >
                    <span
                      className={`block font-black tracking-tighter transition-all duration-500 ${
                        active === i
                          ? "text-5xl xl:text-6xl text-black"
                          : "text-xl text-black/25 group-hover:text-black/50"
                      }`}
                    >
                      {item.num}
                    </span>
                    <span
                      className={`block font-bold transition-all duration-500 mt-1 ${
                        active === i
                          ? "text-sm text-black/70"
                          : "text-xs text-black/20 group-hover:text-black/40"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── 우측 스크롤 콘텐츠 (데스크탑에서 좌측 패널만큼 밀어냄) ── */}
      <div className="lg:ml-[38%]">
        <Hero showRecruitmentModal={showRecruitmentModal} onRecruitmentToggle={setShowRecruitmentModal} />
        {/* 모바일 전용 목차 탭바 — 히어로 지나야 표시 */}
        <AnimatePresence>
          {pastHero && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden sticky top-14 z-10 bg-neutral-50/90 backdrop-blur-sm border-b border-neutral-200"
            >
              <div className="flex">
                {TOC.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`flex-1 py-3 text-center transition-all duration-300 border-b-2 ${
                      active === i
                        ? "border-black text-black font-bold"
                        : "border-transparent text-neutral-400 font-medium"
                    }`}
                  >
                    <span className="text-xs">{item.num}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Sections />
      </div>
    </main>
  );
}
