import { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Eye, EyeOff } from "lucide-react";

interface Props {
    onSubmit: (formData: any) => Promise<void>;
}

export default function SignupForm({ onSubmit }: Props) {
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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let isValid = true;

        Object.entries(form).forEach(([key, value]) => {
            validateField(key, value);
            if (value.trim() === "") isValid = false;
        });

        if (Object.values(errors).some((msg) => msg)) isValid = false;
        if (isValid) {
            await onSubmit({ ...form, motivation });
        }
    };

    return (
        <Card className="p-8 backdrop-blur-sm bg-white/90">
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
                    <Button type="submit" className="shadow-md hover:scale-105">
                        제출하기
                    </Button>
                </div>

                {/* 이메일 */}
                <Input
                    label="이메일"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@kyonggi.ac.kr"
                    error={errors.email}
                />

                {/* 비밀번호 */}
                <div className="relative">
                    <Input
                        label="비밀번호"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="비밀번호를 입력하세요"
                        error={errors.password}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[34px] text-gray-500 hover:text-purple-600 transition"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {/* 소속학과 */}
                <Input
                    label="소속 학과"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="컴퓨터공학전공"
                    error={errors.department}
                />

                {/* 학번 */}
                <Input
                    label="학번"
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    placeholder="202511111"
                    error={errors.studentId}
                />

                {/* 이름 */}
                <Input
                    label="이름"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="솔부엉"
                    error={errors.name}
                />

                {/* 전화번호 */}
                <Input
                    label="전화번호"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="010-1234-5678"
                    maxLength={13}
                    error={errors.phone}
                />

                {/* 백준 아이디 */}
                <Input
                    label="백준 아이디"
                    name="baekjoon"
                    value={form.baekjoon}
                    onChange={handleChange}
                    placeholder="sowlsowl"
                    error={errors.baekjoon}
                />

                {/* 메인 언어 */}
                <Select
                    label="메인 언어"
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    error={errors.language}
                >
                    <option value="" disabled className="text-gray-400">
                        선택하세요
                    </option>
                    <option>C</option>
                    <option>C++</option>
                    <option>Java</option>
                    <option>Python</option>
                    <option>JavaScript</option>
                </Select>

                {/* 지원 동기 */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
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
                    <p className="text-right text-xs text-gray-400 mt-1">
                        {motivation.length} / 256
                    </p>
                </div>
            </form>
        </Card>
    );
}
