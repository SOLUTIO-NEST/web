import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Edit2, Loader2, Sparkles, AlertCircle, MessageSquare } from "lucide-react";
import { recruitmentService } from "@/services/api";
import type { RecruitmentResponseDto, RecruitmentStatus } from "@/services/types";
import { toast } from "@/components/ui/toastStore";
import { getErrorMessage } from "@/utils/error";
import {
  formatToDatetimeLocal,
  formatToApiDateTime,
} from "../utils/recruitment";

interface Props {
  isOpen: boolean;
  recruitment: RecruitmentResponseDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RecruitmentEditModal({
  isOpen,
  recruitment,
  onClose,
  onSuccess,
}: Props) {
  const [title, setTitle] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [announcementDateTime, setAnnouncementDateTime] = useState("");
  const [status, setStatus] = useState<RecruitmentStatus>("OPEN");
  const [passedMessage, setPassedMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (recruitment) {
      setTitle(recruitment.title || "");
      setStartDateTime(formatToDatetimeLocal(recruitment.startDateTime));
      setEndDateTime(formatToDatetimeLocal(recruitment.endDateTime));
      setAnnouncementDateTime(formatToDatetimeLocal(recruitment.announcementDateTime));
      setStatus(recruitment.status || "OPEN");
      setPassedMessage("");
      setErrorMessage(null);
    }
  }, [recruitment]);

  if (!isOpen || !recruitment) return null;

  const extendDays = (days: number) => {
    const currentEnd = endDateTime ? new Date(endDateTime) : new Date();
    const newEnd = new Date(currentEnd.getTime() + days * 24 * 60 * 60 * 1000);
    newEnd.setHours(23, 59, 0, 0);
    setEndDateTime(formatToDatetimeLocal(newEnd));
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

    if (passedMessage.length > 1024) {
      setErrorMessage("합격 메시지는 최대 1024자까지 입력 가능합니다.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await recruitmentService.update(recruitment.id, {
        title: title.trim(),
        startDateTime: formatToApiDateTime(startDateTime),
        endDateTime: formatToApiDateTime(endDateTime),
        announcementDateTime: announcementDateTime ? formatToApiDateTime(announcementDateTime) : null,
        status,
        ...(passedMessage.trim() ? { passedMessage: passedMessage.trim() } : {}),
      });

      toast.success("모집 공고가 성공적으로 수정되었습니다.");
      onSuccess();
      onClose();
    } catch (e: unknown) {
      console.error("Failed to update recruitment:", e);
      const msg = getErrorMessage(e, "모집 공고 수정에 실패했습니다.");
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
            <Edit2 size={18} className="text-purple-400" />
            <h2 className="text-lg font-black tracking-tight">
              모집 공고 수정 <span className="text-xs font-normal text-neutral-400 font-mono">#{recruitment.id}</span>
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
              htmlFor="edit-title"
              className="block text-xs font-extrabold text-neutral-700 uppercase tracking-wider mb-2"
            >
              공고 제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              placeholder="공고 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors font-medium"
            />
          </div>

          {/* 상태 변경 */}
          <div>
            <label
              htmlFor="edit-status"
              className="block text-xs font-extrabold text-neutral-700 uppercase tracking-wider mb-2"
            >
              모집 상태 (Status) <span className="text-red-500">*</span>
            </label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as RecruitmentStatus)}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 text-xs font-bold text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
            >
              <option value="UPCOMING">UPCOMING (모집 예정)</option>
              <option value="OPEN">OPEN (진행중 - 지원서 접수 가능)</option>
              <option value="CLOSED">CLOSED (종료 / 마감)</option>
            </select>
            <p className="text-[11px] text-neutral-400 mt-1">
              상태를 강제로 변경하거나 일정에 따라 제어할 수 있습니다.
            </p>
          </div>

          {/* 기간 설정 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">
                모집 기간 변경
              </span>
              <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                <Sparkles size={12} className="text-purple-600" />
                마감일 연장
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                type="button"
                onClick={() => extendDays(3)}
                className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded transition-colors border border-neutral-200"
              >
                + 3일 연장
              </button>
              <button
                type="button"
                onClick={() => extendDays(7)}
                className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded transition-colors border border-neutral-200"
              >
                + 7일 연장
              </button>
              <button
                type="button"
                onClick={() => extendDays(14)}
                className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded transition-colors border border-neutral-200"
              >
                + 14일 연장
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="edit-startDateTime"
                  className="block text-[11px] font-bold text-neutral-500 uppercase mb-1.5"
                >
                  시작 일시 <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-startDateTime"
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-endDateTime"
                  className="block text-[11px] font-bold text-neutral-500 uppercase mb-1.5"
                >
                  마감 일시 <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-endDateTime"
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
              htmlFor="edit-announcementDateTime"
              className="block text-xs font-extrabold text-neutral-700 uppercase tracking-wider mb-2"
            >
              최종 합격 발표 일시 <span className="text-neutral-400 font-normal">(선택)</span>
            </label>
            <input
              id="edit-announcementDateTime"
              type="datetime-local"
              value={announcementDateTime}
              onChange={(e) => setAnnouncementDateTime(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
            />
          </div>

          {/* 합격 안내 메시지 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="edit-passedMessage"
                className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5"
              >
                <MessageSquare size={14} className="text-purple-600" />
                합격 안내 메시지 <span className="text-neutral-400 font-normal">(선택)</span>
              </label>
              <span className={`text-[10px] font-mono ${passedMessage.length > 1000 ? 'text-red-500 font-bold' : 'text-neutral-400'}`}>
                {passedMessage.length} / 1024자
              </span>
            </div>
            <textarea
              id="edit-passedMessage"
              rows={3}
              maxLength={1024}
              placeholder="지원자가 로그인 후 결과 조회 시 노출될 안내 메시지 (예: 단톡방 초대 링크, OT 일정 등)"
              value={passedMessage}
              onChange={(e) => setPassedMessage(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors resize-none"
            />
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
              수정 저장
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
