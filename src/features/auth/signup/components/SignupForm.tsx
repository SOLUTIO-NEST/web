import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

interface SignupFormProps {
  onSubmit: (formData: any) => void;
}

const STEPS = [
  { id: 1, label: "기본 정보", fields: ["email", "password", "name", "phone"] },
  { id: 2, label: "학교 정보", fields: ["department", "studentId", "baekjoon", "language"] },
  { id: 3, label: "지원 동기", fields: ["motivation", "privacy"] },
];

const FIELD_CONFIG: Record<string, { label: string; placeholder: string; type?: string; required?: boolean }> = {
  email: { label: "학교 이메일 *", placeholder: "example@kyonggi.ac.kr" },
  password: { label: "비밀번호 *", placeholder: "8~12자, 영문·숫자·특수문자 포함", type: "password" },
  name: { label: "이름 *", placeholder: "솔부엉" },
  phone: { label: "전화번호 *", placeholder: "010-1234-5678" },
  department: { label: "소속 학과 *", placeholder: "컴퓨터공학전공" },
  studentId: { label: "학번 *", placeholder: "202511111" },
  baekjoon: { label: "백준 아이디 *", placeholder: "sowlsowl" },
};

export default function SignupForm({ onSubmit }: SignupFormProps) {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTriedSubmit, setIsTriedSubmit] = useState(false);

  const [form, setForm] = useState({
    email: "", password: "", department: "", studentId: "",
    name: "", phone: "", baekjoon: "", language: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "올바른 이메일 형식이 아닙니다.";
        break;
      case "password":
        if (value.length < 8 || value.length > 12 || !/[a-zA-Z]/.test(value) || !/[0-9]/.test(value) || !/[!@#$%^&*(),.?\":{}|<>]/.test(value))
          error = "8~12자, 영문·숫자·특수문자를 모두 포함해야 합니다.";
        break;
      case "phone":
        if (!/^010-\d{4}-\d{4}$/.test(value)) error = "010-1234-5678 형식으로 입력해주세요.";
        break;
      case "studentId":
        if (!/^\d{9}$/.test(value)) error = "학번은 숫자 9자리여야 합니다.";
        break;
      default:
        if (!value.trim()) error = "필수 입력 항목입니다.";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "phone") {
      newValue = newValue.replace(/[^0-9]/g, "");
      if (newValue.length >= 8) newValue = `${newValue.slice(0, 3)}-${newValue.slice(3, 7)}-${newValue.slice(7, 11)}`;
      else if (newValue.length >= 4) newValue = `${newValue.slice(0, 3)}-${newValue.slice(3)}`;
    }
    setForm((prev) => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
  };

  const handleNext = () => {
    const currentFields = STEPS[step].fields.filter(f => f !== "motivation" && f !== "privacy");
    let valid = true;
    currentFields.forEach(f => {
      if (!validateField(f, form[f as keyof typeof form])) valid = false;
    });
    if (valid && step < STEPS.length - 1) setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTriedSubmit(true);
    if (!isAgreed) return;

    let allValid = true;
    Object.entries(form).forEach(([key, value]) => {
      if (!validateField(key, value)) allValid = false;
    });
    if (allValid) onSubmit({ ...form, motivation });
  };

  const currentStep = STEPS[step];

  return (
    <form noValidate onSubmit={handleSubmit}>
      {/* 스텝 표시 */}
      <div className="px-5 md:px-10 lg:px-16 py-6 border-b border-black/10">
        <span className="text-sm font-bold tracking-wide text-black/40">
          {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </span>
      </div>

      {/* 폼 필드 영역 */}
      <div className="px-5 md:px-10 lg:px-16 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-0"
          >
            {step < 2 && currentStep.fields.map((fieldKey) => {
              const config = FIELD_CONFIG[fieldKey];
              if (!config) return null;
              const value = form[fieldKey as keyof typeof form];
              const error = errors[fieldKey];
              const isPassword = config.type === "password";

              return (
                <div key={fieldKey} className="border-b border-black/10 py-5 flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                  <label className="text-sm font-bold text-black/80 md:w-40 shrink-0">
                    {config.label}
                  </label>
                  <div className="flex-1">
                    <input
                      name={fieldKey}
                      type={isPassword ? (showPassword ? "text" : "password") : "text"}
                      value={value}
                      onChange={handleChange}
                      placeholder={config.placeholder}
                      maxLength={fieldKey === "phone" ? 13 : undefined}
                      className="w-full bg-transparent text-base font-medium placeholder:text-black/25 outline-none py-1"
                    />
                  </div>
                  {error && <p className="text-red-600 text-xs mt-1 md:mt-0 md:ml-4 shrink-0">{error}</p>}
                  {isPassword && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="ml-3 text-black/40 hover:text-black transition shrink-0"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
              );
            })}

            {/* 언어 선택 (step 2) */}
            {step === 1 && (
              <div className="border-b border-black/10 py-5">
                <label className="text-sm font-bold text-black/80 block mb-3">메인 언어 *</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "C", label: "C" },
                    { value: "CPP", label: "C++" },
                    { value: "JAVA", label: "Java" },
                    { value: "PYTHON", label: "Python" },
                    { value: "JAVASCRIPT", label: "JavaScript" },
                  ].map((lang) => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, language: lang.value }));
                        setErrors((prev) => ({ ...prev, language: "" }));
                      }}
                      className={`px-4 py-2 text-sm font-bold border transition-colors ${
                        form.language === lang.value
                          ? "bg-black text-white border-black"
                          : "bg-transparent text-black/60 border-black/20 hover:border-black/40 hover:text-black"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
                {errors.language && <p className="text-red-600 text-xs mt-2">{errors.language}</p>}
              </div>
            )}

            {/* 지원 동기 + 동의 (step 3) */}
            {step === 2 && (
              <>
                <div className="border-b border-black/10 py-5">
                  <label className="text-sm font-bold text-black/80 block mb-3">지원 동기 (선택)</label>
                  <textarea
                    placeholder="지원 동기를 자유롭게 작성해주세요"
                    rows={4}
                    maxLength={256}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full bg-transparent text-base font-medium placeholder:text-black/25 outline-none resize-none"
                  />
                  <p className="text-right text-xs text-black/30 mt-1">{motivation.length} / 256</p>
                </div>

                <div className="py-5">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacyConsent"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      className="mt-0.5 w-5 h-5 accent-black cursor-pointer"
                    />
                    <label htmlFor="privacyConsent" className="text-sm text-black/70 select-none">
                      <span className="font-bold text-black">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                      <button
                        type="button"
                        onClick={() => setIsPrivacyPolicyOpen(true)}
                        className="text-black underline ml-2 hover:text-black/60 font-medium"
                      >
                        내용 보기
                      </button>
                    </label>
                  </div>
                  {!isAgreed && isTriedSubmit && (
                    <p className="text-red-600 text-xs mt-2 ml-8">개인정보 수집 및 이용에 동의해야 신청이 가능합니다.</p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 md:px-10 lg:px-16 py-6 border-t border-black/10 flex items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 border border-black/20 font-bold text-sm hover:bg-black/5 transition-colors"
          >
            ← 이전
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 bg-black text-white font-bold text-sm hover:bg-black/85 transition-colors flex items-center gap-2"
          >
            다음
            <span>→</span>
          </button>
        ) : (
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white font-bold text-sm hover:bg-black/85 transition-colors flex items-center gap-2"
          >
            제출하기
            <span>→</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isPrivacyPolicyOpen && (
          <PrivacyPolicyModal onClose={() => setIsPrivacyPolicyOpen(false)} />
        )}
      </AnimatePresence>
    </form>
  );
}
