import { useState, useEffect } from "react";
import { type ApplicantResponseDto } from "@/services/types";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const CLASS_LEVELS = [
  { value: "", label: "미정" },
  { value: "SEED", label: "Seed" },
  { value: "BRANCH", label: "Branch" },
  { value: "TREE", label: "Tree" },
] as const;

function normalizeClassLevel(raw: string | null | undefined): string {
  if (!raw || raw === "미정") return "";
  const upper = raw.toUpperCase();
  if (["SEED", "BRANCH", "TREE"].includes(upper)) return upper;
  const map: Record<string, string> = { Seed: "SEED", Branch: "BRANCH", Tree: "TREE" };
  return map[raw] ?? "";
}

interface Props {
  app: ApplicantResponseDto;
  onClose: () => void;
  onUpdateStatus: (isApprove: boolean) => void;
  onUpdateClassLevel: (classLevel: string | null) => void;
}

export default function ApplicationDetailModal({
  app,
  onClose,
  onUpdateStatus,
  onUpdateClassLevel,
}: Props) {
  const [detail, setDetail] = useState<ApplicantResponseDto & { isLoading?: boolean }>({
    ...app,
    isLoading: true,
  });
  const [selectedLevel, setSelectedLevel] = useState<string>(normalizeClassLevel(app.classLevel));

  useEffect(() => {
    setDetail((prev) => ({ ...prev, isApprove: app.isApprove }));
  }, [app.isApprove]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const fullData = await import("@/services/api").then((m) =>
          m.applicantService.getDetail(app.studentId)
        );
        setDetail({ ...fullData, isLoading: false });
        setSelectedLevel(normalizeClassLevel(fullData.classLevel));
      } catch (e) {
        console.error("Failed to fetch detail", e);
        setDetail((prev) => ({ ...prev, isLoading: false }));
      }
    };
    fetchDetail();
  }, [app.studentId]);

  const statusLabel =
    detail.isApprove === true ? "합격" : detail.isApprove === false ? "불합격" : "대기중";
  const statusStyle =
    detail.isApprove === true
      ? "border-green-400 text-green-700 bg-green-50"
      : detail.isApprove === false
        ? "border-red-300 text-red-600 bg-red-50"
        : "border-neutral-300 text-neutral-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* 헤더 */}
        <div className="px-5 md:px-8 py-5 border-b border-neutral-200 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 block mb-1">
                APPLICANT DETAIL
              </span>
              <h2 className="text-2xl font-black tracking-tighter text-neutral-900">
                {detail.name}
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm text-neutral-500 font-medium">{detail.department}</span>
                <span className="text-neutral-300">|</span>
                <span className="text-sm text-neutral-500 font-mono">{detail.studentId}</span>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 text-[10px] font-bold tracking-widest border shrink-0 ${statusStyle}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-5 space-y-5">
          {detail.isLoading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-500 rounded-full animate-spin" />
              <span className="text-sm font-semibold text-neutral-400">불러오는 중...</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="EMAIL" value={detail.email || "-"} />
            <InfoItem label="PHONE" value={detail.phoneNumber || detail.phone || "-"} />
            <InfoItem label="BAEKJOON" value={detail.bojId || detail.baekjoonId || "-"} />
            <InfoItem label="LANGUAGE" value={detail.mainLanguage || detail.language || "-"} />
            <InfoItem
              label="APPLIED"
              value={detail.createdAt ? new Date(detail.createdAt).toLocaleDateString() : "-"}
            />
            <InfoItem
              label="CLASS"
              value={
                CLASS_LEVELS.find((l) => l.value === normalizeClassLevel(detail.classLevel))
                  ?.label ?? "미정"
              }
            />
          </div>

          <div className="border-t border-neutral-200 pt-5">
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 block mb-3">
              MOTIVATION
            </span>
            <div className="bg-neutral-50 border border-neutral-200 p-4 text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
              {detail.applyReason || detail.motivation || "작성된 지원 동기가 없습니다."}
            </div>
          </div>
        </div>

        {/* 하단 */}
        <div className="px-5 md:px-8 py-4 border-t border-neutral-200 shrink-0 space-y-3">
          {/* 반 배정 */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full appearance-none border border-neutral-300 bg-white px-3 py-2 pr-8 text-sm font-medium outline-none focus:border-black transition-colors"
              >
                {CLASS_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              />
            </div>
            <button
              type="button"
              onClick={() => onUpdateClassLevel(selectedLevel === "" ? null : selectedLevel)}
              className="px-4 py-2 border border-neutral-300 text-sm font-bold hover:bg-neutral-50 transition-colors shrink-0"
            >
              반 저장
            </button>
          </div>

          {/* 합격/불합격 + 닫기 */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-300">
              SOLUTIO NEST
            </span>
            <div className="flex items-center gap-2">
              {detail.isApprove !== false && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(false)}
                  className="px-4 py-2 border border-neutral-300 text-sm font-bold text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                  불합격
                </button>
              )}
              {detail.isApprove !== true && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(true)}
                  className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-800 transition-colors"
                >
                  합격
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-neutral-300 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 border-b border-neutral-100">
      <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 block mb-1">
        {label}
      </span>
      <span className="text-sm font-bold text-neutral-900">{value}</span>
    </div>
  );
}
