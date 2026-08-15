import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { recruitmentService } from "@/services/api";
import type { RecruitmentResponseDto } from "@/services/types";
import { toast } from "@/components/ui/toastStore";
import { getErrorMessage } from "@/utils/error";

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
      const sorted = [...data].sort(
        (a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
      );
      setRecruitments(sorted);
    } catch (e) {
      console.error("Failed to load recruitments:", e);
      toast.error(getErrorMessage(e, "모집 일정을 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatus = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (now < startDate) return { label: "UPCOMING", color: "text-neutral-500 border-neutral-300" };
    if (now <= endDate) return { label: "OPEN", color: "text-purple-700 bg-purple-50 border-purple-300" };
    return { label: "CLOSED", color: "text-neutral-400 border-neutral-200" };
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 lg:inset-auto lg:left-0 lg:bottom-0 lg:w-[66.666%] lg:h-[72%] bg-white z-10 flex flex-col overflow-hidden"
    >
      {/* 헤더 */}
      <div className="px-5 md:px-8 py-4 border-b border-neutral-200 shrink-0">
        <h2 className="text-xl md:text-2xl font-black tracking-tighter text-neutral-900">모집일정</h2>
        <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 mt-0.5 block">RECRUITMENT SCHEDULE</span>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-5 md:px-8 py-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-500 rounded-full animate-spin" />
            <span className="text-sm font-semibold text-neutral-400">불러오는 중...</span>
          </div>
        ) : recruitments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base font-bold text-neutral-300">등록된 모집 공고가 없습니다.</p>
          </div>
        ) : (
          <div>
            {recruitments.map((recruitment, idx) => {
              const status = getStatus(recruitment.startDateTime, recruitment.endDateTime);
              return (
                <motion.div
                  key={recruitment.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-neutral-100 py-4 first:pt-0 last:border-b-0"
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <h3 className="text-base font-black tracking-tight text-neutral-900">{recruitment.title}</h3>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold tracking-widest border ${status.color} shrink-0 ml-3`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-[10px] font-bold tracking-widest text-neutral-400 w-12">START</span>
                      <span className="font-semibold text-neutral-600">{formatDate(recruitment.startDateTime)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-[10px] font-bold tracking-widest text-neutral-400 w-12">END</span>
                      <span className="font-semibold text-neutral-600">{formatDate(recruitment.endDateTime)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 하단 */}
      <div className="flex items-center justify-between px-5 md:px-8 py-3 border-t border-neutral-200 shrink-0">
        <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-300">SOLUTIO NEST</span>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-800 transition-colors"
        >
          닫기
        </button>
      </div>
    </motion.div>
  );
}
