import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function Navbar() {
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

        {/* 가운데: 메뉴 (가로 바 방식) */}
        <nav className="hidden md:flex items-center gap-30">
          <BarMenu label="소개">
            <a className="dropdown-item" href="#">동아리 소개</a>
            <a className="dropdown-item" href="#">연혁</a>
          </BarMenu>

          <BarMenu label="활동">
            <a className="dropdown-item" href="#">스터디</a>
            <a className="dropdown-item" href="#">대회</a>
          </BarMenu>
        </nav>

        {/* 우측: 버튼들 */}
        <div className="flex items-center gap-3">
          <Button variant="brandSoft" size="sm" className="shadow">로그인</Button>
          <Button variant="brand" size="sm" className="shadow">모집일정</Button>
        </div>
      </Container>
    </header>
  );
}

/** 👇 hover 시, 헤더 아래 '가로 바'로 펼쳐지는 서브 메뉴 */
function BarMenu({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group">
      {/* 탭 버튼 */}
      <button
        className="relative flex items-center gap-1 px-1 text-[15px] font-medium
                   text-neutral-700 dark:text-neutral-300 hover:opacity-80"
      >
        {label}
        <span className="transition-transform group-hover:rotate-180"></span>
      </button>

      {/* ⬇️ 헤더 바로 아래에 고정: fixed top-16 (헤더 높이 64px) */}
      <div className="pointer-events-none fixed left-0 right-0 top-16 z-40">
        <div
          className="invisible opacity-0 translate-y-1
                     group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                     group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0
                     transition-all duration-150 pointer-events-auto"
        >
          <div className="border-t border-neutral-200 bg-white/95 dark:bg-neutral-900/90 backdrop-blur">
            {/* 내부는 가로 정렬 + 줄바꿈 금지 */}
            <Container fluid pad="sm" className="flex items-center justify-center gap-10 py-3">
              <div className="flex items-center gap-10
                              [&_a.dropdown-item]:inline-flex
                              [&_a.dropdown-item]:items-center
                              [&_a.dropdown-item]:px-2
                              [&_a.dropdown-item]:py-2
                              [&_a.dropdown-item]:text-[15px]
                              [&_a.dropdown-item]:font-medium
                              [&_a.dropdown-item]:text-neutral-700
                              dark:[&_a.dropdown-item]:text-neutral-300
                              [&_a.dropdown-item]:whitespace-nowrap
                              [&_a.dropdown-item:hover]:text-[#924ED1]">
                {children}
              </div>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
}
