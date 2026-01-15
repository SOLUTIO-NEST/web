import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";
import { api, type Application } from "@/services/api";
import { AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import ApplicationDetailModal from "../components/ApplicationDetailModal";
import ApplicationFilter from "../components/ApplicationFilter";
import ApplicationTable from "../components/ApplicationTable";
import Button from "@/components/ui/Button";

export default function ApplicationListPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState("ALL"); // ALL, PENDING, ACCEPTED, REJECTED

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const data = await api.getApplications();
            setApplications(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (app: Application) => {
        const newStatus = app.status === 'ACCEPTED' ? 'REJECTED' : 'ACCEPTED';
        // If it was PENDING, toggle to ACCEPTED first
        const targetStatus = app.status === 'PENDING' ? 'ACCEPTED' : newStatus;

        try {
            setApplications(prev => prev.map(a =>
                a.id === app.id ? { ...a, status: targetStatus } : a
            ));
            await api.updateApplicationStatus(app.id, targetStatus);
        } catch (e) {
            console.error(e);
            // revert on error
            loadApplications();
        }
    };

    const handleBulkProcess = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`${selectedIds.size}명의 합격 처리를 진행하고 계정을 생성하시겠습니까?`)) return;

        setProcessing(true);
        try {
            await api.processApplications(Array.from(selectedIds), 'APPROVE_AND_NOTIFY');
            await loadApplications();
            setSelectedIds(new Set());
            alert("처리가 완료되었습니다.");
        } catch (e) {
            alert("처리 중 오류가 발생했습니다.");
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
        return app.status === filter;
    });

    const toggleAll = () => {
        if (selectedIds.size === filteredApps.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredApps.map(a => a.id)));
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
                                <span>{selectedIds.size}명 일괄 합격/계정생성</span>
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
                            toggleStatus({ ...selectedApp, status });
                            setSelectedApp({ ...selectedApp, status });
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
