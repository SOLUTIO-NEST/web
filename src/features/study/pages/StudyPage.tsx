import { motion } from "framer-motion";
import { STUDY_CONTENT } from "@/content/study";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

export default function StudyPage() {
  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto px-5 md:px-10 py-8 md:py-12"
      >
        <MarkdownRenderer content={STUDY_CONTENT} />
      </motion.div>
    </div>
  );
}
