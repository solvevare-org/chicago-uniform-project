import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductsByCategory } from '../data/apiService';
import ProductCard from '../components/Products/ProductCard';

const DynamicCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      console.log('Fetching products for categoryId:', categoryId); // Debugging log

      try {
        const data = await fetchProductsByCategory(categoryId!);
        console.log('API response:', data); // Debugging log

        if (data.length === 0) {
          setError('No products found for this category.');
        } else {
          setProducts(data);
        }
      } catch (error) {
        setError(`Failed to load products. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      loadProducts();
    } else {
      setError('Invalid category.');
      setLoading(false);
    }
  }, [categoryId]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] to-black text-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-gray-400 text-sm mb-6">
          <span className="hover:underline cursor-pointer">Home</span> / <span className="text-white font-semibold">Category</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicCategoryPage;
