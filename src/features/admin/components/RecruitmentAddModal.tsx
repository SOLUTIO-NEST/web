import { useState } from "react";
import { motion } from "framer-motion";
import { X, CalendarPlus, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { recruitmentService } from "@/services/api";
import { toast } from "@/components/ui/toastStore";
import { getErrorMessage } from "@/utils/error";
import {
  formatToDatetimeLocal,
  formatToApiDateTime,
} from "../utils/recruitment";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RecruitmentAddModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const now = new Date();
  const defaultStart = formatToDatetimeLocal(now);
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  oneWeekLater.setHours(23, 59, 0, 0);
  const defaultEnd = formatToDatetimeLocal(oneWeekLater);
  const defaultAnnouncement = new Date(oneWeekLater.getTime() + 5 * 24 * 60 * 60 * 1000);
  defaultAnnouncement.setHours(18, 0, 0, 0);

  const [title, setTitle] = useState("");
  const [startDateTime, setStartDateTime] = useState(defaultStart);
  const [endDateTime, setEndDateTime] = useState(defaultEnd);
  const [announcementDateTime, setAnnouncementDateTime] = useState(formatToDatetimeLocal(defaultAnnouncement));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const applyPreset = (days: number) => {
    const startDate = new Date();
    startDate.setMinutes(0, 0, 0);
    const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
    endDate.setHours(23, 59, 0, 0);
    const announceDate = new Date(endDate.getTime() + 5 * 24 * 60 * 60 * 1000);
    announceDate.setHours(18, 0, 0, 0);

    setStartDateTime(formatToDatetimeLocal(startDate));
    setEndDateTime(formatToDatetimeLocal(endDate));
    setAnnouncementDateTime(formatToDatetimeLocal(announceDate));
  };

  const applyMonthEndPreset = () => {
    const startDate = new Date();
    startDate.setMinutes(0, 0, 0);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 0);
    const announceDate = new Date(endDate.getTime() + 5 * 24 * 60 * 60 * 1000);
    announceDate.setHours(18, 0, 0, 0);

    setStartDateTime(formatToDatetimeLocal(startDate));
    setEndDateTime(formatToDatetimeLocal(endDate));
    setAnnouncementDateTime(formatToDatetimeLocal(announceDate));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage("모집 공고 제목을 입력해주세요.");
      return;
    }
    if (!startDateTime) {
      setErrorMessage("모집 시작 일시를 설정해주세요.");
      return;
    }
    if (!endDateTime) {
      setErrorMessage("모집 마감 일시를 설정해주세요.");
      return;
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (start >= end) {
      setErrorMessage("마감 일시는 시작 일시 이후여야 합니다.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await recruitmentService.create({
        title: title.trim(),
        startDateTime: formatToApiDateTime(startDateTime),
        endDateTime: formatToApiDateTime(endDateTime),
        announcementDateTime: announcementDateTime ? formatToApiDateTime(announcementDateTime) : null,
      });

      toast.success("새 모집 공고가 등록되었습니다.");
      onSuccess();
      onClose();
    } catch (e: unknown) {
      console.error("Failed to create recruitment:", e);
      const msg = getErrorMessage(e, "모집 공고 등록에 실패했습니다.");
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
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
        className="relative bg-white w-full max-w-lg shadow-2xl border border-neutral-200 overflow-hidden z-10 max-h-[90vh] flex flex-col"
      >
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <CalendarPlus size={20} className="text-purple-400" />
            <h2 className="text-lg font-black tracking-tight">새 모집 공고 등록</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 제목 */}
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-extrabold text-neutral-700 uppercase tracking-wider mb-2"
            >
              공고 제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="예: 2026년도 1학기 신규 부원 모집"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors font-medium"
              autoFocus
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              랜딩 페이지 및 지원서 폼 상단에 노출되는 공고명입니다.
            </p>
          </div>

          {/* 기간 간편 설정 프리셋 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">
                모집 기간 설정
              </span>
              <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                <Sparkles size={12} className="text-purple-600" />
                빠른 기간 프리셋
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                type="button"
                onClick={() => applyPreset(7)}
                className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded transition-colors border border-neutral-200"
              >
                + 1주일 (7일)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(14)}
                className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded transition-colors border border-neutral-200"
              >
                + 2주일 (14일)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(21)}
                className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded transition-colors border border-neutral-200"
              >
                + 3주일 (21일)
              </button>
              <button
                type="button"
                onClick={applyMonthEndPreset}
                className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded transition-colors border border-neutral-200"
              >
                이번 달 말일까지
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDateTime"
                  className="block text-[11px] font-bold text-neutral-500 uppercase mb-1.5"
                >
                  시작 일시 <span className="text-red-500">*</span>
                </label>
                <input
                  id="startDateTime"
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="endDateTime"
                  className="block text-[11px] font-bold text-neutral-500 uppercase mb-1.5"
                >
                  마감 일시 <span className="text-red-500">*</span>
                </label>
                <input
                  id="endDateTime"
                  type="datetime-local"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 최종 발표일시 */}
          <div>
            <label
              htmlFor="announcementDateTime"
              className="block text-xs font-extrabold text-neutral-700 uppercase tracking-wider mb-2"
            >
              최종 합격 발표 일시 <span className="text-neutral-400 font-normal">(선택)</span>
            </label>
            <input
              id="announcementDateTime"
              type="datetime-local"
              value={announcementDateTime}
              onChange={(e) => setAnnouncementDateTime(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              최종 발표일로부터 6주 후 개인정보 보호를 위한 지원자 데이터 파기가 가능해집니다.
            </p>
          </div>

          {/* 하단 버튼 */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-neutral-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              공고 등록
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
