import React from "react";
import { cn } from "@framework/utils";

interface FooterProps {
  logo?: React.ReactNode;
  description?: string;
  links: { title: string; items: { label: string; href: string }[] }[];
  showNewsletter?: boolean; // 뉴스레터 구독란 표시 여부 (true/false)
  showSocials?: boolean;    // 소셜 링크 표시 여부
  hasBorder?: boolean;     // 상단 테두리 유무
  isDark?: boolean;        // 다크 모드 디자인 여부
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logo,
  description,
  links,
  showNewsletter = true,
  showSocials = true,
  hasBorder = true,
  isDark = false,
  className,
}) => {
  return (
    <footer className={cn(
      "py-20 px-8 transition-colors",
      isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900",
      hasBorder && !isDark && "border-t border-gray-100",
      className
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          <div className="md:col-span-4 space-y-8">
            {logo && <div className="animate-fade-in">{logo}</div>}
            {description && (
              <p className={cn(
                "text-lg font-medium leading-relaxed max-w-sm",
                isDark ? "text-gray-400" : "text-gray-500"
              )}>
                {description}
              </p>
            )}
          </div>

          <div className="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-10">
            {links.map((group) => (
              <div key={group.title} className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.2em]">{group.title}</h4>
                <ul className="space-y-4">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <a 
                        href={item.href} 
                        className={cn(
                          "text-sm font-bold transition-all hover:pl-2",
                          isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-indigo-600"
                        )}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {showNewsletter && (
            <div className="md:col-span-3 space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em]">Stay Connected</h4>
              <div className="flex bg-gray-50 p-2 rounded-2xl border border-gray-100">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-transparent border-none outline-none px-4 py-2 flex-1 text-sm font-bold text-gray-900 placeholder:text-gray-300"
                />
                <button className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg active:scale-90">
                  Join
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={cn(
          "pt-10 flex flex-col md:flex-row justify-between items-center border-t",
          isDark ? "border-gray-800" : "border-gray-50"
        )}>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
            © {new Date().getFullYear()} PREMIUM FRAMEWORK. ALL RIGHTS RESERVED.
          </p>
          {showSocials && (
            <div className="flex space-x-6 mt-6 md:mt-0">
               {/* Social Icons would go here */}
               <span className="text-xs font-black text-indigo-600 cursor-pointer hover:underline uppercase tracking-tighter">Twitter</span>
               <span className="text-xs font-black text-indigo-600 cursor-pointer hover:underline uppercase tracking-tighter">Instagram</span>
               <span className="text-xs font-black text-indigo-600 cursor-pointer hover:underline uppercase tracking-tighter">LinkedIn</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
