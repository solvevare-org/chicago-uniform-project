import React, { useEffect, useState } from 'react';
import { getAccessoriesProducts } from '../data/products';
import ProductGrid from './Products/ProductGrid';
import { Product } from './Products/ProductCard';

const AccessoriesHomeSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAccessoriesProducts(10);
        setProducts(data);
      } catch (err: any) {
        setError('Failed to load accessories');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-gray-400 px-4 py-8">Loading accessories...</div>;
  if (error) return <div className="text-red-500 px-4 py-8">{error}</div>;
  if (!products.length) return null;

  return (
    <ProductGrid
      title="Accessories"
      products={products}
      showMoreLink="/category/Accessories"
      horizontalScroll={true}
      maxItems={10}
    />
  );
};

export default AccessoriesHomeSection;
