import React from 'react';

interface SmallProductGridProps {
  title: string;
  products: any[];
}

const SmallProductGrid: React.FC<SmallProductGridProps> = ({ title, products }) => {
  return (
    <div className="my-6 px-2 md:px-4 lg:px-6">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex items-center mb-3">
          <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.slice(0, 6).map((product) => (
            <div key={product._id || product.id} className="bg-black rounded-lg overflow-hidden shadow hover:shadow-lg transition-transform transform hover:scale-105 border border-gray-800">
              <a href={product.sku ? `/product/${product.sku}` : '#'} className="block">
                <div className="relative">
                  <img
                    src={product.colorFrontImage ? `https://www.ssactivewear.com/${product.colorFrontImage}` : product.image}
                    alt={product.styleName || product.name}
                    className="w-full h-32 object-cover rounded-t-lg bg-gray-900"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-100 text-base line-clamp-2">{product.styleName || product.name}</h3>
                  {product.colorName && (
                    <div className="flex items-center mt-1">
                      <span
                        className="inline-block w-3 h-3 rounded-full border border-gray-300 mr-2"
                        style={{ backgroundColor: product.hexColor || '#888' }}
                      ></span>
                      <p className="text-xs text-gray-400">{product.colorName}</p>
                    </div>
                  )}
                  <div className="mt-2">
                    <div className="font-bold text-base text-green-400">
                      ${product.salePrice ? product.salePrice.toFixed(2) : product.price}
                    </div>
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

export default SmallProductGrid;
