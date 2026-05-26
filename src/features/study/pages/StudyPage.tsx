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
    <div className="min-h-screen flex flex-col bg-neutral-100 text-black">
      <Header />

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <Sidebar currentId={current.id} />

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="px-5 md:px-10 lg:px-16 py-8 md:py-12 max-w-3xl"
            >
              <MarkdownRenderer content={current.content} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-black/10 shrink-0">
      <a href="/" className="flex items-center gap-3 px-5 md:px-6 py-4">
        <img src="/logo.png" alt="SOLUTIO" className="h-8 w-8" />
        <span className="hidden md:inline text-lg font-extrabold tracking-tight">
          SOLUTIO NEST
        </span>
      </a>
      <div className="flex items-center">
        <Link
          to="/login"
          className="px-4 py-4 text-sm font-bold border-l border-black/10 hover:bg-black/5 transition-colors"
        >
          로그인
        </Link>
        <Link
          to="/"
          className="px-5 py-4 text-sm font-bold border-l border-black/10 hover:bg-black/5 transition-colors"
        >
          홈으로
        </Link>
      </div>
    </header>
  );
}

function Sidebar({ currentId }: { currentId: string }) {
  return (
    <aside className="lg:w-[38%] lg:border-r border-b lg:border-b-0 border-black/10 flex flex-col">
      <div className="px-5 md:px-10 py-8 md:py-12 flex flex-col justify-between flex-1">
        <div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tighter">
            스터디
          </h1>
          <p className="mt-6 text-base md:text-lg font-semibold text-black/60 leading-relaxed">
            단계별로 성장하는
            <br />
            SOLUTIO 알고리즘 스터디
          </p>
        </div>

        <nav className="mt-8 lg:mt-0 flex flex-row lg:flex-col gap-2">
          {STUDY_CLASSES.map((cls) => {
            const isActive = cls.id === currentId;
            return (
              <Link
                key={cls.id}
                to={`/study/${cls.id}`}
                className={`group flex items-center gap-4 px-5 py-4 border transition-colors ${
                  isActive
                    ? "bg-black text-white border-black"
                    : "bg-transparent text-black border-black/15 hover:border-black/40"
                }`}
              >
                <span className="text-sm font-black tracking-wide uppercase">
                  {cls.label}
                </span>
                <span
                  className={`hidden md:inline text-xs font-medium ${
                    isActive ? "text-white/60" : "text-black/40"
                  }`}
                >
                  {cls.description}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
