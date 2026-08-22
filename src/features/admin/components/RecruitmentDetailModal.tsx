import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  X,
  CalendarDays,
  Edit2,
  Trash2,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import type { RecruitmentResponseDto } from "@/services/types";
import { applicantService } from "@/services/api";
import { toast } from "@/components/ui/toastStore";
import { getErrorMessage } from "@/utils/error";
import {
  getRecruitmentStatus,
  formatDateTimeDisplay,
  calculateDuration,
  isPurgeEligible,
} from "../utils/recruitment";

interface Props {
  recruitment: RecruitmentResponseDto | null;
  onClose: () => void;
  onEdit: (item: RecruitmentResponseDto) => void;
  onDelete: (item: RecruitmentResponseDto) => void;
  onPurgeSuccess?: (recruitmentId: number) => void;
}

export default function RecruitmentDetailModal({
  recruitment,
  onClose,
  onEdit,
  onDelete,
  onPurgeSuccess,
}: Props) {
  const [isPurging, setIsPurging] = useState(false);
  const [purgedLocally, setPurgedLocally] = useState(false);

  if (!recruitment) return null;

  const isDataPurged = recruitment.isApplicantDataPurged || purgedLocally;
  const status = getRecruitmentStatus(
    recruitment.startDateTime,
    recruitment.endDateTime,
    recruitment.status
  );
  const duration = calculateDuration(
    recruitment.startDateTime,
    recruitment.endDateTime
  );
  const eligibleForPurge = isPurgeEligible(
    recruitment.announcementDateTime,
    isDataPurged
  );

  const handlePurge = async () => {
    if (
      !confirm(
        `[주의] "${recruitment.title}" (ID: #${recruitment.id}) 공고의 모든 지원자 개인정보 데이터를 즉시 파기하시겠습니까?\n\n파기 후에는 지원자의 개인정보가 영구적으로 삭제되며 복구할 수 없습니다.`
      )
    ) {
      return;
    }

    setIsPurging(true);
    try {
      const count = await applicantService.purgeData(recruitment.id);
      toast.success(
        `지원자 데이터 파기가 완료되었습니다. (삭제된 지원자: ${count}명)`
      );
      setPurgedLocally(true);
      if (onPurgeSuccess) {
        onPurgeSuccess(recruitment.id);
      }
    } catch (e: unknown) {
      console.error("Failed to purge applicant data:", e);
      toast.error(getErrorMessage(e, "지원자 데이터 파기 중 오류가 발생했습니다."));
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* 모달 박스 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white w-full max-w-lg shadow-2xl border border-neutral-200 overflow-hidden z-10"
      >
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <CalendarDays size={20} className="text-purple-400" />
            <h2 className="text-lg font-black tracking-tight">
              모집 공고 상세 정보
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* 주요 공고 요약 카드 */}
          <div className="p-4 bg-purple-50/60 border border-purple-100 flex items-start justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                공고 ID #{recruitment.id}
              </span>
              <h3 className="text-xl font-black text-neutral-900 mt-1.5 leading-snug">
                {recruitment.title}
              </h3>
            </div>
            <div className="text-right shrink-0 ml-3">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold border rounded-full ${status.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
                {status.label}
              </span>
            </div>
          </div>

          {/* 상세 정보 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoItem
              icon={Clock}
              label="모집 시작"
              value={formatDateTimeDisplay(recruitment.startDateTime)}
            />
            <InfoItem
              icon={Clock}
              label="모집 마감"
              value={formatDateTimeDisplay(recruitment.endDateTime)}
            />
            <InfoItem
              icon={CalendarDays}
              label="최종 발표"
              value={
                recruitment.announcementDateTime
                  ? formatDateTimeDisplay(recruitment.announcementDateTime)
                  : "미설정"
              }
            />
            <InfoItem
              icon={Sparkles}
              label="총 모집 기간"
              value={duration || "-"}
            />
          </div>

          {/* 개인정보 파기 상태 및 수동 파기 액션 */}
          {isDataPurged ? (
            <div className="p-3 bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-600 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>지원자 개인정보 데이터가 파기 처리 완료된 공고입니다.</span>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
              <div className="flex items-start gap-2 text-xs text-amber-900 font-medium">
                <ShieldAlert size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold block">개인정보 파기 관리</span>
                  <span className="text-[11px] text-amber-800">
                    {eligibleForPurge
                      ? "발표 후 6주가 경과하여 파기 대상입니다."
                      : "필요 시 수동으로 지원자 데이터를 파기할 수 있습니다."}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePurge}
                disabled={isPurging}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shrink-0 disabled:opacity-50 flex items-center gap-1.5"
              >
                {isPurging ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <ShieldAlert size={13} />
                )}
                수동 파기
              </button>
            </div>
          )}

          {/* 지원자 관리 바로가기 배너 */}
          <div className="p-4 bg-neutral-50 border border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-white border border-neutral-200 flex items-center justify-center text-neutral-700">
                <Users size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 block">
                  지원자 현황 관리
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  이 공고에 접수된 신청서 확인 및 합격 처리
                </span>
              </div>
            </div>
            <Link
              to={`/admin/applications?recruitmentId=${recruitment.id}`}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors flex items-center gap-1 rounded"
            >
              <span>목록 이동</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* 하단 액션 버튼 */}
          <div className="pt-4 flex items-center justify-between border-t border-neutral-100">
            <button
              type="button"
              onClick={() => onDelete(recruitment)}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5 transition-colors border border-red-200"
            >
              <Trash2 size={14} />
              공고 삭제
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(recruitment)}
                className="px-4 py-2 bg-neutral-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Edit2 size={14} />
                공고 수정
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-neutral-50/80 border border-neutral-200/70">
      <Icon size={16} className="text-neutral-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">
          {label}
        </span>
        <span className="text-xs font-bold text-neutral-800 truncate block mt-0.5">
          {value}
        </span>
      </div>
    </div>
  );
}
