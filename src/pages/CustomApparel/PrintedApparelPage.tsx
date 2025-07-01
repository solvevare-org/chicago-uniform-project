import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaChevronDown } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { Loader2 } from 'lucide-react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import axios from 'axios';

const API_BASE_URL = 'http://31.97.41.27:5000';

// Subcategories for Printed Apparel
const PRINTED_SUBCATEGORIES = [
  'T-Shirts - Core',
  'T-Shirts - Long Sleeve',
  'T-Shirts - Premium',
  'Sport Shirts',
  'Athletics',
  'Fleece - Core - Crew',
  'Fleece - Core - Hood',
  'Fleece - Premium - Crew',
  'Fleece - Premium - Hood',
  'Outerwear',
  'Workwear'
];

// Function to fetch products from all subcategories
const fetchAllPrintedProducts = async (): Promise<any[]> => {
  try {
    const allProducts = [];
    
    for (const subcategory of PRINTED_SUBCATEGORIES) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/styles/base-categories/${encodeURIComponent(subcategory)}`,
          { timeout: 10000 }
        );
        
        if (response.data && Array.isArray(response.data)) {
          allProducts.push(...response.data);
        } else if (response.data?.products && Array.isArray(response.data.products)) {
          allProducts.push(...response.data.products);
        }
      } catch (error) {
        console.warn(`Failed to fetch products for ${subcategory}:`, error);
      }
    }
    
    return allProducts;
  } catch (error) {
    console.error('Error fetching printed products:', error);
    throw error;
  }
};

const PrintedApparelPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  // Dynamic filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  // Dynamic filter options extracted from products
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);

  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['printed-apparel-all'],
    queryFn: fetchAllPrintedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (products && Array.isArray(products)) {
      setAllProducts(products);
      setFilteredProducts(products);
      
      // Extract dynamic filter options from products
      const brands = [...new Set(products.map(product => product.brand).filter(Boolean))].sort();
      const colors = [...new Set(products.map(product => product.color).filter(Boolean))].sort();
      
      setAvailableBrands(brands);
      setAvailableColors(colors);
    }
  }, [products]);

  // Apply filters when filter states change
  useEffect(() => {
    let filtered = [...allProducts];
    
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        selectedBrands.some(brand => 
          product.brand?.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }
    
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => 
        selectedColors.some(color => 
          product.color?.toLowerCase().includes(color.toLowerCase())
        )
      );
    }
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.some(category => 
          product.baseCategory?.toLowerCase().includes(category.toLowerCase()) ||
          product.category?.toLowerCase().includes(category.toLowerCase())
        )
      );
    }
    
    // Apply price filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price?.toString().replace(/[^0-9.]/g, '') || '0');
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    setFilteredProducts(filtered);
  }, [allProducts, selectedBrands, selectedColors, selectedCategories, priceRange]);

  const toggleTab = (tabName: string) => {
    setActiveTab(activeTab === tabName ? null : tabName);
  };

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    switch (filterType) {
      case 'brand':
        setSelectedBrands(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      case 'color':
        setSelectedColors(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      case 'category':
        setSelectedCategories(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 1000 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <span className="text-lg">Loading printed apparel...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error Loading Products</h2>
          <p className="text-lg mb-4">We're having trouble loading the printed apparel.</p>
          <button 
            onClick={() => refetch()}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Printed Apparel</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Custom printed apparel with vibrant, long-lasting designs. 
            Screen printing, digital printing, and heat transfer options for all your branding needs.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-900 rounded-lg p-6 sticky top-4">
              {/* Filter Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Results Count */}
              <div className="mb-6 p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-300">
                  Showing {filteredProducts.length} of {allProducts.length} products
                </p>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleTab('CATEGORY')}
                  className="w-full flex justify-between items-center mb-3 text-left"
                >
                  <span className="font-medium">Category</span>
                  <FaChevronDown
                    className={`transition-transform ${
                      activeTab === 'CATEGORY' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeTab === 'CATEGORY' && (
                  <div className="space-y-2 pl-4 max-h-48 overflow-y-auto">
                    {PRINTED_SUBCATEGORIES.map((category) => (
                      <label key={category} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          className="mr-2 accent-blue-500"
                          checked={selectedCategories.includes(category)}
                          onChange={(e) => handleFilterChange('category', category, e.target.checked)}
                        />
                        <span className="text-gray-300">{category}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleTab('BRANDS')}
                  className="w-full flex justify-between items-center mb-3 text-left"
                >
                  <span className="font-medium">Brands</span>
                  <FaChevronDown
                    className={`transition-transform ${
                      activeTab === 'BRANDS' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeTab === 'BRANDS' && (
                  <div className="space-y-2 pl-4 max-h-48 overflow-y-auto">
                    {availableBrands.map((brand) => (
                      <label key={brand} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          className="mr-2 accent-blue-500"
                          checked={selectedBrands.includes(brand)}
                          onChange={(e) => handleFilterChange('brand', brand, e.target.checked)}
                        />
                        <span className="text-gray-300">{brand}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleTab('COLOR')}
                  className="w-full flex justify-between items-center mb-3 text-left"
                >
                  <span className="font-medium">Colors</span>
                  <FaChevronDown
                    className={`transition-transform ${
                      activeTab === 'COLOR' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeTab === 'COLOR' && (
                  <div className="space-y-2 pl-4 max-h-48 overflow-y-auto">
                    {availableColors.map((color) => (
                      <label key={color} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          className="mr-2 accent-blue-500"
                          checked={selectedColors.includes(color)}
                          onChange={(e) => handleFilterChange('color', color, e.target.checked)}
                        />
                        <span className="text-gray-300">{color}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleTab('PRICE')}
                  className="w-full flex justify-between items-center mb-3 text-left"
                >
                  <span className="font-medium">Price Range</span>
                  <FaChevronDown
                    className={`transition-transform ${
                      activeTab === 'PRICE' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeTab === 'PRICE' && (
                  <div className="pl-4">
                    <div className="mb-4">
                      <label className="block text-sm text-gray-300 mb-2">
                        Max Price: ${priceRange.max}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                        className="w-full accent-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 && !isLoading ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">No products found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters to see more products.</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <div key={`${product.id || product.styleId || index}`} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
                    <div className="aspect-square bg-gray-800 flex items-center justify-center">
                      {product.imageUrl || product.image_url ? (
                        <img
                          src={product.imageUrl || product.image_url}
                          alt={product.name || product.style_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className="text-gray-500 text-sm">No Image</div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {product.name || product.style_name || 'Unnamed Product'}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {product.brand || 'Unknown Brand'}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">
                          ${parseFloat(product.price?.toString().replace(/[^0-9.]/g, '') || '0').toFixed(2)}
                        </span>
                        <div className="flex items-center">
                          <AiFillStar className="text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-400">4.5</span>
                        </div>
                      </div>
                      <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


