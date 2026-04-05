import React, { useState } from "react";
import Navigation from "./components/Navigation";
import { products, Product } from "./data/products";
import { useLocalStorage } from "@framework/hooks";
import { formatDate } from "@framework/utils";
import { 
  Banner, 
  ProductCard, 
  CartSidebar, 
  ToastContainer, 
  Toast,
  Hero,
  Features,
  Pricing,
  Accordion,
  ContactForm,
  Footer,
  Modal,
  Button
} from "@framework/ui";
import { ShoppingBag, Zap, ShieldCheck, Heart } from "lucide-react";

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const App: React.FC = () => {
  const [cart, setCart] = useLocalStorage<Product[]>("mall-cart", []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastMessage["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddToCart = (product: Product) => {
    setCart([...cart, product]);
    addToast(`${product.name}이(가) 장바구니에 담겼습니다.`);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const bannerImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=2070"
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navigation 
        isSticky={true}
        isGlassmorphism={true}
        hasBottomBorder={true}
      />

      <main className="pt-20">
        {/* 1. Hero Section */}
        <Hero 
          subtitle="Innovation & Elegance"
          title="The Future of Premium Shopping"
          description="Experience a new standard of quality and design. Our curated collection brings you the best from around the globe, delivered with uncompromising service."
          backgroundImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070"
          primaryAction={{ label: "Shop Collection", onClick: () => {} }}
          secondaryAction={{ label: "Learn More", onClick: () => setIsModalOpen(true) }}
          isCentered={true}
          isFullHeight={false}
        />

        {/* 2. Banner / Promotions */}
        <section className="px-8 max-w-7xl mx-auto mb-24">
          <Banner 
            images={bannerImages} 
            className="shadow-3xl shadow-indigo-100"
            isAutoSlide={true}
            hasArrows={true}
            hasDots={true}
          />
        </section>

        {/* 3. Features Section */}
        <Features 
          subtitle="Why Choose Us"
          title="Designed for Perfection"
          items={[
            { icon: <Zap />, title: "Lightning Fast", description: "Global express shipping that puts our products in your hands in record time." },
            { icon: <ShieldCheck />, title: "Secure Payment", description: "Fully encrypted transaction layer ensuring your data and assets are always protected." },
            { icon: <Heart />, title: "Curated Quality", description: "Every single item is hand-picked and verified by our board of expert designers." },
          ]}
          columns={3}
          isCardStyle={true}
          className="bg-gray-50/50"
        />

        {/* 4. Product Gallery */}
        <section id="products" className="py-24 px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-l-4 border-indigo-600 pl-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase">
                Featured Items
              </h2>
              <p className="text-xl text-gray-400 font-medium italic mt-2">
                Curated for your lifestyle. {formatDate(new Date())}
              </p>
            </div>
            <div className="flex items-center space-x-3 text-indigo-600 bg-indigo-50 px-6 py-3 rounded-2xl text-sm font-black border border-indigo-100 shadow-sm">
              <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse" />
              <span className="tracking-tight uppercase">24 NEW ITEMS ARRIVED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
                showDescription={false}
                isElevated={true}
                onAction={() => handleAddToCart(product)} 
              />
            ))}
          </div>
        </section>

        {/* 5. Pricing Section */}
        <Pricing 
          title="Premium Membership"
          plans={[
            { name: "Starter", price: "₩0", period: "/mo", features: ["Standard Shipping", "Member Profile", "Basic Support"], actionLabel: "Join Free" },
            { name: "Premium", price: "₩19,000", period: "/mo", features: ["Express Shipping", "Early Access", "Priority Support", "Member Rewards"], isFeatured: true, actionLabel: "Upgrade Now" },
            { name: "Elite", price: "₩49,000", period: "/mo", features: ["Concierge Service", "Unlimited Returns", "Private Sales", "VIP Packaging"], actionLabel: "Contact Sales" },
          ]}
          hasShadow={true}
          className="bg-white"
        />

        {/* 6. FAQ (Accordion) */}
        <section className="py-24 px-8 max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 tracking-tighter">Frequently Asked Questions</h2>
          <Accordion 
            items={[
              { title: "What is your return policy?", content: "We offer a 30-day no-questions-asked return policy for all unused items in their original packaging." },
              { title: "How long does global shipping take?", content: "Standard shipping takes 7-10 business days, while Premium members enjoy 2-3 business day express delivery." },
              { title: "Are the products authentic?", content: "Yes, every product in our collection is authentic and comes with a certificate of origin and quality guarantee." },
            ]}
            allowMultiple={false}
            isFlush={false}
          />
        </section>

        {/* 7. Contact Form */}
        <ContactForm 
          title="Let's Connect"
          subtitle="Have a special request or need assistance? Reach out to our 24/7 concierge team."
          className="bg-gray-50/50"
        />
      </main>

      <Footer 
        logo={<span className="text-2xl font-black tracking-tighter text-indigo-600">PREMIUM MALL</span>}
        description="Redefining the standards of lifestyle and luxury with a curated collection of global essentials."
        links={[
          { title: "Shop", items: [{ label: "New Arrivals", href: "#" }, { label: "Limited Edition", href: "#" }] },
          { title: "Support", items: [{ label: "Help Center", href: "#" }, { label: "Contact Us", href: "#" }] },
          { title: "Legal", items: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }] },
        ]}
        isDark={true}
      />

      {/* Floating Cart Trigger */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-10 right-10 z-40 bg-gray-900 text-white p-6 rounded-3xl shadow-3xl hover:bg-indigo-600 hover:-translate-y-2 transition-all active:scale-95 group"
      >
        <div className="relative">
          <ShoppingBag size={28} className="group-hover:animate-bounce" />
          {cart.length > 0 && (
            <span className="absolute -top-4 -right-4 bg-indigo-500 text-white text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center border-4 border-gray-900 group-hover:border-indigo-600 transition-colors">
              {cart.length}
            </span>
          )}
        </div>
      </button>

      {/* Overlays: Cart, Modal, Toast */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onCheckout={() => addToast("결제 페이지로 이동합니다.", "info")}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Welcome to Premium Mall"
      >
        <p className="mb-6">Discover our story and how we curate the world's finest products just for you. Our mission is to elevate your lifestyle through design and quality.</p>
        <Button onClick={() => setIsModalOpen(false)} className="w-full">Get Started</Button>
      </Modal>

      <ToastContainer>
        {toasts.map((toast) => (
          <Toast 
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>

      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-8 mb-8 text-gray-400 font-bold uppercase text-xs tracking-widest">
             <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-indigo-600 transition-colors">Contact Us</a>
          </div>
          <p className="text-gray-300 text-sm font-medium">
            &copy; 2026 Premium Mall. Built with @framework/ui & Turborepo.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
