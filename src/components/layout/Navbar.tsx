import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/toastStore";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import RecruitmentInfoModal from "@/features/land/components/RecruitmentInfoModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showRecruitmentModal, setShowRecruitmentModal] = useState(false);
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl">
      <div className="flex h-14 items-center justify-between px-5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        {/* 좌측: 로고 */}
        <a href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="SOLUTIO NEST" className="h-8 w-8" />
          <span className="text-lg md:text-xl font-extrabold tracking-tight text-neutral-800">
            SOLUTIO NEST
          </span>
        </a>

        {/* 가운데: 메뉴 */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "연혁", href: "#" },
            { label: "스터디", href: "/study/seed" },
            { label: "대회", href: "/competition" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[14px] font-medium text-neutral-500 hover:text-purple-600 transition-colors cursor-pointer"
              onClick={item.href === "#" ? (e) => { e.preventDefault(); toast.info("아직 준비 중인 기능입니다."); } : undefined}
            >
              {item.label}
            </a>
          ))}


          {(user?.role === 'STAFF' || user?.role === 'NEST' || user?.role === 'SUPER' || user?.role === 'ADMIN') && (
            <a
              href="/admin/applications"
              className="text-[14px] font-medium text-neutral-500 hover:text-purple-600 transition-colors"
            >
              신청 관리
            </a>
          )}
        </nav>

        {/* 우측: 버튼들 */}
        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="brandSoft" size="sm" onClick={logout}>로그아웃</Button>
          ) : (
            <a href="/login">
              <Button variant="brandSoft" size="sm">로그인</Button>
            </a>
          )}
          <Button
            variant="brand"
            size="sm"
            onClick={() => setShowRecruitmentModal(true)}
          >
            모집일정
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showRecruitmentModal && (
          <RecruitmentInfoModal onClose={() => setShowRecruitmentModal(false)} />
        )}
      </AnimatePresence>
    </header>
  );
}
