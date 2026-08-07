import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Edit2, Loader2 } from "lucide-react";
import { blacklistService } from "@/services/api";

interface Props {
  isOpen: boolean;
  blacklistId: number;
  currentReason: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BlacklistEditModal({
  isOpen,
  blacklistId,
  currentReason,
  onClose,
  onSuccess,
}: Props) {
  const [reason, setReason] = useState(currentReason);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReason(currentReason);
  }, [currentReason]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("블랙리스트 사유를 입력하세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await blacklistService.updateReason(blacklistId, {
        reason: reason.trim(),
      });
      alert("사유가 변경되었습니다.");
      onSuccess();
      onClose();
    } catch (e: unknown) {
      console.error(e);
      setError("사유 수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 오버레이 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* 모달 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white w-full max-w-lg shadow-2xl border border-neutral-200 overflow-hidden z-10"
      >
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2">
            <Edit2 size={18} className="text-amber-400" />
            <h2 className="text-lg font-black tracking-tight">블랙리스트 사유 수정</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="editReason" className="block text-xs font-extrabold text-neutral-700 uppercase tracking-wider mb-2">
              수정할 사유 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="editReason"
              rows={4}
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
              className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              저장
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
