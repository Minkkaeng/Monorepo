import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";
import { cn } from "@framework/utils";

interface ToastProps {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  hasIcon?: boolean;     // 아이콘 표시 여부 (true/false)
  hasCloseButton?: boolean; // 닫기 버튼 표시 여부
  isAnimated?: boolean;   // 애니메이션 적용 여부
  onClose: (id: string) => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = "info",
  duration = 3000,
  hasIcon = true,
  hasCloseButton = true,
  isAnimated = true,
  onClose,
  className,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const bgColors = {
    success: "bg-white border-green-100",
    error: "bg-white border-red-100",
    info: "bg-white border-blue-100",
  };

  return (
    <div
      className={cn(
        "flex items-center p-5 rounded-3xl border shadow-2xl transition-all",
        bgColors[type],
        isAnimated && "animate-fade-in-up",
        className
      )}
    >
      {hasIcon && (
        <div className="flex-shrink-0 mr-4 p-2 bg-gray-50 rounded-xl">
          {icons[type]}
        </div>
      )}
      <div className="flex-1 text-sm font-black text-gray-900 mr-8 leading-tight">
        {message}
      </div>
      {hasCloseButton && (
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 text-gray-300 hover:text-gray-900 transition-colors p-1"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export const ToastContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex flex-col space-y-4 px-4 w-full max-w-md">
      {children}
    </div>
  );
};
