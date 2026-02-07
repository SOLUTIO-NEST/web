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
                        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <h3 className="text-xl font-bold leading-6 text-gray-900 mb-6 text-center">
                            결과 확인
                        </h3>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-100 border-t-purple-600"></div>
                            </div>
                        ) : status ? (
                            <div className="mt-2">
                                <p className="text-base text-gray-500 mb-8 text-center">
                                    <span className="font-bold text-gray-900 text-lg">{status.name}</span> 님의 결과입니다.
                                </p>

                                <div className="flex flex-col items-center justify-center py-2 space-y-4 mb-6">
                                    {status.isPassed === true ? (
                                        <>
                                            <div className="text-6xl mb-2">🎉</div>
                                            <h4 className="text-2xl font-bold text-green-600">축하합니다!</h4>
                                            <p className="text-base text-gray-600 text-center leading-relaxed">
                                                최종 <strong>합격</strong>하셨습니다.<br />
                                                SOLUTIO의 일원이 되신 것을 환영합니다.<br />
                                                <span className="text-sm text-gray-400 mt-2 block">추후 일정은 개별 연락 드릴 예정입니다.</span>
                                            </p>
                                        </>
                                    ) : status.isPassed === false ? (
                                        <>
                                            <div className="text-6xl mb-2">😢</div>
                                            <h4 className="text-2xl font-bold text-gray-600">불합격</h4>
                                            <p className="text-base text-gray-600 text-center leading-relaxed">
                                                아쉽게도 이번에는 함께하지 못하게 되었습니다.<br />
                                                지원해 주셔서 진심으로 감사드립니다.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-6xl mb-2">⏳</div>
                                            <h4 className="text-2xl font-bold text-yellow-500">심사 진행 중</h4>
                                            <p className="text-base text-gray-600 text-center leading-relaxed">
                                                현재 서류/면접 심사가 진행 중입니다.<br />
                                                결과가 나올 때까지 조금만 기다려주세요.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-2 py-8 text-center">
                                <p className="text-gray-500">
                                    신청 정보를 불러올 수 없습니다.
                                </p>
                            </div>
                        )}

                        <div className="mt-6 flex justify-center w-full">
                            <Button variant="brandSoft" onClick={onClose} className="w-full h-11 text-base">
                                닫기
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
