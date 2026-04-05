import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { cn } from "@framework/utils";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  showInfo?: boolean;      // 연락처 정보 표시 여부 (true/false)
  isCardStyle?: boolean;   // 카드 형태 디자인 여부
  hasShadow?: boolean;     // 그림자 유무
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  title = "Get in Touch",
  subtitle = "Have a question? We'd love to hear from you.",
  showInfo = true,
  isCardStyle = true,
  hasShadow = true,
  className,
}) => {
  return (
    <section className={cn("py-24 px-8 max-w-7xl mx-auto", className)}>
      <div className={cn(
        "grid grid-cols-1 lg:grid-cols-12 gap-12",
        isCardStyle && "bg-white p-12 rounded-[3.5rem]",
        hasShadow && isCardStyle && "shadow-3xl shadow-indigo-100/50 border border-indigo-50"
      )}>
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight">
              {title}
            </h2>
            <p className="text-lg text-gray-400 font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>

          {showInfo && (
            <div className="space-y-8 pt-6">
              {[
                { icon: <Mail />, label: "Email", value: "hello@premium.com" },
                { icon: <Phone />, label: "Phone", value: "+82 2-1234-5678" },
                { icon: <MapPin />, label: "Office", value: "Gangnam-gu, Seoul, Korea" },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-6 group cursor-pointer">
                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12">
                    {React.cloneElement(item.icon as React.ReactElement, { size: 24 })}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-1">{item.label}</p>
                    <p className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
            <Input label="First Name" placeholder="Jane" />
            <Input label="Last Name" placeholder="Doe" />
            <div className="sm:col-span-2">
              <Input label="Email Address" type="email" placeholder="jane@example.com" />
            </div>
            <div className="sm:col-span-2 space-y-2">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
               <textarea 
                 className="w-full px-5 py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all min-h-[160px]"
                 placeholder="How can we help you?"
               />
            </div>
            <div className="sm:col-span-2 pt-4">
              <Button size="lg" className="w-full py-6 rounded-2xl shadow-2xl shadow-indigo-200" rightIcon={<Send size={20} />}>
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
