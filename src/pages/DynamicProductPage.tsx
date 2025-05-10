import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductDetails } from '../data/apiService';

const DynamicProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const data = await fetchProductDetails(productId!);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [productId]);

  if (loading) return <div>Loading...</div>;

  if (!product) return <div>Product not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-green-400">{product.name}</h1>
        <div className="flex flex-col md:flex-row items-center">
          <img src={product.image} alt={product.name} className="w-full md:w-1/2 rounded-lg shadow-lg" />
          <div className="md:ml-8 mt-4 md:mt-0">
            <p className="text-lg text-gray-400 mb-4">{product.description}</p>
            <p className="text-3xl font-bold text-green-500 mb-4">${product.price}</p>
            <button className="py-2 px-4 bg-green-500 text-black rounded-lg font-medium hover:bg-green-400 transition-transform transform hover:scale-105 shadow-lg">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicProductPage;