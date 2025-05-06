import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <a href="/" className="flex items-center space-x-2">
      <span className="text-green-500 font-bold text-2xl">StockX</span>
    </a>
  );
};

export default Logo;