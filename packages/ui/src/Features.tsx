import React from "react";
import { cn } from "@framework/utils";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesProps {
  title?: string;
  subtitle?: string;
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
  showIcons?: boolean;      // 아이콘 표시 여부 (true/false)
  hasBorder?: boolean;     // 테두리 유무
  isCardStyle?: boolean;   // 카드 스타일 여부
  className?: string;
}

export const Features: React.FC<FeaturesProps> = ({
  title,
  subtitle,
  items,
  columns = 3,
  showIcons = true,
  hasBorder = false,
  isCardStyle = true,
  className,
}) => {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <section className={cn("py-24 px-8", className)}>
      {(title || subtitle) && (
        <div className="text-center mb-16 space-y-4">
          {subtitle && (
            <span className="text-indigo-600 font-black uppercase tracking-widest text-sm italic">
              {subtitle}
            </span>
          )}
          {title && <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">{title}</h2>}
        </div>
      )}

      <div className={cn("grid grid-cols-1 gap-10 max-w-7xl mx-auto", gridCols[columns])}>
        {items.map((item, index) => (
          <div 
            key={index}
            className={cn(
              "transition-all duration-500",
              isCardStyle ? "p-10 bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 border border-gray-50" : "p-0",
              hasBorder && !isCardStyle && "border border-gray-100 p-8 rounded-3xl"
            )}
          >
            {showIcons && (
              <div className="mb-8 p-5 bg-indigo-50 text-indigo-600 rounded-3xl w-fit shadow-inner">
                {item.icon}
              </div>
            )}
            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{item.title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
