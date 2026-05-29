import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "비전공자도 지원 가능한가요?",
    answer:
      "네, 프로그래밍에 관심이 있는 경기대학교 재학생이라면 누구나 지원 가능합니다.",
  },
  {
    question: "활동 기간은 어떻게 되나요?",
    answer:
      "한 학기 단위로 운영되며, 매 학기 초에 새로운 기수를 모집합니다.",
  },
  {
    question: "동아리 가입은 어떻게 하나요?",
    answer:
      "모집 기간에 홈페이지를 통해 지원할 수 있습니다. 오른쪽 신청서를 작성해주세요.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      <p className="text-xs font-bold tracking-widest text-black/30 mb-3">
        FAQ
      </p>
      <div className="border-t border-black/10">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="border-b border-black/10">
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between py-3 text-left group"
            >
              <span className="text-sm font-semibold text-black/70 group-hover:text-black transition-colors">
                {item.question}
              </span>
              <motion.span
                animate={{ rotate: openIndex === index ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-black/30 text-lg leading-none shrink-0 ml-3"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-black/50 leading-relaxed pb-3">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
