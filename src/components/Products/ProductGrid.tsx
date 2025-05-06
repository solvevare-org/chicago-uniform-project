import React from 'react';
import ProductCard, { Product } from './ProductCard';

interface ProductGridProps {
  title: string;
  products: Product[];
  infoIcon?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  title, 
  products,
  infoIcon = false
}) => {
  return (
    <div className="my-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
          {infoIcon && (
            <button className="ml-2 w-5 h-5 rounded-full bg-gray-600 text-white flex items-center justify-center text-xs">
              ?
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;