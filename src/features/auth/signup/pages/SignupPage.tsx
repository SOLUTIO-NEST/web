import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { applicantService, recruitmentService } from "@/services/api";
import type { MainLanguage } from "@/services/types";
import SignupForm from "../components/SignupForm";

export default function SignupPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    try {
      const recruitments = await recruitmentService.getAll();
      if (!recruitments || recruitments.length === 0) {
        alert("현재 진행 중인 모집이 없습니다.");
        return;
      }
      const lastRecruitment = recruitments[recruitments.length - 1];
      if (!lastRecruitment) {
        alert("모집 정보를 불러오는 중 오류가 발생했습니다.");
        return;
      }

      await applicantService.apply({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        department: formData.department,
        studentId: formData.studentId,
        phoneNumber: formData.phone,
        bojId: formData.baekjoon,
        mainLanguage: formData.language as MainLanguage,
        applyReason: formData.motivation,
        recruitmentId: lastRecruitment.id,
      });
      setIsSubmitted(true);
    } catch (err: any) {
      alert("신청 제출 중 오류가 발생했습니다: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 text-black">

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col lg:flex-row min-h-0"
          >
            {/* 좌측: 타이틀 영역 */}
            <div className="lg:w-[38%] lg:border-r border-b lg:border-b-0 border-black/10 flex flex-col justify-between px-5 md:px-10 py-8 md:py-12">
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tighter">
                  입단<br />신청
                </h1>
              </div>
              <p className="mt-8 lg:mt-0 text-base md:text-lg font-semibold text-black/60 leading-relaxed">
                아래 내용을 작성하고<br />
                SOLUTIO에 합류하세요.
              </p>
            </div>

            {/* 우측: 폼 영역 */}
            <div className="flex-1 overflow-y-auto">
              <SignupForm onSubmit={handleSubmit} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col lg:flex-row min-h-0"
          >
            {/* 좌측 */}
            <div className="lg:w-[38%] lg:border-r border-b lg:border-b-0 border-black/10 flex flex-col justify-between px-5 md:px-10 py-8 md:py-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tighter">
                신청<br />완료
              </h1>
              <p className="mt-8 lg:mt-0 text-base md:text-lg font-semibold text-black/60 leading-relaxed">
                SOLUTIO에 지원해주셔서 감사합니다.<br />
                좋은 결과가 있기를 진심으로 기원합니다.
              </p>
            </div>

            {/* 우측 */}
            <div className="flex-1 flex flex-col items-start justify-center px-5 md:px-10 lg:px-16 py-12">
              <div className="space-y-8 w-full max-w-lg">
                <p className="text-lg font-semibold text-black/70">
                  합격 발표는 메인 페이지에서 확인하실 수 있습니다.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 bg-black text-white font-bold hover:bg-black/85 transition-colors flex items-center gap-2"
                  >
                    홈으로 가기
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-3 border border-black/30 font-bold hover:bg-black/5 transition-colors"
                  >
                    로그인하기
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
