import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaChevronDown } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { Loader2 } from 'lucide-react';
import { fetchStylesByBaseCategory } from '../../data/apiService';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

const BRANDS_SUBCATEGORIES = [
  'T-Shirts - Core',
  'T-Shirts - Long Sleeve', 
  'T-Shirts - Premium',
  'Sport Shirts',
  'Athletics',
  'Fleece - Core - Crew',
  'Fleece - Core - Hood',
  'Fleece - Premium - Crew',
  'Fleece - Premium - Hood',
  'Quarter-Zips',
  'Headwear',
  'Bags',
  'Bottoms',
  'Outerwear',
  'Workwear',
  'Wovens',
  'Accessories',
  'Medical',
  'Office Use'
];

// Function to fetch products from all subcategories
const fetchAllBrandsProducts = async (): Promise<any[]> => {
  try {
    const allProducts = [];
    
    for (const subcategory of BRANDS_SUBCATEGORIES) {
      try {
        const response = await fetchStylesByBaseCategory(subcategory, 1000, 0);
        
        if (response && Array.isArray(response)) {
          allProducts.push(...response);
        } else if (response?.products && Array.isArray(response.products)) {
          allProducts.push(...response.products);
        } else if (response?.data && Array.isArray(response.data)) {
          allProducts.push(...response.data);
        }
      } catch (error) {
        console.warn(`Failed to fetch products for ${subcategory}:`, error);
      }
    }
    
    return allProducts;
  } catch (error) {
    console.error('Error fetching brands products:', error);
    throw error;
  }
};

const BrandsPage: React.FC = () => {
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
    queryKey: ['brands-all'],
    queryFn: fetchAllBrandsProducts,
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
          product.brand?.toLowerCase().includes(brand.toLowerCase()) ||
          product.name?.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }
    
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => 
        selectedColors.some(color => 
          product.color?.toLowerCase().includes(color.toLowerCase()) ||
          product.name?.toLowerCase().includes(color.toLowerCase())
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

  const handleSubcategoryChange = (subcategory: string) => {
    setCurrentSubcategory(subcategory);
    // Reset filters when changing subcategory
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 1000 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2563eb] flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <span className="text-lg">Loading brand products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#2563eb] flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error Loading Products</h2>
          <p className="text-lg mb-4">We're having trouble loading the brand products.</p>
          <button 
            onClick={() => refetch()}
            className="bg-white text-[#2563eb] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2563eb] text-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <Breadcrumbs />
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Brand Collection</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Shop premium branded apparel from top manufacturers. 
            High-quality products from trusted brands for professional uniforms and custom apparel.
          </p>
        </div>

        {/* Subcategory Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Shop by Category:</h3>
          <div className="flex flex-wrap gap-2">
            {BRANDS_SUBCATEGORIES.map((subcategory) => (
              <button
                key={subcategory}
                onClick={() => handleSubcategoryChange(subcategory)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentSubcategory === subcategory
                    ? 'bg-white text-[#2563eb]'
                    : 'bg-[#1e40af] text-white hover:bg-[#1d4ed8]'
                }`}
              >
                {subcategory}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="col-span-1 bg-[#f3f8fa] p-6 rounded-xl shadow-lg border border-[#2563eb]">
            {/* Category Filter */}
            <div className="mb-6 border-b border-gray-300 pb-4">
              <h2
                className="text-xl font-semibold flex justify-between items-center cursor-pointer text-[#222]"
                onClick={() => toggleTab('CATEGORY')}
              >
                CATEGORY
                <FaChevronDown
                  className={`transition-transform ${
                    activeTab === 'CATEGORY' ? 'rotate-180' : ''
                  }`}
                />
              </h2>
              {activeTab === 'CATEGORY' && (
                <ul className="mt-4 space-y-2 text-sm text-[#555]">
                  {BRANDS_SUBCATEGORIES.map((category) => (
                    <li key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="accent-[#2563eb]"
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => handleFilterChange('category', category, e.target.checked)}
                      />
                      <span>{category}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Brand Filter */}
            <div className="mb-6 border-b border-gray-300 pb-4">
              <h2
                className="text-xl font-semibold flex justify-between items-center cursor-pointer text-[#222]"
                onClick={() => toggleTab('BRANDS')}
              >
                BRANDS
                <FaChevronDown
                  className={`transition-transform ${
                    activeTab === 'BRANDS' ? 'rotate-180' : ''
                  }`}
                />
              </h2>
              {activeTab === 'BRANDS' && (
                <ul className="mt-4 space-y-2 text-sm text-[#555]">
                  {BRANDS.map((brand) => (
                    <li key={brand} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="accent-[#2563eb]"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => handleFilterChange('brand', brand, e.target.checked)}
                      />
                      <span>{brand}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Color Filter */}
            <div className="mb-6 border-b border-gray-300 pb-4">
              <h2
                className="text-xl font-semibold flex justify-between items-center cursor-pointer text-[#222]"
                onClick={() => toggleTab('COLOR')}
              >
                COLOR
                <FaChevronDown
                  className={`transition-transform ${
                    activeTab === 'COLOR' ? 'rotate-180' : ''
                  }`}
                />
              </h2>
              {activeTab === 'COLOR' && (
                <ul className="mt-4 space-y-2 text-sm text-[#555]">
                  {COLORS.map((color) => (
                    <li key={color} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="accent-[#2563eb]"
                        checked={selectedColors.includes(color)}
                        onChange={(e) => handleFilterChange('color', color, e.target.checked)}
                      />
                      <span>{color}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="pb-2">
              <h2
                className="text-xl font-semibold flex justify-between items-center cursor-pointer text-[#222]"
                onClick={() => toggleTab('PRICE')}
              >
                PRICE
                <FaChevronDown
                  className={`transition-transform ${
                    activeTab === 'PRICE' ? 'rotate-180' : ''
                  }`}
                />
              </h2>
              {activeTab === 'PRICE' && (
                <div className="mt-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    className="w-full cursor-pointer accent-[#2563eb]"
                  />
                  <div className="flex justify-between text-[#555] text-sm mt-2">
                    <span>${priceRange.min}</span>
                    <span>${priceRange.max}+</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    className="bg-white p-4 rounded-xl border border-[#2563eb] shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
                  >
                    <img
                      src={product.imageUrl || product.image || '/public/img01.avif'}
                      alt={product.name}
                      className="h-48 w-full object-cover rounded-lg mb-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/public/img01.avif';
                      }}
                    />
                    <h3 className="text-lg font-bold mb-1 truncate text-[#222]">
                      {product.name || 'Product Name'}
                    </h3>
                    <div className="flex items-center text-yellow-400 text-sm mb-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <AiFillStar
                          key={i}
                          className={
                            i < Math.floor(product.rating || 4.5)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                      <span className="ml-2 text-gray-500">
                        {(product.rating || 4.5).toFixed(1)}
                      </span>
                    </div>
                    <p className="text-[#2563eb] font-semibold text-lg">
                      ${product.price || '29.99'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.brand || 'Brand'} • {product.category || 'Category'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                <p className="text-gray-200">
                  No brand products found for "{currentSubcategory}" with the selected filters.
                  Try adjusting your filter criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;
