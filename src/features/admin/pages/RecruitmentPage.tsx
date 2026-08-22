import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { recruitmentService } from "@/services/api";
import type { RecruitmentResponseDto } from "@/services/types";
import { toast } from "@/components/ui/toastStore";
import { getErrorMessage } from "@/utils/error";
import { AnimatePresence } from "framer-motion";
import { CalendarDays, Plus, Search, RefreshCw } from "lucide-react";
import AdminSubNav from "../components/AdminSubNav";
import RecruitmentTable from "../components/RecruitmentTable";
import { getRecruitmentStatus } from "../utils/recruitment";
import RecruitmentAddModal from "../components/RecruitmentAddModal";
import RecruitmentEditModal from "../components/RecruitmentEditModal";
import RecruitmentDetailModal from "../components/RecruitmentDetailModal";

type FilterType = "ALL" | "OPEN" | "UPCOMING" | "CLOSED";

export default function RecruitmentPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [recruitments, setRecruitments] = useState<RecruitmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<RecruitmentResponseDto | null>(null);
  const [editingTarget, setEditingTarget] = useState<RecruitmentResponseDto | null>(null);

  // Auth Guard
  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }
      if (user.role === "USER" || user.role === "GUEST") {
        toast.warning("접근 권한이 없습니다.");
        navigate("/", { replace: true });
        return;
      }
    }
  }, [user, isAuthLoading, navigate]);

  const loadRecruitments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await recruitmentService.getAll(0, 100);
      // Sort newest first by startDateTime or ID
      const sorted = [...data].sort((a, b) => {
        const timeA = new Date(a.startDateTime).getTime() || 0;
        const timeB = new Date(b.startDateTime).getTime() || 0;
        return timeB - timeA || b.id - a.id;
      });
      setRecruitments(sorted);
    } catch (e: unknown) {
      console.error("Failed to load recruitments:", e);
      toast.error(getErrorMessage(e, "모집 공고 목록을 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && !isAuthLoading && user.role !== "USER" && user.role !== "GUEST") {
      loadRecruitments();
    }
  }, [user, isAuthLoading, loadRecruitments]);

  const handleDelete = async (item: RecruitmentResponseDto) => {
    if (
      !confirm(
        `정말로 "${item.title}" (ID: #${item.id}) 모집 공고를 삭제하시겠습니까?\n해당 공고와 연관된 신청 내역이 있는 경우 주의가 필요합니다.`
      )
    ) {
      return;
    }

    try {
      await recruitmentService.delete(item.id);
      toast.success("모집 공고가 정상적으로 삭제되었습니다.");
      if (selectedDetail?.id === item.id) {
        setSelectedDetail(null);
      }
      loadRecruitments();
    } catch (e: unknown) {
      console.error("Failed to delete recruitment:", e);
      toast.error(getErrorMessage(e, "모집 공고 삭제 중 오류가 발생했습니다."));
    }
  };

  // Status counts based on server status & date
  const openCount = recruitments.filter(
    (r) => getRecruitmentStatus(r.startDateTime, r.endDateTime, r.status).type === "OPEN"
  ).length;

  const upcomingCount = recruitments.filter(
    (r) => getRecruitmentStatus(r.startDateTime, r.endDateTime, r.status).type === "UPCOMING"
  ).length;

  const closedCount = recruitments.filter(
    (r) => getRecruitmentStatus(r.startDateTime, r.endDateTime, r.status).type === "CLOSED"
  ).length;

  // Filtered recruitments
  const filteredRecruitments = recruitments.filter((item) => {
    const status = getRecruitmentStatus(item.startDateTime, item.endDateTime, item.status);
    if (filter !== "ALL" && status.type !== filter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchId = String(item.id).includes(q);
      return matchTitle || matchId;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      <div className="max-w-screen-xl mx-auto px-5 md:px-10 py-8 md:py-12">
        {/* 상단 헤더 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 block mb-2">
              ADMIN
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight flex items-center gap-3">
              <CalendarDays className="text-neutral-900" size={36} />
              모집 공고 관리
            </h1>
            <p className="text-sm font-medium text-neutral-500 mt-2">
              동아리 기수별 신규 부원 모집 일정 및 공고를 등록하고 관리합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={loadRecruitments}
              className="p-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-sm shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="새로고침"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={18} />
              새 공고 등록
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <AdminSubNav />

        {/* 필터 및 검색 바 */}
        <div className="bg-white border border-neutral-200 p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          {/* 상태 필터 버튼 */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 text-xs font-bold transition-all border ${
                filter === "ALL"
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-black"
              }`}
            >
              전체 ({recruitments.length})
            </button>

            <button
              type="button"
              onClick={() => setFilter("OPEN")}
              className={`px-3 py-1.5 text-xs font-bold transition-all border flex items-center gap-1.5 ${
                filter === "OPEN"
                  ? "bg-purple-700 text-white border-purple-700 shadow-xs"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-purple-300 hover:text-purple-700"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              진행 중 ({openCount})
            </button>

            <button
              type="button"
              onClick={() => setFilter("UPCOMING")}
              className={`px-3 py-1.5 text-xs font-bold transition-all border flex items-center gap-1.5 ${
                filter === "UPCOMING"
                  ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-amber-300 hover:text-amber-700"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              예정 ({upcomingCount})
            </button>

            <button
              type="button"
              onClick={() => setFilter("CLOSED")}
              className={`px-3 py-1.5 text-xs font-bold transition-all border flex items-center gap-1.5 ${
                filter === "CLOSED"
                  ? "bg-neutral-600 text-white border-neutral-600 shadow-xs"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              마감 ({closedCount})
            </button>
          </div>

          {/* 검색 인풋 */}
          <div className="relative w-full md:w-64">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="공고명 또는 ID 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* 테이블 목록 */}
        <RecruitmentTable
          recruitments={filteredRecruitments}
          loading={loading}
          onViewDetail={(item) => setSelectedDetail(item)}
          onEdit={(item) => setEditingTarget(item)}
          onDelete={handleDelete}
        />
      </div>

      {/* 새 공고 등록 모달 */}
      <AnimatePresence>
        {isAddModalOpen && (
          <RecruitmentAddModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={loadRecruitments}
          />
        )}
      </AnimatePresence>

      {/* 공고 상세 모달 */}
      <AnimatePresence>
        {selectedDetail !== null && (
          <RecruitmentDetailModal
            recruitment={selectedDetail}
            onClose={() => setSelectedDetail(null)}
            onEdit={(item) => {
              setSelectedDetail(null);
              setEditingTarget(item);
            }}
            onDelete={(item) => {
              handleDelete(item);
            }}
            onPurgeSuccess={() => {
              loadRecruitments();
            }}
          />
        )}
      </AnimatePresence>

      {/* 공고 수정 모달 */}
      <AnimatePresence>
        {editingTarget !== null && (
          <RecruitmentEditModal
            isOpen={editingTarget !== null}
            recruitment={editingTarget}
            onClose={() => setEditingTarget(null)}
            onSuccess={loadRecruitments}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
