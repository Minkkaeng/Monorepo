import { useEffect } from "react";

/**
 * 모달 오픈 시 배경 뷰 스크롤을 막기 위한 훅 (SSR 안전 보장)
 * @param isLocked 스크롤을 막을지 여부
 */
export const useScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    // SSR 환경 대응 (document 객체 접근)
    if (typeof document === "undefined") return;

    if (isLocked) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      
      // 언마운트 시 혹은 상태 해제 시 원래 스타일로 복구
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isLocked]);
};
