import React from "react";
import { cn } from "@framework/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hasBorder?: boolean;    // 테두리 유무 (true/false)
  isRounded?: boolean;   // 둥근 모서리 여부
  isFullWidth?: boolean; // 전체 너비 사용 여부
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hasBorder = true,
  isRounded = true,
  isFullWidth = true,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col space-y-2", isFullWidth ? "w-full" : "w-auto")}>
      {label && (
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <input
        className={cn(
          "px-5 py-4 bg-gray-50 text-gray-900 font-bold transition-all focus:ring-4 focus:ring-indigo-100 outline-none",
          hasBorder ? "border-2 border-transparent focus:border-indigo-600" : "border-none",
          isRounded ? "rounded-2xl" : "rounded-none",
          error && "border-red-500 focus:border-red-500 focus:ring-red-50",
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-xs font-bold text-red-500 ml-1 mt-1 animate-shake">
          {error}
        </span>
      )}
    </div>
  );
};
