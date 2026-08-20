import { useState } from "react";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { RecruitmentResponseDto } from "@/services/types";
import { formatDateTimeDisplay } from "@/features/admin/utils/recruitment";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

export interface SignupFormData {
  email: string;
  password: string;
  name: string;
  department: string;
  studentId: string;
  phone: string;
  baekjoon: string;
  language: string;
  motivation?: string;
}

interface SignupFormProps {
  recruitments: RecruitmentResponseDto[];
  selectedRecruitment: RecruitmentResponseDto | null;
  onSelectRecruitment: (recruitment: RecruitmentResponseDto) => void;
  onSubmit: (formData: SignupFormData) => void;
  hasRecruitmentStep: boolean;
}

const ALL_STEPS_WITH_RECRUITMENT = [
  { id: 1, label: "모집 공고", type: "recruitment" as const },
  { id: 2, label: "기본 정보", type: "basic" as const, fields: ["email", "password", "name", "phone"] },
  { id: 3, label: "학교 정보", type: "school" as const, fields: ["department", "studentId", "baekjoon", "language"] },
  { id: 4, label: "지원 동기", type: "motivation" as const, fields: ["motivation", "privacy"] },
];

const STEPS_WITHOUT_RECRUITMENT = [
  { id: 1, label: "기본 정보", type: "basic" as const, fields: ["email", "password", "name", "phone"] },
  { id: 2, label: "학교 정보", type: "school" as const, fields: ["department", "studentId", "baekjoon", "language"] },
  { id: 3, label: "지원 동기", type: "motivation" as const, fields: ["motivation", "privacy"] },
];

const FIELD_CONFIG: Record<string, { label: string; placeholder: string; type?: string; required?: boolean }> = {
  email: { label: "학교 이메일 *", placeholder: "example@kyonggi.ac.kr" },
  password: { label: "비밀번호 *", placeholder: "8자 이상 입력해주세요", type: "password" },
  name: { label: "이름 *", placeholder: "솔부엉" },
  phone: { label: "전화번호 *", placeholder: "010-1234-5678" },
  department: { label: "소속 학과 *", placeholder: "컴퓨터공학전공" },
  studentId: { label: "학번 *", placeholder: "202511111" },
  baekjoon: { label: "백준 아이디 *", placeholder: "sowlsowl" },
};

