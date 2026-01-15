import { type Application, type ApplicationStatus } from "@/services/api";
import { motion } from "framer-motion";
import { X, Phone, Mail, Award, BookOpen, Calendar } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Props {
    app: Application;
    onClose: () => void;
    onUpdateStatus: (status: ApplicationStatus) => void;
}

export default function ApplicationDetailModal({ app, onClose, onUpdateStatus }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                            🎓
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{app.name}</h2>
                            <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-2">
                                <span>{app.department}</span>
                                <span className="text-gray-300">|</span>
                                <span className="font-mono">{app.studentId}</span>
                            </div>
                            <div className="mt-3">
                                <Badge variant={
                                    app.status === 'ACCEPTED' ? 'success' :
                                        app.status === 'REJECTED' ? 'error' : 'warning'
                                }>
                                    {app.status === 'ACCEPTED' ? '합격' :
                                        app.status === 'REJECTED' ? '불합격' : '대기중'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 transition text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem icon={<Mail size={18} />} label="이메일" value={app.email} />
                        <InfoItem icon={<Phone size={18} />} label="전화번호" value={app.phone} />
                        <InfoItem icon={<Award size={18} />} label="백준 ID" value={app.baekjoonId} />
                        <InfoItem icon={<BookOpen size={18} />} label="주력 언어" value={app.language} />
                        <InfoItem icon={<Calendar size={18} />} label="신청일" value={new Date(app.createdAt).toLocaleDateString()} />
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-purple-600">✍️</span> 지원 동기
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4 text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                            {app.motivation || "작성된 지원 동기가 없습니다."}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3 transition-colors">
                    {app.status !== 'ACCEPTED' && (
                        <Button
                            onClick={() => onUpdateStatus('ACCEPTED')}
                            variant="success"
                        >
                            합격 처리
                        </Button>
                    )}
                    {app.status !== 'REJECTED' && (
                        <Button
                            onClick={() => onUpdateStatus('REJECTED')}
                            variant="danger"
                        >
                            불합격 처리
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

function InfoItem({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-gray-400">{icon}</div>
            <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-gray-900 font-medium">{value}</p>
            </div>
        </div>
    )
}
