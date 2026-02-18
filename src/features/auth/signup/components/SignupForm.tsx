import { useState } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

interface SignupFormProps {
    onSubmit: (formData: any) => void;
}

export default function SignupForm({ onSubmit }: SignupFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [motivation, setMotivation] = useState("");

    // ✅ 개인정보 동의 상태
    const [isAgreed, setIsAgreed] = useState(false);
    const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
    const [isTriedSubmit, setIsTriedSubmit] = useState(false);

    // ✅ 입력값 상태
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

    // ✅ 필드 검증
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
                    !/[!@#$%^&*(),.?\":{}|<>]/.test(value)
                )
                    error = "8~12자, 영문·숫자·특수문자를 모두 포함해야 합니다.";
                break;
            case "phone":
                if (!/^010-\d{4}-\d{4}$/.test(value))
                    error = "전화번호는 010-1234-5678 형식으로 입력해야 합니다.";
                break;
            case "studentId":
                if (!/^\d{9}$/.test(value)) error = "학번은 숫자 9자리여야 합니다.";
                break;
            default:
                if (!value.trim()) error = "이 필드는 필수 입력입니다.";
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    // ✅ 입력 이벤트
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "phone") {
            newValue = newValue.replace(/[^0-9]/g, "");
            if (newValue.length < 4) newValue = newValue;
            else if (newValue.length < 8)
                newValue = `${newValue.slice(0, 3)}-${newValue.slice(3)}`;
            else
                newValue = `${newValue.slice(0, 3)}-${newValue.slice(
                    3,
                    7
                )}-${newValue.slice(7, 11)}`;
        }

        setForm((prev) => ({ ...prev, [name]: newValue }));
        validateField(name, newValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsTriedSubmit(true);
        let isValid = true;

        Object.entries(form).forEach(([key, value]) => {
            validateField(key, value);
            if (value.trim() === "") isValid = false;
        });

        if (Object.values(errors).some((msg) => msg)) isValid = false;

        // ✅ 개인정보 동의 체크 확인
        if (!isAgreed) {
            isValid = false;
            // 스크롤을 맨 아래로 내려서 동의 필요함을 알림
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }

        if (isValid) {
            onSubmit({ ...form, motivation });
        }
    };

    return (
        <form
            noValidate
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            {/* 상단 제목 */}
            <div className="md:col-span-2 mb-4 text-center">
                <h2 className="text-3xl font-extrabold text-purple-700">
                    SOLUTIO 입단신청서
                </h2>
                <p className="text-gray-500 mt-2">
                    아래 내용을 빠짐없이 작성해주세요.
                </p>
            </div>

            {/* 이메일 */}
            <div>
                <label className="block text-sm font-semibold mb-2">학교 이메일</label>
                <input
                    name="email"
                    type="text"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@kyonggi.ac.kr"
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none ${errors.email
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-300 focus:ring-purple-400"
                        }`}
                />
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
            </div>

            {/* 비밀번호 */}
            <div>
                <label className="block text-sm font-semibold mb-2">비밀번호</label>
                <div className="relative">
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="비밀번호를 입력하세요"
                        className={`w-full border ${errors.password ? "border-red-400" : "border-gray-300"
                            } rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-purple-400 outline-none`}
                    />
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
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none ${errors.department
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-300 focus:ring-purple-400"
                        }`}
                />
                {errors.department && (
                    <p className="text-red-500 text-xs mt-1">{errors.department}</p>
                )}
            </div>

            {/* 학번 */}
            <div>
                <label className="block text-sm font-semibold mb-2">학번</label>
                <input
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    placeholder="202511111"
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none ${errors.studentId
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-300 focus:ring-purple-400"
                        }`}
                />
                {errors.studentId && (
                    <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>
                )}
            </div>

            {/* 이름 */}
            <div>
                <label className="block text-sm font-semibold mb-2">이름</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="솔부엉"
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none ${errors.name
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-300 focus:ring-purple-400"
                        }`}
                />
                {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
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
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none ${errors.phone
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-300 focus:ring-purple-400"
                        }`}
                />
                {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
            </div>

            {/* 백준 아이디 */}
            <div>
                <label className="block text-sm font-semibold mb-2">백준 아이디</label>
                <input
                    name="baekjoon"
                    value={form.baekjoon}
                    onChange={handleChange}
                    placeholder="sowlsowl"
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none ${errors.baekjoon
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-300 focus:ring-purple-400"
                        }`}
                />
                {errors.baekjoon && (
                    <p className="text-red-500 text-xs mt-1">{errors.baekjoon}</p>
                )}
            </div>

            {/* 메인 언어 */}
            <div>
                <label className="block text-sm font-semibold mb-2">메인 언어</label>
                <div className="relative">
                    <select
                        name="language"
                        value={form.language}
                        onChange={handleChange}
                        className={`w-full appearance-none border ${errors.language ? "border-red-400" : "border-gray-300"
                            } rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-purple-400 outline-none`}
                    >
                        <option value="" disabled className="text-gray-400">
                            선택하세요
                        </option>
                        <option value="C">C</option>
                        <option value="CPP">C++</option>
                        <option value="JAVA">Java</option>
                        <option value="PYTHON">Python</option>
                        <option value="JAVASCRIPT">JavaScript</option>
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

            {/* 지원 동기 */}
            <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                    지원 동기 (선택)
                </label>
                <textarea
                    placeholder="지원 동기를 자유롭게 작성해주세요 (최대 256자)"
                    rows={4}
                    maxLength={256}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none resize-none"
                />
                <p className="text-right text-xs text-gray-256 mt-1">
                    {motivation.length} / 256
                </p>
            </div>
            {/* 개인정보 수집 및 이용 동의 */}
            <div className="md:col-span-2 border-t pt-6 mt-2">
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="privacyConsent"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <label htmlFor="privacyConsent" className="text-sm text-gray-700 select-none">
                        <span className="font-bold text-gray-900">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                        <button
                            type="button"
                            onClick={() => setIsPrivacyPolicyOpen(true)}
                            className="text-purple-600 underline ml-2 hover:text-purple-800 font-medium"
                        >
                            내용 보기
                        </button>
                    </label>
                </div>
                {!isAgreed && isTriedSubmit && (
                    <p className="text-red-500 text-xs mt-2 ml-8">
                        개인정보 수집 및 이용에 동의해야 신청이 가능합니다.
                    </p>
                )}
            </div>

            {/* 하단 버튼 */}
            <div className="md:col-span-2 mt-4">
                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white font-bold px-6 py-4 rounded-xl shadow-lg hover:bg-purple-700 transition transform hover:scale-[1.01] active:scale-[0.99] text-lg"
                >
                    지원서 제출하기
                </button>
            </div>

            {/* 개인정보 처리방침 모달 */}
            <AnimatePresence>
                {isPrivacyPolicyOpen && (
                    <PrivacyPolicyModal onClose={() => setIsPrivacyPolicyOpen(false)} />
                )}
            </AnimatePresence>
        </form>
    );
}
