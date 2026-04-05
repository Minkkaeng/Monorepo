import React from "react";
import { X } from "lucide-react";
import { cn } from "@framework/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean; // 닫기 버튼 표시 여부 (true/false)
  hasOverlay?: boolean;      // 오버레이 유무
  isCentered?: boolean;     // 중앙 정렬 여부
  isGlassmorphism?: boolean; // 오버레이 글래스모피즘 효과 유무
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
  className,
}) => {
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
        "relative bg-white w-full max-w-2xl rounded-[3rem] shadow-3xl overflow-hidden animate-zoom-in",
        isCentered ? "text-center" : "text-left",
        className
      )}>
        {(title || showCloseButton) && (
          <div className="p-10 flex justify-between items-center border-b border-gray-50 bg-gray-50/50">
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
        
        <div className="p-10">
          <div className="text-gray-500 font-medium leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
