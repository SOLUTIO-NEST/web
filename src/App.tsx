import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-dvh bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 grid place-items-center p-8">
      <div className="flex flex-col items-center gap-6">
        {/* 로고 영역 */}
        <div className="flex items-center justify-center gap-8">
          <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
            <img
              src={viteLogo}
              alt="Vite logo"
              className="w-20 h-20 transition-transform hover:scale-110 drop-shadow"
            />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img
              src={reactLogo}
              alt="React logo"
              className="w-20 h-20 transition hover:animate-spin"
            />
          </a>
        </div>

        {/* 타이틀 */}
        <h1 className="text-5xl font-extrabold tracking-tight">Vite + React</h1>

        {/* 카드 영역 */}
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200/70 dark:border-neutral-700/60 bg-white/70 dark:bg-neutral-800/70 px-6 py-5 shadow-sm">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="rounded-xl px-5 py-2.5 bg-blue-600 text-white font-medium shadow hover:bg-blue-700 active:scale-[0.98] transition"
          >
            count is {count}
          </button>
          <p className="text-sm text-neutral-500">
            Edit <code className="font-mono text-neutral-800 dark:text-neutral-200">src/App.tsx</code> and save to test HMR
          </p>
        </div>

        {/* 풋노트 */}
        <p className="text-neutral-500/80 text-sm">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </main>
  );
}
