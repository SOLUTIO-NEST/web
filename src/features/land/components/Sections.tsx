import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Sections() {
  return (
    <div className="bg-neutral-50 text-black">
      {/* ── 섹션 1: Solutio에 대해 ── */}
      <div
        id="section-about"
        className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-24 py-20 border-b border-neutral-200"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 block mb-4">
            ABOUT SOLUTIO
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] mb-8">
            Solutio에 대해
          </h2>
          <div className="space-y-4 text-base md:text-lg text-neutral-600 leading-relaxed font-medium">
            <p>
              <span className="text-black font-bold">Solutio</span>는
              자료구조와 알고리즘을 학습하며,
            </p>
            <p>
              이를 통해 문제 해결(Problem Solving)과<br />
              경쟁적 프로그래밍(Competitive Programming)<br />
              능력을 기르는
            </p>
            <p>
              <span className="text-black font-bold">경기대학교 소속 알고리즘 문제 해결 동아리</span>입니다.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── 섹션 2: 주요 활동 ── */}
      <div
        id="section-activities"
        className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-24 py-20 border-b border-neutral-200"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 block mb-4">
            ACTIVITIES
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] mb-12">
            주요 활동
          </h2>

          <div className="mb-14">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-6">알고리즘 스터디</h3>
            <p className="text-base md:text-lg text-neutral-600 font-medium leading-relaxed mb-6">
              Solutio는 실력에 따라 반을 구성합니다.
            </p>
            <div className="space-y-4">
              {[
                { name: "Seed", desc: "기초 알고리즘을 학습합니다." },
                { name: "Branch", desc: "고급 알고리즘을 학습합니다." },
                { name: "Tree", desc: "자율적으로 팀을 구성해, 대회 준비 및 코딩 테스트 준비를 합니다." },
              ].map((tier) => (
                <div key={tier.name} className="flex items-start gap-4 py-3 border-b border-neutral-100">
                  <span className="text-sm font-black tracking-tight bg-neutral-900 text-white px-3 py-1 shrink-0">
                    {tier.name}
                  </span>
                  <p className="text-sm md:text-base text-neutral-600 font-medium">{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-6">대회 참가</h3>
            <div className="space-y-4 text-base md:text-lg text-neutral-600 font-medium leading-relaxed">
              <p>
                Solutio는 설립 이래 매해{" "}
                <span className="text-black font-bold">ICPC</span>와{" "}
                <span className="text-black font-bold">UCPC</span>에 진출하기 위한 팀을 꾸리고,
                공부하기 쉬운 환경을 조성하고 있습니다.
              </p>
              <p>
                또한 교내 알고리즘 경진대회인{" "}
                <span className="text-black font-bold">KGUPC</span>를 개최하여
                더 많은 사람들이 알고리즘 문제 해결 능력을 키우고 흥미를 가질 수 있도록 돕고 있습니다.
              </p>
            </div>
            <p className="text-sm text-neutral-400 mt-4">
              자세한 내용은{" "}
              <Link to="/competition" className="underline text-black font-semibold hover:text-neutral-600 transition-colors">이곳</Link>
              을 참고하세요.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── 섹션 3: 가입 방법 ── */}
      <div
        id="section-join"
        className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-24 py-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 block mb-4">
            JOIN US
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] mb-8">
            가입 방법
          </h2>
          <p className="text-base md:text-lg text-neutral-600 font-medium leading-relaxed mb-10">
            상단의 <span className="text-black font-bold">합류하기</span>를 통해 신청해주세요!
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-neutral-900 text-white font-bold text-base hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              합류하기 <span>→</span>
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-8 py-4 border border-neutral-300 text-neutral-600 font-bold text-base hover:bg-neutral-100 transition-colors"
            >
              맨 위로 올라가기
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
