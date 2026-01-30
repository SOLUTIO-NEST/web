import { useState } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

interface SignupFormProps {
    onSubmit: (formData: any) => void;
}

export default function SignupForm({ onSubmit }: SignupFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [motivation, setMotivation] = useState("");

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

    // ✅ 제출 시 검증
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let isValid = true;

        Object.entries(form).forEach(([key, value]) => {
            validateField(key, value);
            if (value.trim() === "") isValid = false;
        });

        if (Object.values(errors).some((msg) => msg)) isValid = false;

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
            {/* 상단 제목 + 제출 버튼 */}
            <div className="md:col-span-2 flex justify-between items-center mb-4">
                <h2 className="text-3xl font-extrabold text-purple-700">
                    SOLUTIO 입단신청서
                </h2>
                <button
                    type="submit"
                    className="bg-purple-600 text-white font-bold px-6 py-2 rounded-lg shadow-md hover:bg-purple-700 transition transform hover:scale-105"
                >
                    제출하기
                </button>
            </div>

            {/* 이메일 */}
            <div>
                <label className="block text-sm font-semibold mb-2">이메일</label>
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
        </form>
    );
}
