import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(studentId, password);
      navigate("/");
    } catch (err: any) {
      setError(err.toString());
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 text-black">
      <header className="flex items-center justify-between border-b border-black/10 shrink-0">
        <a href="/" className="flex items-center gap-3 px-5 md:px-6 py-4">
          <img src="/logo.png" alt="SOLUTIO" className="h-8 w-8" />
          <span className="hidden md:inline text-lg font-extrabold tracking-tight">SOLUTIO NEST</span>
        </a>
        <div className="flex items-center">
          <Link to="/signup" className="px-4 py-4 text-sm font-bold border-l border-black/10 hover:bg-black/5 transition-colors">
            입단 신청
          </Link>
          <Link to="/" className="px-5 py-4 text-sm font-bold border-l border-black/10 hover:bg-black/5 transition-colors">
            홈으로
          </Link>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col lg:flex-row min-h-0"
      >
        <div className="lg:w-[38%] lg:border-r border-b lg:border-b-0 border-black/10 flex flex-col justify-between px-5 md:px-10 py-8 md:py-12">
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tighter">
              로그인
            </h1>
          </div>
          <p className="mt-8 lg:mt-0 text-base md:text-lg font-semibold text-black/60 leading-relaxed">
            SOLUTIO 부원 전용 공간입니다.<br />
            학번과 비밀번호를 입력해주세요.
          </p>
        </div>

        <div className="flex-1 flex flex-col">
          <form noValidate onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-5 md:px-10 lg:px-16 py-6">
              <div className="border-b border-black/10 py-5 flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                <label className="text-sm font-bold text-black/80 md:w-40 shrink-0">
                  학번 *
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="202400000"
                    className="w-full bg-transparent text-base font-medium placeholder:text-black/25 outline-none py-1"
                  />
                </div>
              </div>

              <div className="border-b border-black/10 py-5 flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                <label className="text-sm font-bold text-black/80 md:w-40 shrink-0">
                  비밀번호 *
                </label>
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="w-full bg-transparent text-base font-medium placeholder:text-black/25 outline-none py-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="py-4 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="pt-6">
                <p className="text-sm text-black/50">
                  계정이 없으신가요?{" "}
                  <Link to="/signup" className="text-black font-bold underline hover:text-black/60 transition-colors">
                    입단 신청하기
                  </Link>
                </p>
              </div>
            </div>

            <div className="px-5 md:px-10 lg:px-16 py-6 border-t border-black/10">
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white font-bold text-sm hover:bg-black/85 transition-colors flex items-center gap-2"
              >
                로그인
                <span>→</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
