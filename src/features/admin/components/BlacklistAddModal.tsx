import { useState } from "react";
import { motion } from "framer-motion";
import { X, ShieldAlert, Loader2 } from "lucide-react";
import { blacklistService } from "@/services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BlacklistAddModal({ isOpen, onClose, onSuccess }: Props) {
  const [studentId, setStudentId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setErrorMessage("학번을 입력해주세요.");
      return;
    }
    if (!reason.trim()) {
      setErrorMessage("블랙리스트 등록 사유를 입력해주세요.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await blacklistService.add({
        studentId: studentId.trim(),
        reason: reason.trim(),
      });
      alert("블랙리스트 대상자가 성공적으로 등록되었습니다.");
      setStudentId("");
      setReason("");
      onSuccess();
      onClose();
    } catch (e: unknown) {
      console.error(e);
      let msg = "등록 중 오류가 발생했습니다.";
      if (e && typeof e === "object" && "response" in e) {
        const res = (e as { response?: { data?: { message?: string } } }).response;
        if (res?.data?.message) {
          msg = res.data.message;
        }
      }
      setErrorMessage(msg);
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

      {/* 모달 컨텐츠 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white w-full max-w-lg shadow-2xl border border-neutral-200 overflow-hidden z-10"
      >
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <ShieldAlert size={20} className="text-red-400" />
            <h2 className="text-lg font-black tracking-tight">블랙리스트 등록</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded">
              {errorMessage}
            </div>
          )}

          <div>
            <label htmlFor="studentId" className="block text-xs font-extrabold text-neutral-700 uppercase tracking-wider mb-2">
              학번 <span className="text-red-500">*</span>
            </label>
            <input
              id="studentId"
              type="text"
              placeholder="예: 202412345"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 text-sm font-mono text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              제재 처리할 대상자의 학번을 정확하게 입력하세요.
            </p>
          </div>

          <div>
            <label htmlFor="reason" className="block text-xs font-extrabold text-neutral-700 uppercase tracking-wider mb-2">
              등록 사유 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              rows={4}
              placeholder="블랙리스트 등록 사유를 입력하세요 (예: 동아리 규정 위반, 무단 노쇼 등)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-100">
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
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              블랙리스트 추가
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
