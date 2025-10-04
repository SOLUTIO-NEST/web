import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function GraphBackground() {
  const init = useCallback(async (engine: any) => {
    await loadSlim(engine); // 가벼운 엔진 로더
    // console.log("tsparticles init"); // 호출 여부 확인용
  }, []);

  return (
    <Particles
      id="graph-bg"
      init={init}
      className="absolute inset-0 z-0"    // 부모를 꽉 채우고 z-index 0
      options={{
        fullScreen: { enable: false },    // ✅ 섹션 안에서만 렌더
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        detectRetina: true,
        particles: {
          number: { value: 120, density: { enable: true, area: 800 } }, // 눈에 확 띄게
          color: { value: "#924ED1" },
          shape: { type: "circle" },
          size: { value: 4, random: { enable: true, minimumValue: 1 } },
          opacity: { value: 0.7 },
          links: { enable: true, color: "#924ED1", distance: 140, opacity: 0.5, width: 1 },
          move: { enable: true, speed: 1, outModes: { default: "bounce" } }
        },
        interactivity: {
          events: { onHover: { enable: true, mode: ["grab", "bubble"] }, resize: true },
            modes: {
                grab: { distance: 140, links: { opacity: 0.8 } },
                bubble: { distance: 120, size: 10, duration: 0.3, opacity: 0.8 } // ← 호버 크기
            }
        }
      }}
    />
  );
}
