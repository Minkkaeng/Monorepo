import React, { useState, useEffect, useCallback } from "react";

/**
 * 1. ScrollProgress - 스크롤 진행도를 표시하는 컴포넌트 (Headless)
 */
export const ScrollProgress: React.FC<{
  className?: string; // 외부 스타일 주입용 (예: 고정 상단 바 스타일)
  onProgressChange?: (progress: number) => void;
}> = ({ className, onProgressChange }) => {
  const [progress, setProgress] = useState(0);

  const calculateProgress = useCallback(() => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    setProgress(scrolled);
    onProgressChange?.(scrolled);
  }, [onProgressChange]);

  useEffect(() => {
    window.addEventListener("scroll", calculateProgress);
    return () => window.removeEventListener("scroll", calculateProgress);
  }, [calculateProgress]);

  return (
    <div 
      className={className} 
      role="progressbar" 
      aria-valuenow={progress} 
      aria-valuemin={0} 
      aria-valuemax={100}
      style={{ width: `${progress}%` }}
    />
  );
};

/**
 * 2. ScrollToTop - 클릭 시 최상단으로 이동하는 컴포넌트 (Headless)
 */
export const ScrollToTop: React.FC<{
  showAt?: number; // 버튼이 나타날 스크롤 위치 (기본값: 300)
  children?: React.ReactNode;
  className?: string; // 외부 스타일 주입용 (예: 우측 하단 고정 버튼 스타일)
  behavior?: ScrollBehavior;
}> = ({ showAt = 300, children, className, behavior = "smooth" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    if (window.pageYOffset > showAt) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [showAt]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior,
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [toggleVisibility]);

  if (!isVisible) return null;

  return (
    <button 
      type="button" 
      onClick={scrollToTop} 
      className={className}
      aria-label="Scroll to top"
    >
      {children || "Top"}
    </button>
  );
};

/**
 * Scroll Namespace Component
 */
export const Scroll = {
  Progress: ScrollProgress,
  ToTop: ScrollToTop,
};
