import React, { useEffect, useState } from 'react';
import { Product } from '../components/Products/ProductCard';

const AccessoriesSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:3000/api/products/by-base-category/Accessories?limit=10');
        const data = await res.json();
        setProducts(data.products ? data.products.slice(0, 10) : []);
      } catch (err: any) {
        setError('Failed to load accessories');
      } finally {
        setLoading(false);
      }
    };
    fetchAccessories();
  }, []);

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-black">Accessories</h2>
        <a
          href="/category/Accessories"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold shadow transition"
        >
          Show More Products
        </a>
      </div>
      {loading ? (
        <div className="text-gray-400">Loading accessories...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex gap-6">
            {products.map((product) => (
              <div
                key={product.id || product.sku}
                className="min-w-[220px] max-w-[220px] bg-white rounded-xl shadow border border-gray-200 flex-shrink-0 flex flex-col items-center p-4"
              >
                <img
                  src={product.image || `https://www.ssactivewear.com/${product.colorFrontImage}`}
                  alt={product.name || product.styleName}
                  className="h-32 w-full object-cover rounded mb-3"
                />
                <div className="font-semibold text-gray-900 text-base text-center mb-1 truncate w-full">
                  {product.name || product.styleName}
                </div>
                <div className="text-green-500 font-bold text-lg mb-1">
                  ${product.price || product.salePrice}
                </div>
                {product.brandName && (
                  <div className="text-xs text-gray-500 mb-1">{product.brandName}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default AccessoriesSection;
