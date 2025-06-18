import React from 'react';
import ProductCard, { Product } from './ProductCard';

interface ProductGridProps {
  title: string;
  products: any[]; // Accepts any[] for flexibility with API shape
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
          <h2 className="text-xl md:text-2xl font-bold text-[#222]">{title}</h2>
          {infoIcon && (
            <button className="ml-2 w-5 h-5 rounded-full bg-[#b3ddf3] text-[#222] flex items-center justify-center text-xs">
              ?
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <div key={product._id || product.id} className="bg-[#b3ddf3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 border border-[#b3ddf3]">
              <a href={product.sku ? `/product/${product.sku}` : '#'} className="block">
                <div className="relative">
                  <img
                    src={product.colorFrontImage ? `https://www.ssactivewear.com/${product.colorFrontImage}` : product.image}
                    alt={product.styleName || product.name}
                    className="w-full h-56 object-cover rounded-t-xl bg-white"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#222] text-lg line-clamp-2">{product.styleName || product.name}</h3>
                  {product.colorName && (
                    <div className="flex items-center mt-1">
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-[#b3ddf3] mr-2"
                        style={{ backgroundColor: product.hexColor || '#b3ddf3' }}
                      ></span>
                      <p className="text-sm text-gray-700">{product.colorName}</p>
                    </div>
                  )}
                  <div className="mt-3">
                    <div className="font-bold text-xl text-[#222]">
                      ${product.salePrice ? product.salePrice.toFixed(2) : product.price}
                    </div>
                    {product.qty !== undefined && (
                      <div className="text-xs text-gray-700 mt-1">
                        In Stock: {product.caseQty}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;