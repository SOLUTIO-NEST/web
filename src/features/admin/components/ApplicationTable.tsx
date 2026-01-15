import { type Application } from "@/services/api";
import { Check, X, MoreHorizontal } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

interface Props {
    applications: Application[];
    loading: boolean;
    selectedIds: Set<string>;
    onToggleSelection: (id: string) => void;
    onToggleAll: () => void;
    onSelectApp: (app: Application) => void;
    onToggleStatus: (app: Application) => void;
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
            <Card noPadding>
                <div className="p-12 text-center text-gray-500">로딩중...</div>
            </Card>
        );
    }

    return (
        <Card noPadding>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 font-medium text-gray-500">
                        <tr>
                            <th className="px-6 py-4 w-12">
                                <input
                                    type="checkbox"
                                    checked={
                                        applications.length > 0 &&
                                        selectedIds.size === applications.length
                                    }
                                    onChange={onToggleAll}
                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                            </th>
                            <th className="px-6 py-4">이름 / 학과</th>
                            <th className="px-6 py-4">학번</th>
                            <th className="px-6 py-4">연락처</th>
                            <th className="px-6 py-4">언어 / 백준</th>
                            <th className="px-6 py-4">상태</th>
                            <th className="px-6 py-4 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50/50 transition">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(app.id)}
                                        onChange={() => onToggleSelection(app.id)}
                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">{app.name}</div>
                                    <div className="text-xs text-gray-500">{app.department}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-mono">
                                    {app.studentId}
                                </td>
                                <td className="px-6 py-4 text-gray-600">{app.phone}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded bg-gray-100 text-xs font-medium text-gray-700">
                                            {app.language}
                                        </span>
                                        <span className="text-gray-500 text-xs">{app.baekjoonId}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge
                                        variant={
                                            app.status === "ACCEPTED"
                                                ? "success"
                                                : app.status === "REJECTED"
                                                    ? "error"
                                                    : "warning"
                                        }
                                    >
                                        {app.status === "ACCEPTED"
                                            ? "합격"
                                            : app.status === "REJECTED"
                                                ? "불합격"
                                                : "대기중"}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onSelectApp(app)}
                                            className="p-2 hover:bg-gray-100 rounded text-gray-500 transition"
                                            title="상세보기"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
                                        <button
                                            onClick={() => onToggleStatus(app)}
                                            className={`p-2 rounded transition ${app.status === "ACCEPTED"
                                                    ? "hover:bg-red-50 text-green-600 hover:text-red-600"
                                                    : "hover:bg-green-50 text-gray-400 hover:text-green-600"
                                                }`}
                                            title={app.status === "ACCEPTED" ? "불합격 처리" : "합격 처리"}
                                        >
                                            {app.status === "ACCEPTED" ? <X size={18} /> : <Check size={18} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    신청 내역이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
