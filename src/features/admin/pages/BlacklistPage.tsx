import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { blacklistService } from "@/services/api";
import type { BlacklistResponseDto, BlacklistDetailResponseDto } from "@/services/types";
import { AnimatePresence } from "framer-motion";
import { Plus, Search, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";
import AdminSubNav from "../components/AdminSubNav";
import BlacklistTable from "../components/BlacklistTable";
import BlacklistAddModal from "../components/BlacklistAddModal";
import BlacklistDetailModal from "../components/BlacklistDetailModal";
import BlacklistEditModal from "../components/BlacklistEditModal";

export default function BlacklistPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [blacklists, setBlacklists] = useState<BlacklistResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);
  const [editingTarget, setEditingTarget] = useState<{ id: number; reason: string } | null>(null);

  const loadBlacklists = useCallback(async () => {
    setLoading(true);
    try {
      const data = await blacklistService.getList(currentPage, pageSize);
      setBlacklists(data?.content || []);
      setTotalPages(data?.totalPages || 1);
      setTotalElements(data?.totalElements || (data?.content ? data.content.length : 0));
    } catch (e) {
      console.error("Failed to load blacklists:", e);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }
      if (user.role === "USER" || user.role === "GUEST") {
        alert("접근 권한이 없습니다.");
        navigate("/", { replace: true });
        return;
      }
    }
  }, [user, isAuthLoading, navigate]);

  useEffect(() => {
    if (user && !isAuthLoading && user.role !== "USER" && user.role !== "GUEST") {
      loadBlacklists();
    }
  }, [user, isAuthLoading, loadBlacklists]);

  const handleDelete = async (item: BlacklistResponseDto | { id: number; studentId?: string }) => {
    const studentInfo = item.studentId ? ` 학번: ${item.studentId}` : "";
    if (!confirm(`정말로 해당 대상자${studentInfo}를 블랙리스트에서 해제하시겠습니까?`)) {
      return;
    }
    try {
      await blacklistService.delete(item.id);
      alert("블랙리스트에서 해제되었습니다.");
      if (selectedDetailId === item.id) {
        setSelectedDetailId(null);
      }
      loadBlacklists();
    } catch (e) {
      console.error("Failed to delete blacklist:", e);
      alert("해제 처리 중 오류가 발생했습니다.");
    }
  };

  const filteredBlacklists = blacklists.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.studentId?.toLowerCase().includes(query) ||
      item.name?.toLowerCase().includes(query) ||
      item.department?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      <div className="max-w-screen-xl mx-auto px-5 md:px-10 py-8 md:py-12">
        {/* 헤더 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 block mb-2">
              ADMIN
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight flex items-center gap-3">
              <ShieldAlert className="text-red-600" size={36} />
              블랙리스트 관리
            </h1>
            <p className="text-sm font-medium text-neutral-500 mt-2">
              제재 처리되거나 차단된 사용자(학번)를 등록하고 사유를 관리합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={18} />
            블랙리스트 추가
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <AdminSubNav />

        {/* 필터 및 검색 바 */}
        <div className="bg-white border border-neutral-200 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="학번, 이름, 학과로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-black focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-bold text-neutral-500">
              총 <span className="text-red-600 font-extrabold">{totalElements}</span>명 등록됨
            </span>
          </div>
        </div>

        {/* 리스트 테이블 */}
        <BlacklistTable
          blacklists={filteredBlacklists}
          loading={loading}
          onViewDetail={(item) => setSelectedDetailId(item.id)}
          onEditReason={(item) =>
            setEditingTarget({ id: item.id, reason: "" })
          }
          onDelete={handleDelete}
        />

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              className="p-2 bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-neutral-600 px-3">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
              className="p-2 bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 모달 연동 */}
      <AnimatePresence>
        {isAddModalOpen && (
          <BlacklistAddModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={loadBlacklists}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDetailId !== null && (
          <BlacklistDetailModal
            blacklistId={selectedDetailId}
            onClose={() => setSelectedDetailId(null)}
            onEditReason={(detail: BlacklistDetailResponseDto) => {
              setSelectedDetailId(null);
              setEditingTarget({ id: detail.id, reason: detail.reason || "" });
            }}
            onDelete={(id: number) => {
              handleDelete({ id });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingTarget !== null && (
          <BlacklistEditModal
            isOpen={editingTarget !== null}
            blacklistId={editingTarget.id}
            currentReason={editingTarget.reason}
            onClose={() => setEditingTarget(null)}
            onSuccess={loadBlacklists}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
