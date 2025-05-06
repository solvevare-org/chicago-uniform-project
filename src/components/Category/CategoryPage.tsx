import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const categories = [
  { name: 'Collectibles', subcategories: ['Figures', 'Toys', 'Comic Books', 'Homeware', 'Skate Decks', 'Games'] },
];

const products = [
  {
    name: 'Pop Mart Labubu The Monsters Big into Energy',
    price: 'Lowest Ask',
    sold: '--',
    image: '/public/img01.avif',
  },
  {
    name: 'Barbie Signature LeBarbie Lebron James Doll',
    price: 'Lowest Ask',
    sold: '--',
    image: '/public/360-images/img02.avif',
  },
  {
    name: 'Supreme Transformers G1 Optimus Prime Figure Red',
    price: 'Lowest Ask',
    sold: '--',
    image: '/public/360-images/img03.avif',
  },
  {
    name: 'Pop Mart Labubu The Monsters Tasty Macarons',
    price: 'Lowest Ask',
    sold: '--',
    image: '/public/360-images/img04.avif',
  },
];

const CategoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const toggleTab = (tabName: string) => {
    setActiveTab(activeTab === tabName ? null : tabName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black text-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-gray-400 text-sm mb-6">
          <span className="hover:underline cursor-pointer">Home</span> / <span className="text-white font-semibold">Collectibles</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Section */}
          <div className="col-span-1 bg-gray-900 p-6 rounded-lg shadow-lg">
            <div className="border-b border-gray-700 pb-4 mb-4">
              <h2
                className="text-xl font-bold flex justify-between items-center cursor-pointer hover:text-gray-300"
                onClick={() => toggleTab('CATEGORY')}
              >
                CATEGORY
                <FaChevronDown
                  className={`transition-transform ${activeTab === 'CATEGORY' ? 'rotate-180' : ''}`}
                />
              </h2>
              {activeTab === 'CATEGORY' && (
                <ul className="mt-4 space-y-2">
                  {categories[0].subcategories.map((subcategory) => (
                    <li
                      key={subcategory}
                      className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                    >
                      {subcategory}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-b border-gray-700 pb-4 mb-4">
              <h2
                className="text-xl font-bold flex justify-between items-center cursor-pointer hover:text-gray-300"
                onClick={() => toggleTab('BRANDS')}
              >
                BRANDS
                <FaChevronDown
                  className={`transition-transform ${activeTab === 'BRANDS' ? 'rotate-180' : ''}`}
                />
              </h2>
              {activeTab === 'BRANDS' && (
                <ul className="mt-4 space-y-2">
                  <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Nike</li>
                  <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Adidas</li>
                  <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Puma</li>
                </ul>
              )}
            </div>

            <div className="border-b border-gray-700 pb-4 mb-4">
              <h2
                className="text-xl font-bold flex justify-between items-center cursor-pointer hover:text-gray-300"
                onClick={() => toggleTab('COLOR')}
              >
                COLOR
                <FaChevronDown
                  className={`transition-transform ${activeTab === 'COLOR' ? 'rotate-180' : ''}`}
                />
              </h2>
              {activeTab === 'COLOR' && (
                <ul className="mt-4 space-y-2">
                  <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Red</li>
                  <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Blue</li>
                  <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Black</li>
                </ul>
              )}
            </div>

            <div>
              <h2
                className="text-xl font-bold flex justify-between items-center cursor-pointer hover:text-gray-300"
                onClick={() => toggleTab('PRICE')}
              >
                PRICE
                <FaChevronDown
                  className={`transition-transform ${activeTab === 'PRICE' ? 'rotate-180' : ''}`}
                />
              </h2>
              {activeTab === 'PRICE' && (
                <div className="mt-4">
                  <input
                    type="range"
                    min="50"
                    max="500"
                    className="w-full cursor-pointer"
                  />
                  <div className="flex justify-between text-gray-400 text-sm mt-2">
                    <span>$50</span>
                    <span>$500</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Grid Section */}
          <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-gray-900 p-4 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 relative"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-48 w-full object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-bold mb-2 truncate hover:text-gray-300 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm">{product.price}</p>
                <p className="text-gray-400 text-sm">{product.sold}</p>
                <button className="absolute top-4 right-4 bg-gray-800 p-2 rounded-full hover:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;