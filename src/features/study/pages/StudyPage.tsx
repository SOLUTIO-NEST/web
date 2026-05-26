import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { STUDY_CLASSES, getStudyClass } from "@/content/study";
import MarkdownRenderer from "../components/MarkdownRenderer";

export default function StudyPage() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const current = getStudyClass(classId ?? "");

  if (!current) {
    navigate("/study/seed", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      <div className="max-w-3xl mx-auto px-5 md:px-10 py-8 md:py-12">
        <ClassTabs currentId={current.id} />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <MarkdownRenderer content={current.content} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ClassTabs({ currentId }: { currentId: string }) {
  return (
    <nav className="flex gap-2">
      {STUDY_CLASSES.map((cls) => {
        const isActive = cls.id === currentId;
        return (
          <Link
            key={cls.id}
            to={`/study/${cls.id}`}
            className={`px-5 py-3 border text-sm font-black tracking-wide uppercase transition-colors ${
              isActive
                ? "bg-black text-white border-black"
                : "bg-transparent text-black border-black/15 hover:border-black/40"
            }`}
          >
            {cls.label}
          </Link>
        );
      })}
    </nav>
  );
}
