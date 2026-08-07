import type { BlacklistResponseDto } from "@/services/types";
import { Edit2, Trash2, ShieldAlert } from "lucide-react";

interface Props {
  blacklists: BlacklistResponseDto[];
  loading: boolean;
  onViewDetail: (item: BlacklistResponseDto) => void;
  onEditReason: (item: BlacklistResponseDto) => void;
  onDelete: (item: BlacklistResponseDto) => void;
}

export default function BlacklistTable({
  blacklists,
  loading,
  onViewDetail,
  onEditReason,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="bg-white border border-neutral-200 overflow-hidden shadow-sm">
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-red-500 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-neutral-400">
            블랙리스트 목록을 불러오는 중...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50/50">
            <tr>
              <Th>이름 / 학과</Th>
              <Th>학번</Th>
              <Th>등록 일시</Th>
              <Th align="right">관리</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {blacklists.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-neutral-50/80 transition-colors group cursor-pointer"
                onClick={() => onViewDetail(item)}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">
                      {item.name ? item.name.charAt(0) : "차"}
                    </div>
                    <div>
                      <span className="font-bold text-neutral-900 group-hover:text-black">
                        {item.name || "미등록/탈퇴 사용자"}
                      </span>
                      <span className="block text-xs text-neutral-400 mt-0.5">
                        {item.department || "학과 정보 없음"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="font-mono text-xs font-semibold text-neutral-700 bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded inline-block">
                    {item.studentId}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-neutral-500 font-medium">
                  {item.createdAt ? new Date(item.createdAt).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }) : "-"}
                </td>
                <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEditReason(item)}
                      className="p-2 hover:bg-neutral-100 text-neutral-500 hover:text-amber-600 transition-colors rounded"
                      title="사유 수정"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="p-2 hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors rounded"
                      title="블랙리스트 해제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {blacklists.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert size={36} className="text-neutral-300 stroke-[1.5]" />
                    <p className="text-neutral-500 font-semibold text-sm">
                      등록된 블랙리스트 대상자가 없습니다.
                    </p>
                    <p className="text-xs text-neutral-400">
                      새로운 차단 대상자가 있는 경우 우측 상단의 등록 버튼을 이용해주세요.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <th
      className={`px-5 py-3.5 text-[11px] font-extrabold tracking-[0.15em] text-neutral-400 uppercase ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}
