import React from "react";
import { X } from "lucide-react";
import { cn } from "@framework/utils";
import { useScrollLock } from "@framework/hooks";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean; // 닫기 버튼 표시 여부 (true/false)
  hasOverlay?: boolean;      // 오버레이 유무
  isCentered?: boolean;     // 중앙 정렬 여부
  isGlassmorphism?: boolean; // 오버레이 글래스모피즘 효과 유무
  lockScroll?: boolean;     // 배경 스크롤 잠금 여부
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  hasOverlay = true,
  isCentered = true,
  isGlassmorphism = true,
  lockScroll = true,
  className,
}) => {
  // 모달이 열려 있을 때 배경 스크롤 잠금 제어
  useScrollLock(isOpen && lockScroll);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {hasOverlay && (
        <div 
          className={cn(
            "absolute inset-0 transition-opacity animate-fade-in",
            isGlassmorphism ? "bg-black/20 backdrop-blur-md" : "bg-gray-900/40"
          )}
          onClick={onClose}
        />
      )}
      
      <div className={cn(
        "relative bg-white w-full max-w-2xl rounded-[3.5rem] shadow-3xl overflow-hidden animate-zoom-in",
        "max-h-[90vh] flex flex-col",
        isCentered ? "text-center" : "text-left",
        className
      )}>
        {(title || showCloseButton) && (
          <div className="p-10 flex justify-between items-center border-b border-gray-50 bg-gray-50/50 shrink-0">
            {title && <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{title}</h3>}
            {showCloseButton && (
              <button 
                onClick={onClose}
                className="p-3 bg-white hover:bg-gray-200 rounded-2xl transition-all shadow-sm active:scale-90"
              >
                <X size={24} className="text-gray-400 hover:text-gray-900" />
              </button>
            )}
          </div>
        )}
        
        {/* 내부 스크롤 영역: 스크롤바 숨김 처리 */}
        <div className="p-10 overflow-y-auto flex-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style dangerouslySetInnerHTML={{ __html: `
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}} />
          <div className="text-gray-500 font-medium leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
