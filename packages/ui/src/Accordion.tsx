import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@framework/utils";

interface AccordionProps {
  items: { title: string; content: React.ReactNode }[];
  allowMultiple?: boolean; // 여러 개 동시 열기 허용 여부 (true/false)
  hasIcon?: boolean;       // 화살표 아이콘 표시 여부
  hasBorder?: boolean;     // 항목 간 구분선 유무
  isFlush?: boolean;       // 배경색 없이 평평한 디자인 여부
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  hasIcon = true,
  hasBorder = true,
  isFlush = false,
  className,
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => prev.includes(index) ? [] : [index]);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        return (
          <div 
            key={index} 
            className={cn(
              "transition-all duration-500 overflow-hidden",
              !isFlush && "bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md",
              hasBorder && index !== items.length - 1 && isFlush && "border-b border-gray-100 pb-4"
            )}
          >
            <button
              onClick={() => toggleIndex(index)}
              className="w-full px-8 py-6 flex justify-between items-center text-left group"
            >
              <span className={cn(
                "text-lg font-black transition-colors tracking-tight",
                isOpen ? "text-indigo-600" : "text-gray-900 group-hover:text-indigo-600"
              )}>
                {item.title}
              </span>
              {hasIcon && (
                <ChevronDown 
                  size={24} 
                  className={cn(
                    "text-gray-300 transition-transform duration-500",
                    isOpen && "transform rotate-180 text-indigo-600"
                  )} 
                />
              )}
            </button>
            <div 
              className={cn(
                "transition-all duration-500 ease-in-out",
                isOpen ? "max-h-[1000px] opacity-100 pb-8 px-8" : "max-h-0 opacity-0"
              )}
            >
              <div className="text-gray-500 font-medium leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
