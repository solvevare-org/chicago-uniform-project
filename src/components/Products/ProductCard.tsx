import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  subname?: string;
  image: string;
  price: number;
  lastSalePrice?: number;
  lowestAskPrice?: number;
  askText?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <a href={`/product/${product.id}`} className="block">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
            />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
          {product.subname && (
            <p className="text-sm text-gray-600 mt-1">{product.subname}</p>
          )}
          <div className="mt-2">
            {product.lowestAskPrice && (
              <div className="text-xs text-gray-500">
                {product.askText || "Lowest Ask"}
              </div>
            )}
            <div className="font-bold text-lg">{formatPrice(product.price)}</div>
            {product.lastSalePrice && (
              <div className="text-xs text-gray-500 mt-1">
                Last Sale: {formatPrice(product.lastSalePrice)}
              </div>
            )}
          </div>
        </div>
      </a>
    </div>
  );
};

export default ProductCard;