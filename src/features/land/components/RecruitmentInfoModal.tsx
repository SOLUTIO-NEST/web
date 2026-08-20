import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { recruitmentService } from "@/services/api";
import type { RecruitmentResponseDto } from "@/services/types";
import { toast } from "@/components/ui/toastStore";
import { getErrorMessage } from "@/utils/error";
import {
  getRecruitmentStatus,
  formatDateTimeDisplay,
} from "@/features/admin/utils/recruitment";
import { CalendarDays, ArrowRight } from "lucide-react";

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
      const data = await recruitmentService.getAll(0, 50);
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
      );
      setRecruitments(sorted);
    } catch (e) {
      console.error("Failed to load recruitments:", e);
      toast.error(getErrorMessage(e, "모집 일정을 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 lg:inset-auto lg:left-0 lg:bottom-0 lg:w-[66.666%] lg:h-[72%] bg-white z-10 flex flex-col overflow-hidden shadow-2xl border border-neutral-200"
    >
      {/* 헤더 */}
      <div className="px-5 md:px-8 py-4 border-b border-neutral-200 shrink-0 bg-white">
        <h2 className="text-xl md:text-2xl font-black tracking-tighter text-neutral-900 flex items-center gap-2">
          <CalendarDays size={22} className="text-purple-600" />
          모집일정
        </h2>
        <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 mt-0.5 block">
          RECRUITMENT SCHEDULE
        </span>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-5 md:px-8 py-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-5 h-5 border-2 border-neutral-200 border-t-purple-600 rounded-full animate-spin" />
            <span className="text-sm font-semibold text-neutral-400">불러오는 중...</span>
          </div>
        ) : recruitments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base font-bold text-neutral-300">
              현재 등록된 모집 공고가 없습니다.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {recruitments.map((recruitment, idx) => {
              const status = getRecruitmentStatus(
                recruitment.startDateTime,
                recruitment.endDateTime,
                recruitment.status
              );

              return (
                <motion.div
                  key={recruitment.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.08,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* 좌측: 공고 타이틀 및 일정 정보 */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <h3 className="text-base md:text-lg font-black tracking-tight text-neutral-900">
                      {recruitment.title}
                    </h3>

                    {/* 일정 정보: START와 ANNOUNCE를 같은 행에 배치 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold tracking-widest text-neutral-400 w-16 shrink-0">
                          START
                        </span>
                        <span className="font-semibold text-neutral-700">
                          {formatDateTimeDisplay(recruitment.startDateTime)}
                        </span>
                      </div>

                      {recruitment.announcementDateTime ? (
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] font-bold tracking-widest text-purple-600 w-16 shrink-0">
                            ANNOUNCE
                          </span>
                          <span className="font-semibold text-neutral-700">
                            {formatDateTimeDisplay(recruitment.announcementDateTime)}
                          </span>
                        </div>
                      ) : (
                        <div className="hidden sm:block" />
                      )}

                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold tracking-widest text-neutral-400 w-16 shrink-0">
                          END
                        </span>
                        <span className="font-semibold text-neutral-700">
                          {formatDateTimeDisplay(recruitment.endDateTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 우측: 상태 버튼 / 텍스트 박스 */}
                  <div className="shrink-0 pt-1 sm:pt-0">
                    {status.type === "OPEN" ? (
                      <Link
                        to={`/signup?recruitmentId=${recruitment.id}`}
                        onClick={onClose}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-black text-white font-bold text-xs hover:bg-black/85 transition-colors w-24 sm:w-28 text-center"
                      >
                        <span>지원하기</span>
                        <ArrowRight size={13} />
                      </Link>
                    ) : status.type === "UPCOMING" ? (
                      <div className="px-4 py-2 bg-neutral-100 text-neutral-400 border border-neutral-200 font-bold text-xs text-center w-24 sm:w-28 select-none">
                        모집 예정
                      </div>
                    ) : (
                      <div className="px-4 py-2 bg-neutral-100 text-neutral-400 border border-neutral-200 font-bold text-xs text-center w-24 sm:w-28 select-none">
                        모집 종료
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 하단 푸터 */}
      <div className="flex items-center justify-between px-5 md:px-8 py-3 border-t border-neutral-200 shrink-0 bg-white">
        <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-300">
          SOLUTIO NEST
        </span>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-black text-white font-bold text-xs hover:bg-black/85 transition-colors"
        >
          닫기
        </button>
      </div>
    </motion.div>
  );
}
