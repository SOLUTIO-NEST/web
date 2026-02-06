import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";
import { applicantService, recruitmentService } from "@/services/api";
import type { ApplicantResponseDto } from "@/services/types";
import { AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import ApplicationDetailModal from "../components/ApplicationDetailModal";
import ApplicationFilter from "../components/ApplicationFilter";
import ApplicationTable from "../components/ApplicationTable";
import Button from "@/components/ui/Button";

export default function ApplicationListPage() {
    const [applications, setApplications] = useState<ApplicantResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<ApplicantResponseDto | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState("ALL"); // ALL, PENDING, ACCEPTED, REJECTED
    const [currentRecruitmentId, setCurrentRecruitmentId] = useState<number | null>(null);

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setLoading(true);
        try {
            // First, get recruitment ID if not set
            let recruitmentId = currentRecruitmentId;
            if (!recruitmentId) {
                const recruitments = await recruitmentService.getAll();
                if (recruitments.length > 0) {
                    // Assuming the first one is the target or latest
                    recruitmentId = recruitments[recruitments.length - 1].id;
                    setCurrentRecruitmentId(recruitmentId);
                }
            }

            if (recruitmentId) {
                console.log("Fetching applicants for recruitmentId:", recruitmentId);
                const data = await applicantService.getList(recruitmentId, 0, 100);
                console.log("Fetched applications content:", data.content);
                setApplications(data?.content || []);
            }
        } catch (e: any) {
            console.error("Failed to load applications:", e);
            if (e.response) {
                console.error("Error Response Data:", e.response.data);
                console.error("Error Status:", e.response.status);
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (app: ApplicantResponseDto, explicitStatus?: boolean) => {
        let targetStatus: boolean;

        if (explicitStatus !== undefined) {
            targetStatus = explicitStatus;
        } else {
            // Toggle logic: null -> true, true -> false, false -> true
            if (app.isApprove === null) targetStatus = true;
            else if (app.isApprove === true) targetStatus = false;
            else targetStatus = true;
        }

        try {
            // Optimistic update
            setApplications(prev => prev.map(a =>
                a.studentId === app.studentId ? { ...a, isApprove: targetStatus } : a
            ));

            if (selectedApp && selectedApp.studentId === app.studentId) {
                setSelectedApp({ ...selectedApp, isApprove: targetStatus });
            }

            if (targetStatus) {
                await applicantService.approve(app.studentId);
            } else {
                await applicantService.reject(app.studentId);
            }
        } catch (e) {
            console.error(e);
            // revert on error
            loadApplications();
        }
    };

    const handleBulkProcess = async () => {
        if (selectedIds.size === 0 || !currentRecruitmentId) return;
        if (!confirm(`${selectedIds.size}명의 합격 처리를 진행하고 계정을 생성하시겠습니까?`)) return;

        setProcessing(true);
        try {
            await applicantService.batchCreateMember(currentRecruitmentId);
            const ids = Array.from(selectedIds);
            await Promise.all(ids.map(id => applicantService.approve(id)));

            await loadApplications();
            setSelectedIds(new Set());
            alert("처리가 완료되었습니다.");
        } catch (e: any) {
            console.error(e);
            let errorMessage = "처리 중 오류가 발생했습니다.";
            if (e.response) {
                errorMessage += `\n상태 코드: ${e.response.status}`;
                if (e.response.data && e.response.data.message) {
                    errorMessage += `\n메시지: ${e.response.data.message}`;
                } else if (e.response.data && e.response.data.detail) {
                    errorMessage += `\n상세: ${e.response.data.detail}`;
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
    }

    const filteredApps = applications.filter(app => {
        if (filter === 'ALL') return true;
        if (filter === 'ACCEPTED') return app.isApprove === true;
        if (filter === 'REJECTED') return app.isApprove === false;
        if (filter === 'PENDING') return app.isApprove === null;
        return true;
    });

    const toggleAll = () => {
        if (selectedIds.size === filteredApps.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredApps.map(a => a.studentId)));
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-24 pb-12">
                <Container>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900">신청 관리</h1>
                            <p className="text-neutral-500 mt-1">
                                들어온 입단 신청서를 검토하고 관리합니다.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleBulkProcess}
                                disabled={selectedIds.size === 0 || processing}
                                className="flex items-center gap-2"
                            >
                                {processing ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                <span>{selectedIds.size}명 일괄 합격</span>
                            </Button>
                        </div>
                    </div>

                    <ApplicationFilter
                        filter={filter}
                        setFilter={setFilter}
                        applications={applications}
                    />

                    <ApplicationTable
                        applications={filteredApps}
                        loading={loading}
                        selectedIds={selectedIds}
                        onToggleSelection={toggleSelection}
                        onToggleAll={toggleAll}
                        onSelectApp={setSelectedApp}
                        onToggleStatus={toggleStatus}
                    />
                </Container>
            </div>

            <AnimatePresence>
                {selectedApp && (
                    <ApplicationDetailModal
                        app={selectedApp}
                        onClose={() => setSelectedApp(null)}
                        onUpdateStatus={(status) => {
                            toggleStatus(selectedApp, status);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
