import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, Calendar, AlertCircle } from "lucide-react";
import { recruitmentService } from "@/services/api";
import type { RecruitmentResponseDto } from "@/services/types";
import Button from "@/components/ui/Button";

interface RecruitmentInfoModalProps {
    onClose: () => void;
}

export default function RecruitmentInfoModal({ onClose }: RecruitmentInfoModalProps) {
    const [recruitments, setRecruitments] = useState<RecruitmentResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecruitments();
    }, []);

    const loadRecruitments = async () => {
        try {
            const data = await recruitmentService.getAll();
            // Sort by start date specific logic - newest first
            const sorted = [...data].sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime());
            setRecruitments(sorted);
        } catch (e) {
            console.error("Failed to load recruitments:", e);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getStatus = (start: string, end: string) => {
        const now = new Date();
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (now < startDate) {
            return { label: "모집 예정", color: "bg-blue-100 text-blue-700" };
        } else if (now >= startDate && now <= endDate) {
            return { label: "모집 중", color: "bg-green-100 text-green-700" };
        } else {
            return { label: "모집 마감", color: "bg-neutral-100 text-neutral-500" };
        }
    };

    // Use createPortal to render the modal outside of the Navbar context
    // This ensures z-index and positioning work correctly (center on screen)
    if (typeof document === 'undefined') return null; // Safety check for SSR if needed, though client-side render

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col pointer-events-auto"
            >
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                        <Calendar className="text-purple-600" size={24} />
                        모집 일정 안내
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-neutral-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            <p>일정을 불러오는 중입니다...</p>
                        </div>
                    ) : recruitments.length === 0 ? (
                        <div className="text-center py-12 text-neutral-500">
                            <AlertCircle className="mx-auto mb-3 text-neutral-300" size={48} />
                            <p>등록된 모집 공고가 없습니다.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recruitments.map((recruitment) => {
                                const status = getStatus(recruitment.startDateTime, recruitment.endDateTime);
                                return (
                                    <div
                                        key={recruitment.id}
                                        className="border border-neutral-200 rounded-xl p-5 hover:border-purple-200 hover:bg-purple-50/30 transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-bold text-lg text-neutral-900 group-hover:text-purple-700 transition-colors">
                                                {recruitment.title}
                                            </h3>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm text-neutral-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 font-medium text-neutral-500">시작일</div>
                                                <div className="font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                                                    {formatDate(recruitment.startDateTime)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 font-medium text-neutral-500">종료일</div>
                                                <div className="font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                                                    {formatDate(recruitment.endDateTime)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end">
                    <Button onClick={onClose} variant="brandSoft" size="sm">
                        닫기
                    </Button>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}
