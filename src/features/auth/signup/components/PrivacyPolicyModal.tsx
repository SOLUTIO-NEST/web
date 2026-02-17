import { motion } from "framer-motion";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
    onClose: () => void;
}

export default function PrivacyPolicyModal({ onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">개인정보 수집·이용 동의서</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    <p className="font-bold text-gray-900 mb-2">개인정보 수집·이용 동의서</p>
                    <p className="mb-4">
                        본 동아리는 입단 신청 및 회원 관리의 원활한 수행을 위해 개인정보 보호법 등 관련 법령에 따라, 정보주체의 동의를 받아 아래와 같이 개인정보를 수집·이용하고자 합니다. 내용을 자세히 읽어보신 후 동의 여부를 결정하여 주시기 바랍니다.
                    </p>

                    <p className="font-bold text-gray-900 mb-2">개인정보 수집·이용 목적</p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>입단 신청자 본인 확인 및 심사 진행</li>
                        <li>합격·불합격 등 결과 통보</li>
                        <li>합격자의 동아리 회원 명부 등록 및 관리</li>
                        <li>동아리 홈페이지 등 온라인 활동 참여 지원</li>
                    </ul>

                    <p className="font-bold text-gray-900 mb-2">수집하는 개인정보 항목</p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>필수항목: 이름, 학번, 학과, 연락처(전화번호), 이메일 주소, 백준(Baekjoon) 아이디</li>
                    </ul>

                    <p className="font-bold text-gray-900 mb-2">개인정보의 보유 및 이용 기간</p>
                    <p className="mb-2">
                        수집된 개인정보는 아래 명시된 기간 동안 보유 및 이용되며, 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
                    </p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>합격자: 회원 자격 유지 기간 동안 보유하며, 탈퇴 시 즉시 파기합니다.</li>
                        <li>불합격자: 최종 합격자 공고일로부터 6주 이내에 파기합니다.</li>
                    </ul>

                    <p className="font-bold text-gray-900 mb-2">동의 거부 권리 및 불이익 안내</p>
                    <p className="mb-4">
                        정보주체는 위와 같은 개인정보 수집·이용에 대해 동의를 거부할 권리가 있습니다. 그러나 동의를 거부하실 경우, 입단 심사 진행 및 결과 통보가 불가능하여 동아리 입단 신청이 제한될 수 있습니다.
                    </p>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-4">
                        <p className="font-bold text-red-600 mb-2">※ 중요 안내: 동아리 운영 제한 대상자 정보 보관</p>
                        <p className="text-red-700 mb-2">
                            동아리에 속한 기간 중, 동아리 규정 위반,
                            또는 동아리 활동과 직접적인 관련이 있는 경우뿐만 아니라,
                            개인의 일상생활에서 발생한 행위라 하더라도
                            폭력, 명예훼손, 성희롱 등으로 사회적 물의를 야기하여
                            동아리의 명성, 구성원의 안전 또는 운영에 중대한 영향을 미친 경우,
                            운영진의 의결을 통해 제명이 결정된 경우에 한하여,
                            재가입 방지 및 동아리 운영의 안정성을 위해
                            최소한의 개인정보(이름, 학번, 연락처)를 별도로 보관할 수 있습니다.
                        </p>
                        <p className="text-red-700 mb-2">
                            해당 정보는 위 사유가 발생한 경우에만 처리되며,
                            보관 기간은 최종 제명 또는 제한 결정일로부터 최대 7년으로 합니다.
                            보관 기간 경과 시 지체 없이 파기합니다.
                        </p>
                        <p className="text-red-700">
                            본 항목은 동아리의 안전한 운영을 위해 필수적으로 적용됩니다.
                        </p>
                    </div>

                    <p>본인은 위 내용을 충분히 숙지하였으며, 개인정보 수집 및 이용에 동의합니다.</p>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <Button onClick={onClose} variant="brand" className="px-8">
                        확인
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
