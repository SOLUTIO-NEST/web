import { type ApplicantResponseDto } from "@/services/types";
import { Check, X, MoreHorizontal } from "lucide-react";

interface Props {
  applications: ApplicantResponseDto[];
  loading: boolean;
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onToggleAll: () => void;
  onSelectApp: (app: ApplicantResponseDto) => void;
  onToggleStatus: (app: ApplicantResponseDto) => void;
}

function StatusBadge({ isApprove }: { isApprove: boolean | null }) {
  if (isApprove === true)
    return (
      <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-widest border border-green-400 text-green-700 bg-green-50">
        합격
      </span>
    );
  if (isApprove === false)
    return (
      <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-widest border border-red-300 text-red-600 bg-red-50">
        불합격
      </span>
    );
  return (
    <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-widest border border-neutral-300 text-neutral-500">
      대기중
    </span>
  );
}

export default function ApplicationTable({
  applications,
  loading,
  selectedIds,
  onToggleSelection,
  onToggleAll,
  onSelectApp,
  onToggleStatus,
}: Props) {
  if (loading) {
    return (
      <div className="bg-white border border-neutral-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-500 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-neutral-400">불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200">
            <tr>
              <th className="px-5 py-3 w-12">
                <input
                  type="checkbox"
                  checked={applications.length > 0 && selectedIds.size === applications.length}
                  onChange={onToggleAll}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
              </th>
              <Th>이름 / 학과</Th>
              <Th>학번</Th>
              <Th>연락처</Th>
              <Th>비고</Th>
              <Th>상태</Th>
              <Th align="right">관리</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {applications.map((app) => {
              const status =
                app.isApprove === true ? "ACCEPTED" : app.isApprove === false ? "REJECTED" : "PENDING";
              return (
                <tr key={app.studentId} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(app.studentId)}
                      onChange={() => onToggleSelection(app.studentId)}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-neutral-900">{app.name}</span>
                    <span className="block text-xs text-neutral-400 mt-0.5">{app.department}</span>
                  </td>
                  <td className="px-5 py-4 text-neutral-600 font-mono text-xs">{app.studentId}</td>
                  <td className="px-5 py-4 text-neutral-600">{app.phoneNumber || app.phone}</td>
                  <td className="px-5 py-4">
                    <span className="text-neutral-400 text-xs">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                    {app.classLevel && app.classLevel !== "미정" && (
                      <span className="block mt-1 text-[10px] font-bold tracking-widest text-neutral-900 bg-neutral-100 px-2 py-0.5 w-fit">
                        {app.classLevel}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge isApprove={app.isApprove} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onSelectApp(app)}
                        className="p-2 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors"
                        title="상세보기"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleStatus(app)}
                        className={`p-2 transition-colors ${
                          status === "ACCEPTED"
                            ? "text-green-600 hover:bg-red-50 hover:text-red-600"
                            : "text-neutral-300 hover:bg-green-50 hover:text-green-600"
                        }`}
                        title={status === "ACCEPTED" ? "불합격 처리" : "합격 처리"}
                      >
                        {status === "ACCEPTED" ? <X size={16} /> : <Check size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {applications.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-neutral-400 font-medium">
                  신청 내역이 없습니다.
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
      className={`px-5 py-3 text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}
