import { useEffect, useRef } from "react";

/**
 * 특정 엘리먼트 밖의 클릭을 감지하는 SSR 안전 훅 (모달이나 드롭다운 닫기 용도)
 * @param callback 영역 밖을 클릭했을 때 실행할 함수
 * @returns 감지할 요소에 연결할 ref 객체
 */
export const useClickAway = <T extends HTMLElement = HTMLDivElement>(
  callback: (event: MouseEvent | TouchEvent) => void
) => {
  const ref = useRef<T>(null);
  const callbackRef = useRef(callback);

  // 콜백이 렌더링될 때마다 최신화 되도록 유지
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // SSR (Next.js 등) 환경 대비
    if (typeof window === "undefined") return;

    const handler = (event: MouseEvent | TouchEvent) => {
      // ref가 가리키는 요소가 존재하고, 클릭된 타겟이 그 요소 내부에 포함되어 있지 않다면 콜백 실행
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callbackRef.current(event);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  return ref;
};
