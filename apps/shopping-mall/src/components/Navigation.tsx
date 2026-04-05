import React from "react";
import { Navigation as SharedNavigation } from "@framework/ui";
import { useAuthStore } from "@framework/store";
import { LogIn, LogOut, ShoppingCart } from "lucide-react";

interface NavigationProps {
  isSticky?: boolean;
  isTransparent?: boolean;
  isGlassmorphism?: boolean;
  hasBottomBorder?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  isSticky, 
  isTransparent, 
  isGlassmorphism, 
  hasBottomBorder 
}) => {
  const { user, logout, login } = useAuthStore();

  const logo = (
    <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tighter">
      PREMIUM MALL
    </span>
  );

  const links = [
    { label: "Home", href: "#" },
    { label: "Products", href: "#" },
    { label: "About", href: "#" },
  ];

  const actions = (
    <div className="flex items-center space-x-2">
      {user ? (
        <div className="flex items-center space-x-4">
          <span className="hidden md:block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            User / {user.name}
          </span>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-gray-900 text-white hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
          >
            <LogOut size={14} />
            <span>LOGOUT</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => login({ id: "guest", name: "Guest User", email: "guest@example.com" })}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
        >
          <LogIn size={14} />
          <span>LOGIN</span>
        </button>
      )}
      
      <button className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative">
        <ShoppingCart size={20} />
      </button>
    </div>
  );

  return (
    <SharedNavigation 
      logo={logo}
      links={links}
      actions={actions}
      isSticky={isSticky}
      isTransparent={isTransparent}
      isGlassmorphism={isGlassmorphism}
      hasBottomBorder={hasBottomBorder}
    />
  );
};

export default Navigation;
