import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ResultModal from "@/features/land/components/ResultModal";
import RecruitmentInfoModal from "@/features/land/components/RecruitmentInfoModal";
import { applicantService } from "@/services/api";
import type { ApplicantPassResponseDto } from "@/services/types";

interface HeroProps {
  showRecruitmentModal: boolean;
  onRecruitmentToggle: (show: boolean) => void;
}

export default function Hero({ showRecruitmentModal, onRecruitmentToggle }: HeroProps) {
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
      {/* ── 헤더 ── */}
      <header id="main-header" className="sticky top-0 z-30 bg-[#a855f7] flex items-center justify-between border-b border-black/15 h-14 lg:relative lg:w-[100vw] lg:-ml-[calc(38vw)]">
        {/* 좌측: 로고 */}
        <a href="/" className="flex items-center gap-3 px-4 md:px-6 h-full">
          <img src="/logo.png" alt="SOLUTIO" className="h-7 w-auto object-contain" />
          <span className="hidden md:inline text-lg font-extrabold tracking-tight text-black">
            SOLUTIO NEST
          </span>
        </a>

        {/* 우측: 데스크탑 네비게이션 */}
        <div className="hidden md:flex items-center h-full">
          {["연혁", "스터디", "대회"].map((label) => (
            <a
              key={label}
              className="w-20 h-full flex items-center justify-center text-[13px] font-semibold text-black/60 hover:text-black border-l border-black/15 hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
              onClick={(e) => { e.preventDefault(); alert("아직 개발중입니다."); }}
            >
              {label}
            </a>
          ))}
          {isStaff && (
            <a href="/admin/applications" className="w-20 h-full flex items-center justify-center text-[13px] font-semibold text-black/60 hover:text-black border-l border-black/15 hover:bg-black/5 active:bg-black/10 transition-colors">
              신청 관리
            </a>
          )}
          {user ? (
            <button onClick={logout} className="px-4 h-full text-sm font-bold border-l border-black/15 hover:bg-black/5 active:bg-black/10 transition-colors">
              로그아웃
            </button>
          ) : (
            <a href="/login" className="px-4 h-full flex items-center text-sm font-bold border-l border-black/15 hover:bg-black/5 active:bg-black/10 transition-colors">
              로그인
            </a>
          )}
          {!user ? (
            <Link to="/signup" className="px-5 h-full flex items-center text-sm font-bold bg-black text-[#a855f7] hover:bg-black/85 transition-colors gap-2">
              합류하기 <span className="text-xs">→</span>
            </Link>
          ) : user?.role === "GUEST" ? (
            <button onClick={handleCheckResult} className="px-5 h-full flex items-center text-sm font-bold bg-black text-[#a855f7] hover:bg-black/85 transition-colors gap-2">
              결과 확인 <span className="text-xs">→</span>
            </button>
          ) : null}
        </div>

        {/* 우측: 모바일 — 로그인 + 합류하기 + 햄버거 */}
        <div className="flex md:hidden items-center h-full">
          {user ? (
            <button onClick={logout} className="px-3 h-full text-sm font-bold border-l border-black/15 hover:bg-black/5 transition-colors">
              로그아웃
            </button>
          ) : (
            <a href="/login" className="px-3 h-full flex items-center text-sm font-bold border-l border-black/15 hover:bg-black/5 transition-colors">
              로그인
            </a>
          )}
          {!user ? (
            <Link to="/signup" className="px-4 h-full flex items-center text-sm font-bold bg-black text-[#a855f7] hover:bg-black/85 transition-colors gap-1.5">
              합류하기 <span className="text-xs">→</span>
            </Link>
          ) : user?.role === "GUEST" ? (
            <button onClick={handleCheckResult} className="px-4 h-full flex items-center text-sm font-bold bg-black text-[#a855f7] hover:bg-black/85 transition-colors gap-1.5">
              결과 확인 <span className="text-xs">→</span>
            </button>
          ) : null}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-12 h-full flex items-center justify-center border-l border-black/15 hover:bg-black/5 transition-colors"
          >
            <div className="space-y-1.5">
              <div className="w-5 h-[2px] bg-black/70" />
              <div className="w-5 h-[2px] bg-black/70" />
              <div className="w-5 h-[2px] bg-black/70" />
            </div>
          </button>
        </div>
      </header>

      {/* ── 모바일 메뉴 모달 ── */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowMobileMenu(false)}
              className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-md z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed inset-5 top-20 bottom-auto bg-white z-50 flex flex-col shadow-2xl"
            >
              {/* X 닫기 버튼 */}
              <div className="flex items-center justify-between px-6 pt-5 pb-3">
                <span className="text-xs font-bold tracking-[0.2em] text-neutral-400">MENU</span>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="w-9 h-9 flex items-center justify-center border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-800 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* 메뉴 항목 */}
              {(isStaff
                ? ["연혁", "스터디", "대회", "신청 관리"]
                : ["연혁", "스터디", "대회"]
              ).map((label, idx) => (
                <motion.a
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="block mx-6 py-5 text-lg font-black tracking-tight text-neutral-900 hover:text-neutral-600 border-b border-neutral-100 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMobileMenu(false);
                    if (label === "신청 관리") { window.location.href = "/admin/applications"; }
                    else { alert("아직 개발중입니다."); }
                  }}
                >
                  {label}
                </motion.a>
              ))}

              {/* 하단 여백 */}
              <div className="px-6 py-5">
                <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-300">SOLUTIO NEST</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── 모바일 타이포 + 그리드 래퍼 (뷰포트 채움) ── */}
      <div className="lg:contents flex flex-col min-h-[calc(100dvh-3.5rem)]">

      {/* ── 모바일 전용: 타이포 + 모집일정 영역 ── */}
      <div className="lg:hidden bg-[#a855f7] text-black border-b border-black/15 px-5 md:px-10 py-8">
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
          className="mt-8 space-y-5"
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
      <div id="hero-grid" className="bg-[#a855f7] text-black lg:min-h-[calc(100vh-3.5rem)] relative flex-1 min-h-[200px] overflow-hidden">
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

      </div>{/* 래퍼 닫기 */}

      <ResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        status={passStatus}
        isLoading={isLoading}
      />
    </>
  );
}
