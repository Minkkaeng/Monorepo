import React from "react";
import { cn } from "@framework/utils";

interface NavigationProps {
  logo: React.ReactNode;
  links: { label: string; href: string }[];
  actions?: React.ReactNode;
  isSticky?: boolean;         // 상단 고정 여부 (true/false)
  isTransparent?: boolean;    // 배경 투명 여부
  hasBottomBorder?: boolean;  // 하단 경계선 유무
  isGlassmorphism?: boolean;  // 글래스모피즘 효과 유무
  showLinks?: boolean;        // 메뉴 링크 표시 여부
  showActions?: boolean;      // 우측 액션(버튼 등) 표시 여부
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  logo,
  links,
  actions,
  isSticky = true,
  isTransparent = false,
  hasBottomBorder = true,
  isGlassmorphism = true,
  showLinks = true,
  showActions = true,
  className,
}) => {
  return (
    <nav
      className={cn(
        "z-50 w-full transition-all duration-300",
        isSticky ? "fixed top-0 left-0 right-0" : "relative",
        isTransparent ? "bg-transparent" : "bg-white",
        isGlassmorphism && !isTransparent && "bg-white/70 backdrop-blur-md",
        hasBottomBorder && !isTransparent && "border-b border-gray-100",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            {logo}
          </div>
          
          {showLinks && (
            <div className="hidden md:flex flex-1 justify-center space-x-10">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-500 hover:text-indigo-600 px-1 py-2 text-sm font-bold tracking-tight transition-all relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
                </a>
              ))}
            </div>
          )}

          {showActions && (
            <div className="flex items-center space-x-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
