import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ResultModal from "@/features/land/components/ResultModal";
import RecruitmentInfoModal from "@/features/land/components/RecruitmentInfoModal";
import { applicantService } from "@/services/api";
import type { ApplicantPassResponseDto } from "@/services/types";

export default function Hero() {
  const { user, logout } = useAuth();
  const [showRecruitmentModal, setShowRecruitmentModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passStatus, setPassStatus] = useState<ApplicantPassResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleCheckResult = async () => {
    setIsModalOpen(true);
    setIsLoading(true);
    try {
      const status = await applicantService.getMyStatus();
      setPassStatus(status);
    } catch (error) {
      console.error("Failed to fetch applicant status", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isStaff = user?.role === "STAFF" || user?.role === "NEST" || user?.role === "SUPER" || user?.role === "ADMIN";

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#a855f7] text-black">

        {/* ── 헤더 ── */}
        <header className="flex items-center justify-between border-b border-black/15 shrink-0">
          <a href="/" className="flex items-center gap-3 px-5 md:px-6 py-4">
            <img src="/logo.png" alt="SOLUTIO" className="h-8 w-auto" />
            <span className="hidden md:inline text-lg font-extrabold tracking-tight text-black">
              SOLUTIO NEST
            </span>
          </a>

          <div className="flex items-center">
            {["연혁", "스터디", "대회"].map((label) => (
              <a
                key={label}
                className="w-16 md:w-20 py-4 text-[13px] font-semibold text-black/60 hover:text-black border-l border-black/15 hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer text-center"
                onClick={(e) => { e.preventDefault(); alert("아직 개발중입니다."); }}
              >
                {label}
              </a>
            ))}
            {isStaff && (
              <a href="/admin/applications" className="w-20 py-4 text-[13px] font-semibold text-black/60 hover:text-black border-l border-black/15 hover:bg-black/5 active:bg-black/10 transition-colors text-center">
                신청 관리
              </a>
            )}

            {user ? (
              <button onClick={logout} className="px-4 py-4 text-sm font-bold border-l border-black/15 hover:bg-black/5 active:bg-black/10 transition-colors">
                로그아웃
              </button>
            ) : (
              <a href="/login">
                <button className="px-4 py-4 text-sm font-bold border-l border-black/15 hover:bg-black/5 active:bg-black/10 transition-colors">
                  로그인
                </button>
              </a>
            )}

            {!user ? (
              <Link to="/signup" className="px-5 py-4 text-sm font-bold bg-black text-[#a855f7] hover:bg-black/85 transition-colors flex items-center gap-2">
                합류하기
                <span className="text-xs">→</span>
              </Link>
            ) : user?.role === "GUEST" ? (
              <button
                onClick={handleCheckResult}
                className="px-5 py-4 text-sm font-bold bg-black text-[#a855f7] hover:bg-black/85 transition-colors flex items-center gap-2"
              >
                결과 확인
                <span className="text-xs">→</span>
              </button>
            ) : null}
          </div>
        </header>

        {/* ── 데스크탑: 좌우 분할 / 모바일: 세로 스택 ── */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">

          {/* 좌측 (데스크탑) / 상단 (모바일): 타이포 영역 */}
          <div className="lg:w-[38%] lg:border-r border-b lg:border-b-0 border-black/15 flex flex-col justify-between px-5 md:px-10 py-8 md:py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-7xl md:text-8xl lg:text-8xl xl:text-9xl font-black leading-[0.95] tracking-tighter text-black">
                Solutio
              </h1>
              <p className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-black tracking-tighter text-black/70 mt-2">
                KYONGGI UNIV.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 lg:mt-0 space-y-5"
            >
              <p className="text-base md:text-lg font-semibold text-black/70 leading-relaxed">
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
          </div>

          {/* 우측 (데스크탑) / 하단 (모바일): 로고 그리드 */}
          <div className="flex-1 flex flex-col min-h-0">
              {/* 로고 그리드 영역 */}
            <div className="flex-1 relative min-h-[280px] md:min-h-[320px] overflow-hidden">
              {/* 십자 교차점 — 중심 블록 + 4방향 팔 (겹침 없음) */}
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
                  {/* 중심 블록 */}
                  <div className="w-[6px] h-[6px] bg-black/15 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                  {/* 두꺼운 팔 4방향 */}
                  <div className="w-[6px] h-3 bg-black/15 absolute left-1/2 -translate-x-1/2" style={{ bottom: "calc(50% + 3px)" }} />
                  <div className="w-[6px] h-3 bg-black/15 absolute left-1/2 -translate-x-1/2" style={{ top: "calc(50% + 3px)" }} />
                  <div className="h-[6px] w-3 bg-black/15 absolute top-1/2 -translate-y-1/2" style={{ right: "calc(50% + 3px)" }} />
                  <div className="h-[6px] w-3 bg-black/15 absolute top-1/2 -translate-y-1/2" style={{ left: "calc(50% + 3px)" }} />
                  {/* 얇은 확장선 4방향 — 모바일에서 짧게 */}
                  <div className="w-px bg-black/8 absolute left-1/2 -translate-x-1/2 h-8 md:h-[60px]" style={{ bottom: "calc(50% + 15px)" }} />
                  <div className="w-px bg-black/8 absolute left-1/2 -translate-x-1/2 h-8 md:h-[60px]" style={{ top: "calc(50% + 15px)" }} />
                  <div className="h-px bg-black/8 absolute top-1/2 -translate-y-1/2 w-8 md:w-[60px]" style={{ right: "calc(50% + 15px)" }} />
                  <div className="h-px bg-black/8 absolute top-1/2 -translate-y-1/2 w-8 md:w-[60px]" style={{ left: "calc(50% + 15px)" }} />
                </div>
              ))}

              {/* EST. 2025 — 세로, 좌측 상단 셀, 2배 크기 */}
              <span
                className="absolute pointer-events-none text-base md:text-xl font-bold tracking-[0.15em] text-black/20 whitespace-nowrap"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", left: "10px", top: "10px" }}
              >
                EST. 2025
              </span>

              {/* PROBLEM SOLVING — 가로, 중앙 상단 셀 + 영어 설명문 */}
              <div
                className="absolute pointer-events-none"
                style={{ left: "calc(33.333% + 10px)", top: "10px" }}
              >
                <span className="text-[10px] font-bold tracking-[0.25em] text-black/20 whitespace-nowrap block">
                  PROBLEM SOLVING
                </span>
                <div className="mt-2 space-y-[2px]">
                  <p className="text-[8px] text-black/15 whitespace-nowrap">Designing efficient algorithms</p>
                  <p className="text-[8px] text-black/15 whitespace-nowrap">to solve complex challenges</p>
                  <p className="text-[8px] text-black/15 whitespace-nowrap">within time and memory limits</p>
                </div>
              </div>

              {/* ALGORITHM — 가로, 좌측 중앙 셀 좌하단 */}
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

              {/* SOLUTIO — 우하단, 반쯤 잘림 + 그라데이션, Black Ops One */}
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

              {/* 모집일정 — 그리드 위에 덮어씌움 */}
              <AnimatePresence>
                {showRecruitmentModal && (
                  <RecruitmentInfoModal onClose={() => setShowRecruitmentModal(false)} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <ResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        status={passStatus}
        isLoading={isLoading}
      />
    </>
  );
}
