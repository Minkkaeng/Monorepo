import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@framework/utils";

interface BannerProps {
  images: { src: string; alt?: string; title?: string; subtitle?: string }[];
  isAutoSlide?: boolean; // 슬라이드 자동 재생 여부
  hasArrows?: boolean;   // 좌우 화살표 유무
  hasDots?: boolean;     // 하단 인디케이터 유무
  hasCaption?: boolean;  // 캡션(제목/소제목) 표시 여부
  isInfinite?: boolean;  // 무한 루프 여부
  pauseOnHover?: boolean; // 호버 시 일시정지 여부
  interval?: number;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({
  images,
  isAutoSlide = true,
  hasArrows = true,
  hasDots = true,
  hasCaption = true,
  isInfinite = true,
  pauseOnHover = true,
  interval = 5000,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (!isInfinite && currentIndex === images.length - 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [currentIndex, images.length, isInfinite]);

  const prevSlide = () => {
    if (!isInfinite && currentIndex === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (!isAutoSlide || isPaused) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [isAutoSlide, isPaused, interval, nextSlide]);

  if (!images || images.length === 0) return null;

  return (
    <div 
      className={cn("relative w-full overflow-hidden group rounded-3xl bg-gray-100", className)}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <div key={index} className="w-full flex-shrink-0 relative aspect-[21/9]">
            <img
              src={img.src}
              alt={img.alt || `Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {hasCaption && (img.title || img.subtitle) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-12 text-white">
                {img.subtitle && (
                  <span className="text-sm font-bold uppercase tracking-widest mb-2 animate-fade-in">
                    {img.subtitle}
                  </span>
                )}
                {img.title && (
                  <h2 className="text-4xl md:text-5xl font-black mb-4 animate-slide-up">
                    {img.title}
                  </h2>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {hasArrows && images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={!isInfinite && currentIndex === 0}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-white/10 backdrop-blur-xl text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 disabled:hidden"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={nextSlide}
            disabled={!isInfinite && currentIndex === images.length - 1}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-white/10 backdrop-blur-xl text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 disabled:hidden"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {hasDots && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 bg-black/10 backdrop-blur-md p-2 rounded-full border border-white/10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                currentIndex === index ? "bg-white w-8" : "bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
