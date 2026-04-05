import React from "react";
import { Check } from "lucide-react";
import { cn } from "@framework/utils";
import { Button } from "../atoms/Button";

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  features: string[];
  isFeatured?: boolean;
  actionLabel: string;
}

interface PricingProps {
  title?: string;
  plans: PricingPlan[];
  showFeatures?: boolean;  // 특징 목록 표시 여부 (true/false)
  hasShadow?: boolean;     // 그림자 효과 유무
  isCompact?: boolean;     // 컴팩트한 디자인 여부
  className?: string;
}

export const Pricing: React.FC<PricingProps> = ({
  title,
  plans,
  showFeatures = true,
  hasShadow = true,
  isCompact = false,
  className,
}) => {
  return (
    <section className={cn("py-24 px-8", className)}>
      {title && (
        <h2 className="text-4xl md:text-5xl font-black text-center mb-20 tracking-tighter text-gray-900">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={cn(
              "relative p-10 rounded-[3rem] transition-all duration-500 flex flex-col",
              plan.isFeatured ? "bg-gray-900 text-white scale-105 z-10 shadow-3xl" : "bg-white border border-gray-100 text-gray-900",
              hasShadow && !plan.isFeatured && "shadow-xl hover:shadow-2xl hover:-translate-y-2",
              isCompact ? "p-8" : "p-12"
            )}
          >
            {plan.isFeatured && (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg">
                Most Popular
              </span>
            )}
            
            <div className="mb-10">
              <h3 className={cn(
                "text-xl font-black uppercase tracking-widest mb-6",
                plan.isFeatured ? "text-indigo-400" : "text-indigo-600"
              )}>
                {plan.name}
              </h3>
              <div className="flex items-baseline space-x-2">
                 <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                 {plan.period && <span className="text-gray-400 font-bold uppercase text-xs">{plan.period}</span>}
              </div>
            </div>

            {showFeatures && (
              <ul className="mb-12 space-y-5 flex-1">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center space-x-4">
                    <div className={cn(
                      "p-1 rounded-full",
                      plan.isFeatured ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"
                    )}>
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <span className={cn(
                      "text-sm font-bold",
                      plan.isFeatured ? "text-gray-300" : "text-gray-500"
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <Button 
              variant={plan.isFeatured ? "primary" : "outline"} 
              size="lg" 
              className={cn(
                "w-full rounded-2xl py-5",
                !plan.isFeatured && "border-2 border-gray-100 hover:bg-gray-900 hover:text-white hover:border-gray-900"
              )}
            >
              {plan.actionLabel}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};
