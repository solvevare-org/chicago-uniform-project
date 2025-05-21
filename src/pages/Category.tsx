import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

const CategoryPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('CATEGORY');
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: Set<string> }>({
    CATEGORY: new Set(),
    BRANDS: new Set(),
    COLOR: new Set(),
  });
  const [priceRange, setPriceRange] = useState<number>(500);
  const [visibleCount, setVisibleCount] = useState<number>(15);

  const { category } = useParams();

  // Fetch categories (for sidebar)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/api/products/by-base-category/${category}?limit=100`);
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error: any) {
        setError(error.message || 'An error occurred while fetching products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  // Toggle filter tab
  const toggleTab = (label: string) => {
    setActiveTab(activeTab === label ? null : label);
  };

  // Handle filter change
  const handleFilterChange = (type: string, value: string) => {
    setSelectedFilters((prev) => {
      const updated = new Set(prev[type]);
      if (updated.has(value)) updated.delete(value);
      else updated.add(value);
      return { ...prev, [type]: updated };
    });
  };

  // Filter products client-side
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedFilters.CATEGORY.size > 0 && !selectedFilters.CATEGORY.has(product.category)) return false;
    // Brand filter
    if (selectedFilters.BRANDS.size > 0 && !selectedFilters.BRANDS.has(product.brandName)) return false;
    // Color filter
    if (selectedFilters.COLOR.size > 0 && !selectedFilters.COLOR.has(product.colorName)) return false;
    // Price filter
    if (product.salePrice > priceRange) return false;
    return true;
  });

  // Get unique brands and colors from products
  const brands = Array.from(new Set(products.map((p) => p.brandName))).filter(Boolean);
  const colors = Array.from(new Set(products.map((p) => p.colorName))).filter(Boolean);

  // Products to display based on pagination
  const paginatedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] to-black text-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-gray-400 text-sm mb-6">
          <span className="hover:underline cursor-pointer">Home</span> /Category/
          <span className="text-white font-semibold">{category}</span>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Section */}
          <aside className="w-full md:w-64 md:sticky md:top-28 md:self-start z-10 bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-gray-700">
            {/* CATEGORY */}
            <div className="mb-6 border-b border-gray-700 pb-4">
              <h2
                className="text-xl font-semibold flex justify-between items-center cursor-pointer"
                onClick={() => toggleTab('CATEGORY')}
              >
                CATEGORY
                <FaChevronDown className={`transition-transform ${activeTab === 'CATEGORY' ? 'rotate-180' : ''}`} />
              </h2>
              {activeTab === 'CATEGORY' && (
                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                  {categories.length > 0 &&
                    categories.map((cat: any) => (
                      <li key={cat.title} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="accent-green-500"
                          checked={selectedFilters.CATEGORY.has(cat.title)}
                          onChange={() => handleFilterChange('CATEGORY', cat.title)}
                        />
                        <span>{cat.title}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
            {/* BRANDS */}
            <div className="mb-6 border-b border-gray-700 pb-4">
              <h2
                className="text-xl font-semibold flex justify-between items-center cursor-pointer"
                onClick={() => toggleTab('BRANDS')}
              >
                BRANDS
                <FaChevronDown className={`transition-transform ${activeTab === 'BRANDS' ? 'rotate-180' : ''}`} />
              </h2>
              {activeTab === 'BRANDS' && (
                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                  {brands.map((brand) => (
                    <li key={brand} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="accent-green-500"
                        checked={selectedFilters.BRANDS.has(brand)}
                        onChange={() => handleFilterChange('BRANDS', brand)}
                      />
                      <span>{brand}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* COLOR */}
            <div className="mb-6 border-b border-gray-700 pb-4">
              <h2
                className="text-xl font-semibold flex justify-between items-center cursor-pointer"
                onClick={() => toggleTab('COLOR')}
              >
                COLOR
                <FaChevronDown className={`transition-transform ${activeTab === 'COLOR' ? 'rotate-180' : ''}`} />
              </h2>
              {activeTab === 'COLOR' && (
                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                  {colors.map((color) => (
                    <li key={color} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="accent-green-500"
                        checked={selectedFilters.COLOR.has(color)}
                        onChange={() => handleFilterChange('COLOR', color)}
                      />
                      <span>{color}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* PRICE */}
            <div className="pb-2">
              <h2
                className="text-xl font-semibold flex justify-between items-center cursor-pointer"
                onClick={() => toggleTab('PRICE')}
              >
                PRICE
                <FaChevronDown className={`transition-transform ${activeTab === 'PRICE' ? 'rotate-180' : ''}`} />
              </h2>
              {activeTab === 'PRICE' && (
                <div className="mt-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                  <div className="flex justify-between text-gray-400 text-sm mt-2">
                    <span>$0</span>
                    <span>${priceRange}+</span>
                  </div>
                </div>
              )}
            </div>
          </aside>
          {/* Product Grid Section */}
          <section className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                <p className="text-center text-gray-400 col-span-full">Loading products...</p>
              ) : error ? (
                <p className="text-center text-red-500 col-span-full">{error}</p>
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, index) => (
                  <Link
                    to={`/product/${product.sku}`}
                    key={index}
                    className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-700 shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 flex flex-col"
                  >
                    <img
                      src={`https://www.ssactivewear.com/${product.colorFrontImage}`}
                      alt={product.styleName}
                      className="h-48 w-full object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-bold mb-1 truncate">
                      {product.brandName} {product.styleName}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: product.color1 }}
                      ></div>
                      <span className="text-sm text-gray-400">{product.colorName}</span>
                    </div>
                    <p className="text-green-400 font-semibold text-md">${product.salePrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">In Stock: {product.qty}</p>
                  </Link>
                ))
              ) : (
                <p className="text-gray-400 text-center col-span-full">No products found for this category.</p>
              )}
            </div>
            {/* Pagination: Show More button */}
            {!loading && !error && visibleCount < filteredProducts.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 15)}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-md transition-all"
                >
                  Show More Products
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;