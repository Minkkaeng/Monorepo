export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299000,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    description: "Experience world-class sound with our flagship wireless headphones.",
  },
  {
    id: 2,
    name: "Minimalist Smart Watch",
    price: 159000,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    description: "Elegant design meets powerful technology on your wrist.",
  },
  {
    id: 3,
    name: "Leather Messenger Bag",
    price: 89000,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    description: "Premium leather bag for the modern professional.",
  },
  {
    id: 4,
    name: "Sustainable Coffee Cup",
    price: 25000,
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    description: "Eco-friendly materials, perfect for your daily brew.",
  },
  {
    id: 5,
    name: "Mechanical Keyboard",
    price: 129000,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80",
    description: "Tactile feedback and RGB lighting for ultimate productivity.",
  },
  {
    id: 6,
    name: "Ceramic Vase Set",
    price: 45000,
    category: "Home",
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&q=80",
    description: "Handcrafted ceramic vases to elevate your living space.",
  },
];
