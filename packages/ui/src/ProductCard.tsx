import React from "react";
import { Plus, Eye } from "lucide-react";
import { cn } from "@framework/utils";

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  showBadge?: boolean;      // 카테고리 배지 표시 여부 (true/false)
  showDescription?: boolean; // 설명 표시 여부
  isElevated?: boolean;     // 호버 시 들림 효과 유무
  hasQuickAdd?: boolean;    // 즉시 추가 버튼 유무
  hasQuickView?: boolean;   // 퀵 뷰 버튼 유무
  onAction?: () => void;
  onView?: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  image,
  category,
  description,
  showBadge = true,
  showDescription = false,
  isElevated = true,
  hasQuickAdd = true,
  hasQuickView = true,
  onAction,
  onView,
  className,
}) => {
  return (
    <div className={cn(
      "group bg-white rounded-3xl overflow-hidden border border-gray-100 flex flex-col transition-all duration-500",
      isElevated && "hover:shadow-2xl hover:-translate-y-2",
      className
    )}>
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {showBadge && (
          <div className="absolute top-5 left-5">
            <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md shadow-sm rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-50">
              {category}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          {hasQuickView && (
            <button 
              onClick={onView}
              className="p-4 bg-white text-gray-900 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75 shadow-xl"
            >
              <Eye size={22} />
            </button>
          )}
          {hasQuickAdd && (
            <button 
              onClick={onAction}
              className="p-4 bg-white text-gray-900 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 shadow-xl"
            >
              <Plus size={22} />
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow bg-white">
        <h3 className="text-lg font-black text-gray-900 mb-2 truncate">
          {name}
        </h3>
        {showDescription && description && (
          <p className="text-sm text-gray-400 font-medium line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-tighter">Price</span>
            <span className="text-2xl font-black text-indigo-600">
              ₩{price.toLocaleString()}
            </span>
          </div>
          {/* Quick status dots or secondary actions can go here */}
        </div>
      </div>
    </div>
  );
};
