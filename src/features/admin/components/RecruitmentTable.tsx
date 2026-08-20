import { Link } from "react-router-dom";
import type { RecruitmentResponseDto } from "@/services/types";
import { CalendarDays, Edit2, Trash2, Users, ShieldCheck } from "lucide-react";
import {
  getRecruitmentStatus,
  formatDateTimeDisplay,
  calculateDuration,
} from "../utils/recruitment";

interface Props {
  recruitments: RecruitmentResponseDto[];
  loading: boolean;
  onViewDetail: (item: RecruitmentResponseDto) => void;
  onEdit: (item: RecruitmentResponseDto) => void;
  onDelete: (item: RecruitmentResponseDto) => void;
}

export default function RecruitmentTable({
  recruitments,
  loading,
  onViewDetail,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="bg-white border border-neutral-200 overflow-hidden shadow-sm">
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-purple-600 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-neutral-400">
            모집 공고 목록을 불러오는 중...
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
              <Th>공고명 / ID</Th>
              <Th>모집 일정</Th>
              <Th>발표 일정</Th>
              <Th>상태</Th>
              <Th align="right">관리 및 바로가기</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {recruitments.map((item) => {
              const status = getRecruitmentStatus(
                item.startDateTime,
                item.endDateTime,
                item.status
              );
              const duration = calculateDuration(item.startDateTime, item.endDateTime);

              return (
                <tr
                  key={item.id}
                  className="hover:bg-neutral-50/80 transition-colors group cursor-pointer"
                  onClick={() => onViewDetail(item)}
                >
                  {/* 공고명 & ID */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded flex items-center justify-center font-bold text-sm shrink-0 border ${
                          status.type === "OPEN"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-neutral-100 text-neutral-600 border-neutral-200"
                        }`}
                      >
                        <CalendarDays size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900 group-hover:text-black">
                            {item.title}
                          </span>
                          <span className="font-mono text-[10px] font-semibold text-neutral-500 bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded">
                            #{item.id}
                          </span>
                          {item.isApplicantDataPurged && (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded"
                              title="지원자 개인정보 데이터 파기 완료"
                            >
                              <ShieldCheck size={11} />
                              파기완료
                            </span>
                          )}
                        </div>
                        <span className="block text-xs text-neutral-400 mt-0.5">
                          총 모집 기간: {duration}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 모집 일정 */}
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[10px] font-extrabold tracking-wider text-neutral-400 w-10">
                          시작
                        </span>
                        <span className="font-medium text-neutral-800">
                          {formatDateTimeDisplay(item.startDateTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[10px] font-extrabold tracking-wider text-neutral-400 w-10">
                          마감
                        </span>
                        <span className="font-medium text-neutral-800">
                          {formatDateTimeDisplay(item.endDateTime)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 발표 일정 */}
                  <td className="px-5 py-4">
                    <div className="text-xs">
                      {item.announcementDateTime ? (
                        <span className="font-medium text-neutral-800">
                          {formatDateTimeDisplay(item.announcementDateTime)}
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-xs">-</span>
                      )}
                    </div>
                  </td>

                  {/* 상태 뱃지 */}
                  <td className="px-5 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold border rounded-full shrink-0 shadow-2xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
                      <span className={status.badgeClass.split(" ")[0]}>{status.label}</span>
                    </div>
                  </td>

                  {/* 관리 버튼 */}
                  <td
                    className="px-5 py-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/admin/applications?recruitmentId=${item.id}`}
                        className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors rounded flex items-center gap-1 border border-neutral-200"
                        title="해당 모집 지원자 목록 보기"
                      >
                        <Users size={14} className="text-neutral-500" />
                        <span>지원자</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1.5 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors rounded border border-transparent hover:border-neutral-200"
                        title="공고 수정"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="p-1.5 hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors rounded border border-transparent hover:border-red-200"
                        title="공고 삭제"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {recruitments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <CalendarDays
                      size={36}
                      className="text-neutral-300 stroke-[1.5]"
                    />
                    <p className="text-neutral-500 font-semibold text-sm">
                      등록된 모집 공고가 없습니다.
                    </p>
                    <p className="text-xs text-neutral-400">
                      우측 상단의 '+ 새 공고 등록' 버튼을 눌러 새 모집 일정을 생성하세요.
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

function Th({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "right";
}) {
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
