import React from "react";
import { cn } from "@framework/utils";
import { Button } from "../atoms/Button";

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  isCentered?: boolean;      // 텍스트 중앙 정렬 여부 (true/false)
  isFullHeight?: boolean;    // 전체 화면 높이 사용 여부
  hasOverlay?: boolean;     // 배경 오버레이 유무
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  primaryAction,
  secondaryAction,
  isCentered = true,
  isFullHeight = false,
  hasOverlay = true,
  className,
}) => {
  return (
    <section 
      className={cn(
        "relative overflow-hidden flex items-center bg-gray-900 rounded-[3rem] mx-4 my-8",
        isFullHeight ? "min-h-screen" : "min-h-[600px]",
        isCentered ? "justify-center text-center" : "justify-start text-left",
        className
      )}
    >
      {backgroundImage && (
        <div className="absolute inset-0">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
          {hasOverlay && <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />}
        </div>
      )}

      <div className={cn(
        "relative z-10 max-w-5xl px-8 py-20 flex flex-col",
        isCentered ? "items-center" : "items-start"
      )}>
        {subtitle && (
          <span className="text-indigo-400 font-black uppercase tracking-[0.4em] mb-6 animate-fade-in text-sm">
            {subtitle}
          </span>
        )}
        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-slide-up">
          {title}
        </h1>
        {description && (
          <p className="text-xl md:text-2xl text-gray-300 font-medium mb-12 max-w-2xl leading-relaxed animate-fade-in delay-100">
            {description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-4 animate-slide-up delay-200">
          {primaryAction && (
            <Button size="lg" onClick={primaryAction.onClick} className="rounded-2xl px-10 py-5">
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" size="lg" onClick={secondaryAction.onClick} className="rounded-2xl px-10 py-5 border-white/20 text-white hover:bg-white/10">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
