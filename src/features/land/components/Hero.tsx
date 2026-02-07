import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GraphBackground from "@/features/land/components/GraphBackground";
import { InlineMath } from "react-katex";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ResultModal from "@/features/land/components/ResultModal";
import { applicantService } from "@/services/api";
import type { ApplicantPassResponseDto } from "@/services/types";
import Button from "@/components/ui/Button";

export default function Hero() {
  const { user } = useAuth();
  const [showLine, setShowLine] = useState(false);

  // State for Result Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passStatus, setPassStatus] = useState<ApplicantPassResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLine(true), 1000); // 1초 뒤 등장
    return () => clearTimeout(timer);
  }, []);

  const handleCheckResult = async () => {
    setIsModalOpen(true);
    setIsLoading(true);
    try {
      const status = await applicantService.getMyStatus();
      setPassStatus(status);
    } catch (error) {
      console.error("Failed to fetch applicant status", error);
      // Optional: Handle error state in modal or show toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-neutral-50 h-[calc(100svh-80px)] md:h-[calc(100svh-64px-70px)]">
      {/* 🔹 배경 그래프 */}
      <GraphBackground />

      {/* 🔹 메인 콘텐츠 */}
      <motion.div
        layout
        initial={{ gap: "0rem" }}
        animate={{ gap: showLine ? "1.25rem" : "0rem" }} // space-y-5 ≈ 1.25rem
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-3 md:px-4"
      >
        {/* 첫 번째 줄 */}
        <motion.h1
          layout
          className="text-4xl md:text-6xl font-extrabold leading-tight"
        >
          <InlineMath math="O(n^n)" /> 같은 인생,
        </motion.h1>

        {/* 합류 문구 — 1초 뒤 천천히 등장 (비로그인 시에만 노출) */}
        {!user && (
          <AnimatePresence>
            {showLine && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-lg md:text-2xl font-semibold text-neutral-800 flex items-center gap-2"
              >
                <span className="font-extrabold text-purple-700">SOLUTIO</span>에{" "}
                <Link
                  to="/signup"
                  className="cursor-pointer px-3 py-1 rounded-lg bg-purple-600 text-white font-bold shadow-md hover:bg-purple-700 transition"
                >
                  합류
                </Link>{" "}
                해
              </motion.p>
            )}
          </AnimatePresence>
        )}

        {/* 결과 확인 버튼 (GUEST 역할일 때만 노출) */}
        {user?.role === 'GUEST' && (
          <AnimatePresence>
            {showLine && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <Button
                  onClick={handleCheckResult}
                  variant="brand"
                  size="lg"
                  className="shadow-lg text-lg font-bold"
                >
                  결과 확인하기
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* 마지막 줄 */}
        <motion.h1
          layout
          className="text-4xl md:text-6xl font-extrabold leading-tight"
        >
          <InlineMath math="O(1)" />로 바꿔보자
        </motion.h1>
      </motion.div>

      {/* 🔹 하단 텍스트 */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-8">
        <p className="text-sm md:text-base font-semibold text-neutral-900/80">
          경기대학교 알고리즘 동아리{" "}
          <span className="font-extrabold">SOLUTIO</span>
        </p>
      </div>

      {/* 결과 모달 */}
      <ResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        status={passStatus}
        isLoading={isLoading}
      />
    </section>
  );
}
