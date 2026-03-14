import { motion, AnimatePresence } from "framer-motion";
import type { ApplicantPassResponseDto } from "@/services/types";
import Button from "@/components/ui/Button";

interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    status: ApplicantPassResponseDto | null;
    isLoading: boolean;
}

export default function ResultModal({ isOpen, onClose, status, isLoading }: ResultModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Panel */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
                    >
                        {isLoading ? (
                            <div className="flex justify-center p-10">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-100 border-t-purple-600" />
                            </div>
                        ) : status ? (
                            status.isPassed === true ? (
                                <PassedContent status={status} onClose={onClose} />
                            ) : status.isPassed === false ? (
                                <FailedContent status={status} onClose={onClose} />
                            ) : (
                                <PendingContent status={status} onClose={onClose} />
                            )
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-gray-500 py-8">신청 정보를 불러올 수 없습니다.</p>
                                <Button variant="brandSoft" onClick={onClose} className="w-full h-11 text-base">
                                    닫기
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

interface ContentProps {
    status: ApplicantPassResponseDto;
    onClose: () => void;
}

function PassedContent({ status, onClose }: ContentProps) {
    return (
        <div>
            {/* Header */}
            <div className="bg-green-50 px-6 pt-8 pb-6 text-center border-b border-green-100">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold text-green-700">최종 합격</h3>
                <p className="text-sm text-green-600 mt-1">
                    <span className="font-semibold">{status.name}</span> 님, SOLUTIO에 오신 걸 환영합니다!
                </p>
            </div>

            {/* Details */}
            <div className="px-6 py-5 space-y-3">
                {status.classLevel && (
                    <InfoRow
                        label="배정 반"
                        value={status.classLevel}
                        valueClassName="font-semibold text-purple-700"
                    />
                )}
                {status.groupAccountNumber && (
                    <InfoRow
                        label="그룹통장 계좌번호"
                        value={status.groupAccountNumber}
                        copyable
                    />
                )}
                {status.groupAccountLink && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-500 shrink-0">그룹통장 링크</span>
                        <a
                            href={status.groupAccountLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:underline truncate ml-4"
                        >
                            바로가기 →
                        </a>
                    </div>
                )}
                {status.passedMessage && (
                    <div className="mt-4 rounded-xl bg-purple-50 border border-purple-100 p-4">
                        <p className="text-xs font-semibold text-purple-500 mb-1">운영진 안내 메시지</p>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {status.passedMessage}
                        </p>
                    </div>
                )}
            </div>

            <div className="px-6 pb-6">
                <Button variant="brandSoft" onClick={onClose} className="w-full h-11 text-base">
                    확인
                </Button>
            </div>
        </div>
    );
}

function FailedContent({ status, onClose }: ContentProps) {
    return (
        <div>
            {/* Header */}
            <div className="bg-gray-50 px-6 pt-8 pb-6 text-center border-b border-gray-100">
                <div className="text-5xl mb-3">😢</div>
                <h3 className="text-2xl font-bold text-gray-600">불합격</h3>
            </div>

            <div className="px-6 py-6 text-center">
                <p className="text-sm text-gray-600 leading-relaxed">
                    아쉽게도 이번에는 함께하지 못하게 되었습니다.<br />
                    지원해 주셔서 진심으로 감사드립니다.
                </p>
            </div>

            <div className="px-6 pb-6">
                <Button variant="brandSoft" onClick={onClose} className="w-full h-11 text-base">
                    닫기
                </Button>
            </div>
        </div>
    );
}

function PendingContent({ status, onClose }: ContentProps) {
    return (
        <div>
            <div className="bg-yellow-50 px-6 pt-8 pb-6 text-center border-b border-yellow-100">
                <div className="text-5xl mb-3">⏳</div>
                <h3 className="text-2xl font-bold text-yellow-600">심사 진행 중</h3>
                <p className="text-sm text-yellow-600 mt-1">
                    <span className="font-semibold">{status.name}</span> 님의 심사가 진행 중입니다.
                </p>
            </div>

            <div className="px-6 py-6 text-center">
                <p className="text-sm text-gray-600 leading-relaxed">
                    현재 서류/면접 심사가 진행 중입니다.<br />
                    결과가 나올 때까지 조금만 기다려주세요.
                </p>
            </div>

            <div className="px-6 pb-6">
                <Button variant="brandSoft" onClick={onClose} className="w-full h-11 text-base">
                    닫기
                </Button>
            </div>
        </div>
    );
}

interface InfoRowProps {
    label: string;
    value: string;
    copyable?: boolean;
    valueClassName?: string;
}

function InfoRow({ label, value, copyable, valueClassName }: InfoRowProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
    };

    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-500 shrink-0">{label}</span>
            <div className="flex items-center gap-2 ml-4">
                <span className={`text-sm text-gray-800 ${valueClassName ?? ""}`}>{value}</span>
                {copyable && (
                    <button
                        onClick={handleCopy}
                        className="text-xs text-gray-400 hover:text-purple-600 transition-colors"
                        title="복사"
                    >
                        복사
                    </button>
                )}
            </div>
        </div>
    );
}
