import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import { applicantService, recruitmentService } from "@/services/api";
import type { ApplicantResponseDto, PassStatus, RecruitmentResponseDto } from "@/services/types";
import { toast } from "@/components/ui/toastStore";
import { getErrorMessage } from "@/utils/error";
import { AnimatePresence } from "framer-motion";
import { Loader2, Users, CalendarDays, ShieldCheck } from "lucide-react";
import AdminSubNav from "../components/AdminSubNav";
import ApplicationDetailModal from "../components/ApplicationDetailModal";
import ApplicationFilter from "../components/ApplicationFilter";
import ApplicationTable from "../components/ApplicationTable";
import { getRecruitmentStatus } from "../utils/recruitment";

export default function ApplicationListPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [recruitments, setRecruitments] = useState<RecruitmentResponseDto[]>([]);
  const [applications, setApplications] = useState<ApplicantResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ApplicantResponseDto | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("ALL");
  const [currentRecruitmentId, setCurrentRecruitmentId] = useState<number | null>(() => {
    const q = searchParams.get("recruitmentId");
    return q ? Number(q) : null;
  });
  const [processing, setProcessing] = useState(false);

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

  // Load recruitment list initially
  useEffect(() => {
    const initRecruitments = async () => {
      try {
        const list = await recruitmentService.getAll(0, 100);
        // Sort newest first
        const sorted = [...list].sort((a, b) => {
          const timeA = new Date(a.startDateTime).getTime() || 0;
          const timeB = new Date(b.startDateTime).getTime() || 0;
          return timeB - timeA || b.id - a.id;
        });
        setRecruitments(sorted);
        const queryId = searchParams.get("recruitmentId");
        if (queryId) {
          setCurrentRecruitmentId(Number(queryId));
        } else if (sorted.length > 0 && currentRecruitmentId === null) {
          // Default to latest recruitment
          setCurrentRecruitmentId(sorted[0].id);
        }
      } catch (e) {
        console.error("Failed to load recruitments:", e);
      }
    };
    if (user && !isAuthLoading && user.role !== "USER" && user.role !== "GUEST") {
      initRecruitments();
    }
  }, [user, isAuthLoading, currentRecruitmentId, searchParams]);

  const loadApplications = useCallback(async () => {
    if (!currentRecruitmentId) return;
    setLoading(true);
    try {
      const data = await applicantService.getList(currentRecruitmentId, 0, 100);
      const items = data?.contents || data?.content || [];
      setApplications(items);
    } catch (e: unknown) {
      console.error("Failed to load applications:", e);
      toast.error(getErrorMessage(e, "지원자 목록을 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  }, [currentRecruitmentId]);

  useEffect(() => {
    if (user && !isAuthLoading && user.role !== "USER" && user.role !== "GUEST") {
      loadApplications();
    }
  }, [user, isAuthLoading, loadApplications]);

  const currentRecruitment = recruitments.find((r) => r.id === currentRecruitmentId);

  const toggleStatus = async (app: ApplicantResponseDto, explicitStatus?: PassStatus) => {
    let targetStatus: PassStatus;
    if (explicitStatus !== undefined) {
      targetStatus = explicitStatus;
    } else {
      if (app.passStatus === "PENDING") targetStatus = "APPROVED";
      else if (app.passStatus === "APPROVED") targetStatus = "REJECTED";
      else targetStatus = "APPROVED";
    }
    try {
      setApplications((prev) =>
        prev.map((a) => (a.studentId === app.studentId ? { ...a, passStatus: targetStatus } : a))
      );
      if (selectedApp && selectedApp.studentId === app.studentId) {
        setSelectedApp({ ...selectedApp, passStatus: targetStatus });
      }
      if (targetStatus === "APPROVED") {
        await applicantService.approve(app.studentId);
        toast.success(`${app.name} 지원자가 합격 처리되었습니다.`);
      } else if (targetStatus === "REJECTED") {
        await applicantService.reject(app.studentId);
        toast.info(`${app.name} 지원자가 불합격 처리되었습니다.`);
      }
    } catch (e) {
      console.error(e);
      toast.error(getErrorMessage(e, "지원자 상태 변경에 실패했습니다."));
      loadApplications();
    }
  };

  const updateClassLevel = async (studentId: string, classLevel: string | null) => {
    try {
      await applicantService.updateClassLevel(studentId, classLevel);
      setApplications((prev) =>
        prev.map((a) => (a.studentId === studentId ? { ...a, classLevel } : a))
      );
      if (selectedApp?.studentId === studentId) {
        setSelectedApp((prev) => (prev ? { ...prev, classLevel } : null));
      }
      toast.success("반 배정이 변경되었습니다.");
    } catch (e) {
      console.error(e);
      toast.error(getErrorMessage(e, "반 배정 변경에 실패했습니다."));
    }
  };

  const handleBulkProcess = async () => {
    if (selectedIds.size === 0 || !currentRecruitmentId) return;
    if (!confirm(`${selectedIds.size}명의 합격 처리를 진행하고 계정을 생성하시겠습니까?`)) return;
    setProcessing(true);
    try {
      await applicantService.batchCreateMember(currentRecruitmentId);
      const ids = Array.from(selectedIds);
      await Promise.all(ids.map((id) => applicantService.approve(id)));
      await loadApplications();
      setSelectedIds(new Set());
      toast.success("선택한 지원자의 승인 및 계정 생성이 완료되었습니다.");
    } catch (e: unknown) {
      console.error(e);
      toast.error(getErrorMessage(e, "일괄 처리에 실패했습니다."));
    } finally {
      setProcessing(false);
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const filteredApps = applications.filter((app) => {
    if (filter === "ALL") return true;
    if (filter === "PENDING") return app.passStatus === "PENDING";
    if (filter === "APPROVED" || filter === "ACCEPTED") return app.passStatus === "APPROVED";
    if (filter === "REJECTED") return app.passStatus === "REJECTED";
    if (filter === "UNASSIGNED_CLASS") {
      if (!app.classLevel || app.classLevel === "미정" || app.classLevel === "미배정") return true;
      const upper = app.classLevel.toUpperCase();
      return !["SEED", "BRANCH", "TREE"].includes(upper);
    }
    return true;
  });

  const toggleAll = () => {
    if (selectedIds.size === filteredApps.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredApps.map((a) => a.studentId)));
    }
  };

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
              <Users className="text-neutral-900" size={36} />
              신청 관리
            </h1>
            <p className="text-sm font-medium text-neutral-500 mt-2">
              들어온 입단 신청서를 검토하고 관리합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={handleBulkProcess}
            disabled={selectedIds.size === 0 || processing}
            className="px-5 py-2.5 bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
          >
            {processing ? <Loader2 className="animate-spin" size={16} /> : null}
            {selectedIds.size}명 일괄 합격
          </button>
        </div>

        <AdminSubNav />

        {/* 모집 공고 선택 바 */}
        {recruitments.length > 0 && (
          <div className="bg-white border border-neutral-200 px-4 py-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-purple-600" />
              <span className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">
                선택된 모집 공고
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={currentRecruitmentId ?? ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCurrentRecruitmentId(val);
                  setSearchParams({ recruitmentId: String(val) });
                }}
                className="w-full sm:w-80 px-3 py-1.5 bg-neutral-50 border border-neutral-300 text-xs font-bold text-neutral-900 focus:outline-none focus:border-black transition-colors"
              >
                {recruitments.map((r) => {
                  const s = getRecruitmentStatus(r.startDateTime, r.endDateTime, r.status);
                  return (
                    <option key={r.id} value={r.id}>
                      #{r.id} - {r.title} [{s.label}] {r.isApplicantDataPurged ? "(파기됨)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        )}

        {/* 파기 완료 알림 배너 */}
        {currentRecruitment?.isApplicantDataPurged && (
          <div className="mb-4 p-4 bg-neutral-900 text-white border border-neutral-800 flex items-center gap-3">
            <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold block">개인정보 파기 완료 공고</span>
              <span className="text-neutral-300">
                선택된 #{currentRecruitment.id} 공고의 지원자 개인정보는 개인정보 보호 정책에 따라 이미 파기되었습니다.
              </span>
            </div>
          </div>
        )}

        <ApplicationFilter filter={filter} setFilter={setFilter} applications={applications} />

        <ApplicationTable
          applications={filteredApps}
          loading={loading}
          selectedIds={selectedIds}
          onToggleSelection={toggleSelection}
          onToggleAll={toggleAll}
          onSelectApp={setSelectedApp}
          onToggleStatus={toggleStatus}
        />
      </div>

      <AnimatePresence>
        {selectedApp && (
          <ApplicationDetailModal
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            onUpdateStatus={(status) => toggleStatus(selectedApp, status)}
            onUpdateClassLevel={(classLevel) => updateClassLevel(selectedApp.studentId, classLevel)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
