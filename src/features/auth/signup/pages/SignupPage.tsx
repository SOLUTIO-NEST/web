import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ChevronDown } from "lucide-react"; 

export default function SignupPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* 🔹 반짝이는 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-3xl top-[-200px] left-[-200px] animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-3xl bottom-[-200px] right-[-150px] animate-pulse"></div>
      </div>

      {/* 🔹 네비게이션 */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Navbar />
      </div>

      {/* 🔹 회원가입 or 축하 메시지 */}
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-2xl bg-white shadow-xl rounded-3xl p-8 z-10 backdrop-blur-sm mt-16"
          >
            <h2 className="text-3xl font-extrabold text-center mb-6 text-purple-700">
              회원가입
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 이메일 */}
              <div>
                <label className="block text-sm font-semibold mb-2">이메일</label>
                <input
                  type="email"
                  placeholder="example@kyonggi.ac.kr"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              {/* ✅ 비밀번호 입력칸 */}
              <div className="relative">
                <label className="block text-sm font-semibold mb-2">비밀번호</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-purple-400 outline-none"
                />
                {/* 👁 아이콘 버튼 */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[70%] -translate-y-1/2 text-gray-500 hover:text-purple-600 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>


              {/* 소속학과 */}
              <div>
                <label className="block text-sm font-semibold mb-2">소속 학과</label>
                <input
                  type="text"
                  placeholder="컴퓨터공학전공"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              {/* 학번 */}
              <div>
                <label className="block text-sm font-semibold mb-2">학번</label>
                <input
                  type="text"
                  placeholder="2025xxxxx"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              {/* 이름 */}
              <div>
                <label className="block text-sm font-semibold mb-2">이름</label>
                <input
                  type="text"
                  placeholder="솔부엉"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              {/* 전화번호 */}
              <div>
                <label className="block text-sm font-semibold mb-2">전화번호</label>
                <input
                  type="tel"
                  placeholder="010-1234-5678"
                  maxLength={13}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, "");
                    if (value.length < 4) {
                      e.target.value = value;
                    } else if (value.length < 8) {
                      e.target.value = `${value.slice(0, 3)}-${value.slice(3)}`;
                    } else {
                      e.target.value = `${value.slice(0, 3)}-${value.slice(
                        3,
                        7
                      )}-${value.slice(7, 11)}`;
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              {/* 백준 아이디 */}
              <div>
                <label className="block text-sm font-semibold mb-2">백준 아이디</label>
                <input
                  type="text"
                  placeholder="sowlsowl"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              {/* 메인 언어 */}
              <div className="relative">
                <label className="block text-sm font-semibold mb-2">
                  메인 언어 (하나만 선택)
                </label>

                  <select
                    className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10
                              focus:ring-2 focus:ring-purple-400 outline-none
                              text-gray-700 [&>option[disabled]]:text-gray-400
                              [&>option[disabled]]:opacity-60"
                    defaultValue=""
                  >
                  <option value="" disabled>
                    선택하세요
                  </option>
                  <option>C</option>
                  <option>C++</option>
                  <option>Java</option>
                  <option>Python</option>
                  <option>JavaScript</option>
                </select>

                {/* 🔽 커스텀 드롭다운 아이콘 */}
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-[70%] -translate-y-1/2 text-gray-500 hover:text-purple-600 transition"
                />
              </div>

              {/* 제출 버튼 */}
              <div className="md:col-span-2 flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-purple-600 text-white font-bold px-10 py-4 rounded-lg shadow-md hover:bg-purple-700 transition transform hover:scale-105"
                >
                  가입하기
                </button>
              </div>
            </form>
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
              가입이 완료되었습니다!
            </h2>
            <p className="text-neutral-700 mb-8 leading-relaxed">
              SOLUTIO에 합류하신 걸 환영합니다 <br />
              새로운 여정을 함께 시작해봅시다
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
