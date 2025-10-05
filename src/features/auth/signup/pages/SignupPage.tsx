import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

export default function SignupPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ 모든 입력 값 상태
  const [form, setForm] = useState({
    email: "",
    password: "",
    department: "",
    studentId: "",
    name: "",
    phone: "",
    baekjoon: "",
    language: "",
  });

  // ✅ 에러 상태
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    department: "",
    studentId: "",
    name: "",
    phone: "",
    baekjoon: "",
    language: "",
  });

  // ✅ 실시간 검증 로직
  const validateField = (name: string, value: string) => {
  let error = "";

  switch (name) {
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "올바른 이메일 형식이 아닙니다.";
      break;

    case "password":
      if (
        value.length < 8 ||
        value.length > 12 ||
        !/[a-zA-Z]/.test(value) ||
        !/[0-9]/.test(value) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(value)
      )
        error = "8~12자, 영문·숫자·특수문자를 모두 포함해야 합니다.";
      break;

    case "phone":
      if (!/^010-\d{4}-\d{4}$/.test(value))
        error = "전화번호는 010-1234-5678 형식으로 입력해야 합니다.";
      break;

    case "studentId":
      if (!/^\d{9}$/.test(value))
        error = "학번은 숫자 9자리여야 합니다.";
      break;

    default:
      if (!value.trim()) error = "이 필드는 필수 입력입니다.";
  }

  setErrors((prev) => ({ ...prev, [name]: error }));
};


  // ✅ 입력 시 상태 업데이트 및 실시간 검증
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // 전화번호 자동 하이픈
    if (name === "phone") {
      newValue = newValue.replace(/[^0-9]/g, "");
      if (newValue.length < 4) newValue = newValue;
      else if (newValue.length < 8)
        newValue = `${newValue.slice(0, 3)}-${newValue.slice(3)}`;
      else newValue = `${newValue.slice(0, 3)}-${newValue.slice(3, 7)}-${newValue.slice(7, 11)}`;
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
  };

  // ✅ 제출 버튼 클릭 시 최종 검증
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;
    Object.entries(form).forEach(([key, value]) => {
      validateField(key, value);
      if (value.trim() === "") isValid = false;
    });

    if (Object.values(errors).some((msg) => msg)) isValid = false;

    if (isValid) setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* 배경 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-3xl top-[-200px] left-[-200px] animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-3xl bottom-[-200px] right-[-150px] animate-pulse"></div>
      </div>

      {/* 네비게이션 */}
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
            className="w-full max-w-2xl bg-white shadow-xl rounded-3xl p-8 z-10 backdrop-blur-sm mt-16"
          >
            <h2 className="text-3xl font-extrabold text-center mb-6 text-purple-700">
              회원가입
            </h2>

            <form noValidate onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 이메일 */}
              <div>
                <label className="block text-sm font-semibold mb-2">이메일</label>
                <input
                  name="email"
                  type="text"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@kyonggi.ac.kr"
                  className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none ${
                    errors.email
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-purple-400"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <label className="block text-sm font-semibold mb-2">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    className={`w-full border ${
                      errors.password ? "border-red-400" : "border-gray-300"
                    } rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-purple-400 outline-none`}
                  />
                  {/* 👁 아이콘 버튼 */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>


              {/* 소속학과 */}
              <div>
                <label className="block text-sm font-semibold mb-2">소속 학과</label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="컴퓨터공학전공"
                  className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none ${
                    errors.department
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-purple-400"
                  }`}
                />
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
              </div>

              {/* 학번 */}
              <div>
                <label className="block text-sm font-semibold mb-2">학번</label>
                <input
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  placeholder="2025xxxxx"
                  className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none ${
                    errors.studentId
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-purple-400"
                  }`}
                />
                {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
              </div>

              {/* 이름 */}
              <div>
                <label className="block text-sm font-semibold mb-2">이름</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="솔부엉"
                  className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none ${
                    errors.name
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-purple-400"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* 전화번호 */}
              <div>
                <label className="block text-sm font-semibold mb-2">전화번호</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="010-1234-5678"
                  maxLength={13}
                  className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none ${
                    errors.phone
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-purple-400"
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* 백준 아이디 */}
              <div>
                <label className="block text-sm font-semibold mb-2">백준 아이디</label>
                <input
                  name="baekjoon"
                  value={form.baekjoon}
                  onChange={handleChange}
                  placeholder="sowlsowl"
                  className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none ${
                    errors.baekjoon
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-purple-400"
                  }`}
                />
                {errors.baekjoon && <p className="text-red-500 text-xs mt-1">{errors.baekjoon}</p>}
              </div>

              {/* 메인 언어 */}
              <div>
                <label className="block text-sm font-semibold mb-2">메인 언어</label>
                <div className="relative">
                  <select
                    className={`w-full appearance-none border ${
                      errors.language ? "border-red-400" : "border-gray-300"
                    } rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-purple-400 outline-none`}
                    defaultValue=""
                  >
                    <option value="" disabled className="text-gray-400">
                      선택하세요
                    </option>
                    <option>C</option>
                    <option>C++</option>
                    <option>Java</option>
                    <option>Python</option>
                    <option>JavaScript</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
                {errors.language && (
                  <p className="text-red-500 text-xs mt-1">{errors.language}</p>
                )}
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
