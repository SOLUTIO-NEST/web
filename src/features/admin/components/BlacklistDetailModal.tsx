import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X, ShieldAlert, Edit2, Trash2, Mail, Phone, Calendar, BookOpen, type LucideIcon } from "lucide-react";
import { blacklistService } from "@/services/api";
import type { BlacklistDetailResponseDto } from "@/services/types";
import { toast } from "@/components/ui/toastStore";
import { getErrorMessage } from "@/utils/error";

interface Props {
  blacklistId: number;
  onClose: () => void;
  onEditReason: (detail: BlacklistDetailResponseDto) => void;
  onDelete: (id: number) => void;
}

export default function BlacklistDetailModal({
  blacklistId,
  onClose,
  onEditReason,
  onDelete,
}: Props) {
  const [detail, setDetail] = useState<BlacklistDetailResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blacklistService.getDetail(blacklistId);
      setDetail(data);
    } catch (e: unknown) {
      console.error(e);
      const msg = getErrorMessage(e, "상세 정보를 불러올 수 없습니다.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [blacklistId]);


  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

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

      {/* 모달 박스 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white w-full max-w-xl shadow-2xl border border-neutral-200 overflow-hidden z-10"
      >
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <ShieldAlert size={20} className="text-red-400" />
            <h2 className="text-lg font-black tracking-tight">블랙리스트 상세 정보</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 바디 */}
        <div className="p-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-neutral-200 border-t-red-500 rounded-full animate-spin" />
              <span className="text-xs text-neutral-400 font-semibold">불러오는 중...</span>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 font-semibold text-sm">
              {error}
            </div>
          ) : detail ? (
            <div className="space-y-6">
              {/* 기본 프로필 카드 */}
              <div className="p-4 bg-red-50/50 border border-red-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                    학번 {detail.studentId}
                  </span>
                  <h3 className="text-xl font-black text-neutral-900 mt-1">
                    {detail.name || "미등록/알 수 없음"}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold tracking-widest text-red-600 bg-red-100 px-2.5 py-1 uppercase rounded-full">
                    차단 대상자
                  </span>
                </div>
              </div>

              {/* 상세 인포 그리드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem icon={BookOpen} label="학과" value={detail.department || "-"} />
                <InfoItem icon={Mail} label="이메일" value={detail.email || "-"} />
                <InfoItem icon={Phone} label="전화번호" value={detail.phoneNumber || "-"} />
                <InfoItem
                  icon={Calendar}
                  label="등록일시"
                  value={
                    detail.createdAt
                      ? new Date(detail.createdAt).toLocaleString("ko-KR")
                      : "-"
                  }
                />
              </div>

              {/* 차단 사유 */}
              <div>
                <label className="block text-xs font-extrabold text-neutral-500 uppercase tracking-wider mb-2">
                  블랙리스트 등록 사유
                </label>
                <div className="p-4 bg-neutral-50 border border-neutral-200 text-neutral-800 text-sm whitespace-pre-wrap leading-relaxed font-medium">
                  {detail.reason || "등록된 사유가 없습니다."}
                </div>
              </div>

              {/* 버튼 그룹 */}
              <div className="pt-4 flex items-center justify-between border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => onDelete(detail.id)}
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5 transition-colors border border-red-200"
                >
                  <Trash2 size={14} />
                  블랙리스트 해제
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEditReason(detail)}
                    className="px-4 py-2.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 size={14} />
                    사유 수정
                  </button>
                </div>
              </div>
            </div>
          ) : null}
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
    <div className="flex items-start gap-3 p-3 bg-neutral-50/70 border border-neutral-200/60">
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
