import { useEffect, useState } from "react";

export type WindowSize = {
  width: number;
  height: number;
};

/**
 * SSR 안전 브라우저 창 크기 감지 훅
 * @returns 현재 창 크기 (width, height)
 */
export const useWindowSize = (): WindowSize => {
  const [size, setSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // SSR (Next.js 등) 환경 대비
    if (typeof window === "undefined") return;

    const update = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    update(); // 마운트 시 최초 실행
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
};
