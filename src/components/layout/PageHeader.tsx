import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { applicantService } from "@/services/api";
import type { ApplicantPassResponseDto, User } from "@/services/types";
import { toast } from "@/components/ui/toastStore";
import { getErrorMessage } from "@/utils/error";
import ResultModal from "@/features/land/components/ResultModal";

const LINK_STYLE =
  "w-20 h-full flex items-center justify-center text-[13px] font-semibold text-black/60 hover:text-black border-l border-black/15 hover:bg-black/5 active:bg-black/10 transition-colors";

export default function PageHeader() {
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passStatus, setPassStatus] = useState<ApplicantPassResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin =
    user?.role === "STAFF" ||
    user?.role === "NEST" ||
    user?.role === "SUPER" ||
    user?.role === "ADMIN";

  const handleCheckResult = async () => {
    setIsModalOpen(true);
    setIsLoading(true);
    try {
      const status = await applicantService.getMyStatus();
      setPassStatus(status);
    } catch (error) {
      console.error("Failed to fetch applicant status", error);
      toast.error(getErrorMessage(error, "합격 여부를 조회하지 못했습니다."));
    } finally {
      setIsLoading(false);
    }
  };

  const navLinks = [
    { label: "스터디", to: "/study" },
    { label: "대회", to: "/competition" },
    { label: "연혁", to: "/history" },
    { label: "문의", to: "/contact" },
    ...(isAdmin
      ? [
          { label: "신청 관리", to: "/admin/applications" },
          { label: "블랙리스트", to: "/admin/blacklist" },
          { label: "모집 공고", to: "/admin/recruitments" },
        ]
      : []),
  ];

  return (
    <>
      <header className="relative z-30 bg-[#a855f7] flex items-center justify-between border-b border-black/15 h-14">
        <Link to="/" className="flex items-center gap-3 px-4 md:px-6 h-full">
          <img src="/logo.png" alt="SOLUTIO" className="h-7 w-auto object-contain" />
          <span className="hidden md:inline text-lg font-extrabold tracking-tight text-black">
            SOLUTIO NEST
          </span>
        </Link>

        <DesktopNav
          navLinks={navLinks}
          user={user}
          logout={logout}
          onCheckResult={handleCheckResult}
        />

        <MobileNav
          user={user}
          logout={logout}
          onCheckResult={handleCheckResult}
          onToggleMenu={() => setShowMobileMenu(!showMobileMenu)}
        />
      </header>

      <MobileMenuOverlay
        navLinks={navLinks}
        show={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
      />

      <ResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        status={passStatus}
        isLoading={isLoading}
      />
    </>
  );
}

function DesktopNav({
  navLinks,
  user,
  logout,
  onCheckResult,
}: {
  navLinks: { label: string; to: string }[];
  user: User | null;
  logout: () => void;
  onCheckResult: () => void;
}) {
  return (
    <div className="hidden md:flex items-center h-full">
      {navLinks.map((link) => (
        <Link key={link.label} to={link.to} className={LINK_STYLE}>
          {link.label}
        </Link>
      ))}

      {user ? (
        <button
          onClick={logout}
          className="px-4 h-full text-sm font-bold border-l border-black/15 hover:bg-black/5 active:bg-black/10 transition-colors"
        >
          로그아웃
        </button>
      ) : (
        <Link
          to="/login"
          className="px-4 h-full flex items-center text-sm font-bold border-l border-black/15 hover:bg-black/5 active:bg-black/10 transition-colors"
        >
          로그인
        </Link>
      )}

      <CtaButton user={user} onCheckResult={onCheckResult} />
    </div>
  );
}

function MobileNav({
  user,
  logout,
  onCheckResult,
  onToggleMenu,
}: {
  user: User | null;
  logout: () => void;
  onCheckResult: () => void;
  onToggleMenu: () => void;
}) {
  return (
    <div className="flex md:hidden items-center h-full">
      {user ? (
        <button
          onClick={logout}
          className="px-3 h-full text-sm font-bold border-l border-black/15 hover:bg-black/5 transition-colors"
        >
          로그아웃
        </button>
      ) : (
        <Link
          to="/login"
          className="px-3 h-full flex items-center text-sm font-bold border-l border-black/15 hover:bg-black/5 transition-colors"
        >
          로그인
        </Link>
      )}

      <CtaButton user={user} onCheckResult={onCheckResult} mobile />

      <button
        onClick={onToggleMenu}
        className="w-12 h-full flex items-center justify-center border-l border-black/15 hover:bg-black/5 transition-colors"
        aria-label="메뉴 열기"
      >
        <div className="space-y-1.5">
          <div className="w-5 h-[2px] bg-black/70" />
          <div className="w-5 h-[2px] bg-black/70" />
          <div className="w-5 h-[2px] bg-black/70" />
        </div>
      </button>
    </div>
  );
}

function CtaButton({
  user,
  onCheckResult,
  mobile,
}: {
  user: User | null;
  onCheckResult: () => void;
  mobile?: boolean;
}) {
  const px = mobile ? "px-4" : "px-5";

  const base = `${px} h-full flex items-center text-sm font-bold bg-black text-[#a855f7] hover:bg-black/85 transition-colors gap-2`;

  if (!user) {
    return (
      <Link to="/signup" className={base}>
        합류하기 <span className="text-xs">→</span>
      </Link>
    );
  }

  if (user.role === "GUEST") {
    return (
      <button onClick={onCheckResult} className={base}>
        결과 확인 <span className="text-xs">→</span>
      </button>
    );
  }

  return null;
}

function MobileMenuOverlay({
  navLinks,
  show,
  onClose,
}: {
  navLinks: { label: string; to: string }[];
  show: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-md z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-5 top-20 bottom-auto bg-white z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <span className="text-xs font-bold tracking-[0.2em] text-neutral-400">
                MENU
              </span>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-800 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {navLinks.map((link, idx) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + idx * 0.06,
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  to={link.to}
                  onClick={onClose}
                  className="block mx-6 py-5 text-lg font-black tracking-tight text-neutral-900 hover:text-neutral-600 border-b border-neutral-100 transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <div className="px-6 py-5">
              <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-300">
                SOLUTIO NEST
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
