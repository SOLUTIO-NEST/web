import { useAuth } from "@/context/AuthContext";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import RecruitmentInfoModal from "@/features/land/components/RecruitmentInfoModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showRecruitmentModal, setShowRecruitmentModal] = useState(false);
  return (
    // 헤더는 fixed + relative (패널 기준) + 높이 64px(h-16)
    <header className="fixed top-0 left-0 right-0 z-50 relative bg-white/90 dark:bg-neutral-900/80 backdrop-blur shadow-sm h-16">
      <Container fluid pad="sm" className="flex h-full items-center justify-between gap-4">
        {/* 좌측: 로고 */}
        <a href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="SOLUTIO NEST" className="h-9 w-9" />
          <span className="text-xl md:text-2xl font-extrabold tracking-tight">
            SOLUTIO NEST
          </span>
        </a>

        {/* 가운데: 메뉴 */}
        <nav className="hidden md:flex items-center gap-8">
          {["동아리 소개", "연혁", "스터디", "대회"].map((label) => (
            <a
              key={label}
              className="text-[15px] font-medium text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
              onClick={(e) => { e.preventDefault(); alert("아직 개발중입니다."); }}
            >
              {label}
            </a>
          ))}

          {(user?.role === 'STAFF' || user?.role === 'NEST' || user?.role === 'SUPER' || user?.role === 'ADMIN') && (
            <a
              href="/admin/applications"
              className="text-[15px] font-medium text-slate-400 hover:text-purple-600 transition-colors"
            >
              신청 관리
            </a>
          )}
        </nav>

        {/* 우측: 버튼들 */}
        <div className="flex items-center gap-3">
          {user ? (
            <Button variant="brandSoft" size="sm" className="shadow" onClick={logout}>로그아웃</Button>
          ) : (
            <a href="/login">
              <Button variant="brandSoft" size="sm" className="shadow">로그인</Button>
            </a>
          )}
          <Button
            variant="brand"
            size="sm"
            className="shadow"
            onClick={() => setShowRecruitmentModal(true)}
          >
            모집일정
          </Button>
        </div>
      </Container>

      <AnimatePresence>
        {showRecruitmentModal && (
          <RecruitmentInfoModal onClose={() => setShowRecruitmentModal(false)} />
        )}
      </AnimatePresence>
    </header>
  );
}
