import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import { applicantService, recruitmentService } from "@/services/api";
import type { ApplicantResponseDto, PassStatus } from "@/services/types";
import { AnimatePresence } from "framer-motion";
import { Loader2, Users } from "lucide-react";
import AdminSubNav from "../components/AdminSubNav";
import ApplicationDetailModal from "../components/ApplicationDetailModal";
import ApplicationFilter from "../components/ApplicationFilter";
import ApplicationTable from "../components/ApplicationTable";

export default function ApplicationListPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState<ApplicantResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ApplicantResponseDto | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("ALL");
  const [currentRecruitmentId, setCurrentRecruitmentId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

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
      loadApplications();
    }
  }, [user, isAuthLoading]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      let recruitmentId = currentRecruitmentId;
      if (!recruitmentId) {
        const recruitments = await recruitmentService.getAll();
        if (recruitments.length > 0) {
          recruitmentId = recruitments[recruitments.length - 1].id;
          setCurrentRecruitmentId(recruitmentId);
        }
      }
      if (recruitmentId) {
        const data = await applicantService.getList(recruitmentId, 0, 100);
        setApplications(data?.content || []);
      }
    } catch (e: any) {
      console.error("Failed to load applications:", e);
    } finally {
      setLoading(false);
    }
  };

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
      } else if (targetStatus === "REJECTED") {
        await applicantService.reject(app.studentId);
      }
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
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
      alert("처리가 완료되었습니다.");
    } catch (e: any) {
      console.error(e);
      let errorMessage = "처리 중 오류가 발생했습니다.";
      if (e.response) {
        if (e.response.status === 409) {
          errorMessage = "승인 실패 (409 CONFLICT): '합격(APPROVED)' 상태인 지원자만 계정 생성 승인이 가능합니다.";
        } else {
          errorMessage += `\n상태 코드: ${e.response.status}`;
          if (e.response.data?.message) errorMessage += `\n메시지: ${e.response.data.message}`;
          else if (e.response.data?.detail) errorMessage += `\n상세: ${e.response.data.detail}`;
        }
      }
      alert(errorMessage);
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
