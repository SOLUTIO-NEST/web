import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            navigate("/");
        } catch (err: any) {
            setError(err.toString());
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

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md z-10 mt-16"
            >
                <Card className="p-8 backdrop-blur-sm bg-white/90">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-purple-700 mb-2">
                            로그인
                        </h2>
                        <p className="text-gray-500 text-sm">SOLUTIO 부원 전용 공간입니다</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="이메일"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@solutio.com"
                        />

                        <div className="relative">
                            <Input
                                label="비밀번호"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[34px] text-gray-500 hover:text-purple-600 transition"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full shadow-md hover:bg-purple-700 active:scale-95"
                            size="lg"
                        >
                            로그인
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        계정이 없으신가요?{" "}
                        <span
                            className="text-purple-600 font-bold cursor-pointer hover:underline"
                            onClick={() => navigate("/signup")}
                        >
                            입단 신청하기
                        </span>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
