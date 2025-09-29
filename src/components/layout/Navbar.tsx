import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-900/80 backdrop-blur shadow-sm">
      <Container className="flex h-16 items-center justify-between gap-6">
        {/* 좌측: 로고 + 브랜드명 */}
        <a href="/" className="flex items-center gap-3">
          {/* 로고 이미지 경로는 프로젝트에 맞게 교체하세요 */}
          <img src="/logo.svg" alt="SOLUTIO NEST" className="h-9 w-9" />
          <span className="text-xl md:text-2xl font-extrabold tracking-tight">
            SOLUTIO NEST
          </span>
        </a>

        {/* 가운데: 메뉴 (간단 드롭다운 형태) */}
        <nav className="hidden md:flex items-center gap-8">
          <DetailsMenu label="소개">
            <a className="dropdown-item" href="#">동아리 소개</a>
            <a className="dropdown-item" href="#">연혁</a>
          </DetailsMenu>

          <DetailsMenu label="활동">
            <a className="dropdown-item" href="#">스터디</a>
            <a className="dropdown-item" href="#">프로젝트</a>
          </DetailsMenu>
        </nav>

        {/* 우측: 버튼들 */}
        <div className="flex items-center gap-2">
          <Button variant="brandSoft" size="sm" className="shadow">
            로그인
          </Button>
          <Button variant="brand" size="sm" className="shadow">
            모집일정
          </Button>
        </div>
      </Container>
    </header>
  );
}

/* 간단 드롭다운: <details>를 이용해 JS 없이 구현 */
function DetailsMenu({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group relative">
      <summary className="cursor-pointer list-none text-[15px] font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
        {label}
        <span className="transition group-open:rotate-180">▾</span>
      </summary>

      <div className="absolute left-0 mt-2 w-44 rounded-xl border bg-white shadow-lg p-2">
        <div className="flex flex-col gap-1 [&_a.dropdown-item]:rounded-lg [&_a.dropdown-item]:px-3 [&_a.dropdown-item]:py-2 [&_a.dropdown-item:hover]:bg-neutral-100">
          {children}
        </div>
      </div>
    </details>
  );
}
