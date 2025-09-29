import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <main className="min-h-dvh">
      {/* 히어로 */}
      <Section className="bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
        <Container className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            솔루티오 Nest
          </h1>
          <p className="mt-3 text-neutral-600 dark:text-neutral-300 text-lg">
            공통 컴포넌트 테스트 페이지
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            {/* 보라 버튼(#924ED1) */}
            <Button variant="brand" size="lg">
              Get Started
            </Button>

            {/* 연보라 버튼(#F2EDF7 / 글자 #924ED1) */}
            <Button variant="brandSoft" size="lg">
              Learn more
            </Button>
          </div>
        </Container>
      </Section>

      {/* 기능 카드 */}
      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {["빠른 빌드", "타입 안정성", "쉽게 꾸미기"].map((t, i) => (
              <div key={i} className="rounded-2xl border p-6 bg-white/70 dark:bg-neutral-800/70">
                <h3 className="text-xl font-semibold">{t}</h3>
                <p className="mt-2 text-neutral-600 dark:text-neutral-300">
                  Tailwind + 공통 컴포넌트 조합 확인
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="brand" size="sm">Action</Button>
                  <Button variant="brandSoft" size="sm">Details</Button>
                  <Button variant="outline" size="sm">Outline</Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
