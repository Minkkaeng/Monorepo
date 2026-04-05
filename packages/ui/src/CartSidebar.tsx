import React from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { cn } from "@framework/utils";

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (index: number) => void;
  onCheckout?: () => void;
  showFooter?: boolean;    // 하단 결제 영역 표시 여부 (true/false)
  showHeader?: boolean;    // 헤더 영역 표시 여부
  hasAnimation?: boolean;  // 애니메이션 적용 여부
  className?: string;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onCheckout,
  showFooter = true,
  showHeader = true,
  hasAnimation = true,
  className,
}) => {
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  if (!isOpen) return null;

  return (
    <div className={cn("fixed inset-0 z-[100] overflow-hidden", className)}>
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={onClose} 
      />
      <div className={cn(
        "absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col",
        hasAnimation && "animate-slide-in-right"
      )}>
        {showHeader && (
          <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
                <ShoppingBag size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Shopping Bag</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2.5 hover:bg-gray-200 rounded-2xl transition-all group active:scale-90"
            >
              <X size={20} className="text-gray-400 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-200 space-y-4">
               <div className="p-8 bg-gray-50 rounded-full">
                 <ShoppingBag size={64} strokeWidth={1} />
               </div>
               <p className="text-lg font-black text-gray-400">Your bag is empty</p>
               <button onClick={onClose} className="text-indigo-600 font-bold hover:underline">Continue Shopping</button>
            </div>
          ) : (
            items.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className="flex items-center space-x-4 p-4 rounded-3xl border border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/5 transition-all group"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-sm">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 truncate leading-tight mb-1">{item.name}</p>
                  <p className="text-sm text-indigo-600 font-black">₩{item.price.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => onRemove(index)}
                  className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {showFooter && items.length > 0 && (
          <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-6">
            <div className="flex justify-between items-center px-2">
              <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total Amount</span>
              <span className="text-3xl font-black text-gray-900">₩{totalPrice.toLocaleString()}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 active:scale-[0.98]"
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