export default function SignupForm({
  recruitments,
  selectedRecruitment,
  onSelectRecruitment,
  onSubmit,
  hasRecruitmentStep,
}: SignupFormProps) {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTriedSubmit, setIsTriedSubmit] = useState(false);

  const steps = hasRecruitmentStep ? ALL_STEPS_WITH_RECRUITMENT : STEPS_WITHOUT_RECRUITMENT;
  const currentStep = steps[step] || steps[0];

  // 모집 진행중(status === 'OPEN')인 공고만 필터링
  const openRecruitments = recruitments.filter((r) => r.status === "OPEN");

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
        else if (!/^[^\s@]+@(kyonggi\.ac\.kr|kgu\.ac\.kr)$/.test(value)) error = "학교 이메일(kyonggi.ac.kr 또는 kgu.ac.kr)만 사용 가능합니다.";
        break;
      case "password":
        if (value.length < 8) error = "8자 이상 입력해주세요.";
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
    if (currentStep.type === "recruitment") {
      if (!selectedRecruitment || selectedRecruitment.status !== "OPEN") {
        setErrors((prev) => ({ ...prev, recruitment: "지원할 모집 공고를 선택해주세요." }));
        return;
      }
      setErrors((prev) => ({ ...prev, recruitment: "" }));
      setStep((prev) => prev + 1);
      return;
    }

    if ("fields" in currentStep && currentStep.fields) {
      const currentFields = currentStep.fields.filter(f => f !== "motivation" && f !== "privacy");
      let valid = true;
      currentFields.forEach(f => {
        if (!validateField(f, form[f as keyof typeof form])) valid = false;
      });
      if (valid && step < steps.length - 1) {
        setStep((prev) => prev + 1);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTriedSubmit(true);
    if (!isAgreed) return;

    if (!selectedRecruitment || selectedRecruitment.status !== "OPEN") {
      if (hasRecruitmentStep) {
        setStep(0);
      }
      setErrors((prev) => ({ ...prev, recruitment: "모집 진행 중인 공고를 선택해주세요." }));
      return;
    }

    let allValid = true;
    Object.entries(form).forEach(([key, value]) => {
      if (!validateField(key, value)) allValid = false;
    });
    if (allValid) onSubmit({ ...form, motivation });
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      {/* 스텝 표시 */}
      <div className="px-5 md:px-10 lg:px-16 py-6 border-b border-black/10">
        <span className="text-sm font-bold tracking-wide text-black/40">
          {String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </span>
      </div>

      {/* 폼 필드 영역 */}
      <div className="px-5 md:px-10 lg:px-16 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${hasRecruitmentStep ? "rec" : "norec"}-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-0"
          >
            {/* 모집 공고 선택 단계 */}
            {currentStep.type === "recruitment" && (
              <div className="py-2 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-black/80">지원할 모집 공고를 선택해주세요 *</h3>
                  <p className="text-xs text-black/50 mt-0.5">현재 모집 진행 중인 공고 목록입니다.</p>
                </div>

                {openRecruitments.length === 0 ? (
                  <div className="py-10 text-center border border-dashed border-black/20">
                    <p className="text-sm font-semibold text-neutral-400">현재 모집 진행 중인 공고가 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {openRecruitments.map((recruitment) => {
                      const isSelected = selectedRecruitment?.id === recruitment.id;

                      return (
                        <div
                          key={recruitment.id}
                          onClick={() => {
                            onSelectRecruitment(recruitment);
                            setErrors((prev) => ({ ...prev, recruitment: "" }));
                          }}
                          className={`p-4 border transition-colors duration-150 cursor-pointer relative flex items-center justify-between gap-4 ${
                            isSelected
                              ? "border-black bg-black text-white"
                              : "border-black/15 bg-white hover:border-black/40 text-black"
                          }`}
                        >
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <h4 className="font-extrabold text-sm sm:text-base tracking-tight truncate">
                              {recruitment.title}
                            </h4>

                            <div className={`flex flex-wrap items-center gap-x-8 gap-y-1.5 text-xs ${
                              isSelected ? "text-neutral-300" : "text-neutral-500"
                            }`}>
                              <div className="whitespace-nowrap shrink-0">
                                <span className="font-medium mr-1.5 opacity-70">접수기간:</span>
                                <span className="font-semibold">
                                  {formatDateTimeDisplay(recruitment.startDateTime)} ~ {formatDateTimeDisplay(recruitment.endDateTime)}
                                </span>
                              </div>
                              {recruitment.announcementDateTime && (
                                <div className="whitespace-nowrap shrink-0">
                                  <span className="font-medium mr-1.5 opacity-70">발표:</span>
                                  <span className="font-semibold">
                                    {formatDateTimeDisplay(recruitment.announcementDateTime)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center justify-end">
                            <div className={`w-5 h-5 rounded-full border transition-colors duration-150 flex items-center justify-center ${
                              isSelected ? "border-white bg-white text-black" : "border-neutral-300 bg-transparent"
                            }`}>
                              {isSelected && <CheckCircle2 size={14} className="stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {errors.recruitment && (
                  <p className="text-red-600 text-xs font-semibold">{errors.recruitment}</p>
                )}
              </div>
            )}

            {/* 기본 정보 단계 */}
            {currentStep.type === "basic" && currentStep.fields?.map((fieldKey) => {
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

            {/* 학교 정보 + 메인 언어 단계 */}
            {currentStep.type === "school" && (
              <>
                {currentStep.fields?.filter(f => f !== "language").map((fieldKey) => {
                  const config = FIELD_CONFIG[fieldKey];
                  if (!config) return null;
                  const value = form[fieldKey as keyof typeof form];
                  const error = errors[fieldKey];

                  return (
                    <div key={fieldKey} className="border-b border-black/10 py-5 flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                      <label className="text-sm font-bold text-black/80 md:w-40 shrink-0">
                        {config.label}
                      </label>
                      <div className="flex-1">
                        <input
                          name={fieldKey}
                          type="text"
                          value={value}
                          onChange={handleChange}
                          placeholder={config.placeholder}
                          className="w-full bg-transparent text-base font-medium placeholder:text-black/25 outline-none py-1"
                        />
                      </div>
                      {error && <p className="text-red-600 text-xs mt-1 md:mt-0 md:ml-4 shrink-0">{error}</p>}
                    </div>
                  );
                })}

                {/* 메인 언어 선택 */}
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
              </>
            )}

            {/* 지원 동기 + 개인정보 동의 단계 */}
            {currentStep.type === "motivation" && (
              <>
                <div className="border-b border-black/10 py-5">
                  <label className="text-sm font-bold text-black/80 block mb-3">지원 동기 (선택)</label>
                  <textarea
                    placeholder="지원 동기를 자유롭게 작성해주세요"
                    rows={4}
                    maxLength={255}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full bg-transparent text-base font-medium placeholder:text-black/25 outline-none resize-none"
                  />
                  <p className="text-right text-xs text-black/30 mt-1">{motivation.length} / 255</p>
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
                        onClick={(e) => { e.preventDefault(); setIsPrivacyPolicyOpen(true); }}
                        className="text-black underline ml-2 hover:text-black/60 font-medium"
                      >
                        내용 보기
                      </button>
                    </label>
                  </div>
                  <p className={`text-red-600 text-xs mt-2 ml-8 ${!isAgreed && isTriedSubmit ? "visible" : "invisible"}`}>
                    개인정보 수집 및 이용에 동의해야 신청이 가능합니다.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 하단 버튼: 오른쪽 정렬로 다음 버튼 위치 고정 */}
      <div className="px-5 md:px-10 lg:px-16 py-6 border-t border-black/10 flex items-center justify-end gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((prev) => prev - 1)}
            className="px-6 py-3 border border-black/20 font-bold text-sm hover:bg-black/5 transition-colors"
          >
            ← 이전
          </button>
        )}

        {step < steps.length - 1 ? (
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
