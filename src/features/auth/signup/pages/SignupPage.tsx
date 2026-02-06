import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
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
      console.log('Recruitments fetched:', recruitments);

      if (!recruitments || recruitments.length === 0) {
        alert("현재 진행 중인 모집이 없습니다.");
        return;
      }

      const lastRecruitment = recruitments[recruitments.length - 1];
      if (!lastRecruitment) {
        console.error("Last recruitment is undefined. Array:", recruitments);
        alert("모집 정보를 불러오는 중 오류가 발생했습니다.");
        return;
      }
      const recruitmentId = lastRecruitment.id;

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
        recruitmentId: recruitmentId,
      });
      setIsSubmitted(true);
    } catch (err: any) {
      alert("신청 제출 중 오류가 발생했습니다: " + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* 🔹 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-3xl top-[-200px] left-[-200px] animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-3xl bottom-[-200px] right-[-150px] animate-pulse"></div>
      </div>

      {/* 🔹 네비게이션 */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Navbar />
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-2xl z-10 mt-16"
          >
            <SignupForm onSubmit={handleSubmit} />
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-2xl px-16 py-14 text-center max-w-2xl z-10"
          >
            <motion.span
              className="text-5xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🎉
            </motion.span>
            <h2 className="text-4xl font-extrabold text-purple-700 mb-4">
              신청이 완료되었습니다!
            </h2>
            <p className="text-neutral-700 mb-8 leading-relaxed">
              SOLUTIO에 지원해주셔서 감사합니다 <br />
              좋은 결과가 있기를 진심으로 기원합니다
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold shadow-md hover:bg-purple-700 transition"
              >
                홈으로 가기
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 border-2 border-purple-400 text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                로그인하기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
