import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { Helmet } from "react-helmet";

const CustomBagsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("CATEGORY");
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: Set<string>;
  }>({
    CATEGORY: new Set(),
    BRANDS: new Set(),
    COLOR: new Set(),
  });
  const [priceRange, setPriceRange] = useState<number>(500);
  const [visibleCount, setVisibleCount] = useState<number>(15);

  // Define subcategories for Accessories
  const SUBCATEGORIES = [
    "Accessories",
    "Headwear",
    "Bags",
    "Athletics",
    "Medical",
    "Office Use",
  ];

  // Fetch products from selected subcategories (or all if none selected)
  const fetchProducts = async (subcategories: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const allProducts: any[] = [];
      for (const subcategory of subcategories) {
        try {
          const response = await fetch(
            `http://31.97.41.27:5000/api/products/by-base-category/${encodeURIComponent(
              subcategory
            )}?limit=100`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.products && Array.isArray(data.products)) {
              allProducts.push(...data.products);
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch products for ${subcategory}:`, error);
        }
      }
      // Filter out products with no valid variations (with colorFrontImage)
      const validProducts = allProducts.reduce((acc: any[], product: any) => {
        const validVariations = (product.variations || []).filter(
          (variation: any) =>
            variation.colorFrontImage && variation.colorFrontImage.trim() !== ""
        );
        if (validVariations.length > 0) {
          acc.push({ ...product, variations: validVariations });
        }
        return acc;
      }, []);
      setProducts(validProducts);
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when selectedFilters.CATEGORY changes
  useEffect(() => {
    const selected = Array.from(selectedFilters.CATEGORY);
    if (selected.length === 0) {
      fetchProducts(SUBCATEGORIES);
    } else {
      fetchProducts(selected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters.CATEGORY]);

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

  // Filter products client-side and return products with filtered variations
  const filteredProducts = products.reduce((acc: any[], product) => {
    // Filter variations by price and color
    const validVariations = product.variations.filter((variation: any) => {
      const price =
        variation.salePrice || variation.customerPrice || variation.piecePrice;
      const withinPriceRange = price >= 0 && price <= priceRange;
      const matchesColor =
        selectedFilters.COLOR.size === 0 ||
        selectedFilters.COLOR.has(variation.colorName);
      return withinPriceRange && matchesColor;
    });
    if (validVariations.length === 0) return acc;
    // Brand filter
    if (
      selectedFilters.BRANDS.size > 0 &&
      !selectedFilters.BRANDS.has(product.brandName)
    )
      return acc;
    acc.push({ ...product, variations: validVariations });
    return acc;
  }, []);

  // Get unique brands from all products
  const brands = Array.from(new Set(products.map((p) => p.brandName))).filter(
    Boolean
  );
  // Get unique colors from currently displayed variations only
  const colors = Array.from(
    new Set(
      filteredProducts.flatMap((p) => p.variations.map((v: any) => v.colorName))
    )
  ).filter(Boolean);

  // Get unique subcategories from current products
  const subcategories = Array.from(
    new Set(products.map((p: any) => p.category))
  ).filter(Boolean);

  // Products to display based on pagination
  const paginatedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white text-[#222] py-12 px-4 md:px-6 lg:px-8">
      <Helmet>
        <meta
          name="keywords"
          content="custom bags, custom backpacks nike, embroidered tote bag, embroidered backpack, custom nike backpack, custom nike elite backpack, custom kids backpack, custom toddler backpack, custom drawstring backpack, embroidered tote bags, backpack custom, embroidered tote, custom tote bags, custom drawstring bags, custom bags with logo, custom paper bags, custom duffle bags, custom tote bags with logo, custom printed bags, custom printed tote bags, custom printed canvas tote bags, custom gym bags, custom duffle bags"
        />
      </Helmet>
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Section */}
          <aside className="w-full md:w-64 md:sticky md:top-28 md:self-start z-10 bg-[#f3f8fa] p-6 rounded-xl shadow-lg border border-[#b3ddf3]">
            {/* CATEGORY */}
            <div className="mb-6 border-b border-[#b3ddf3] pb-4">
              <h2
                className="text-xl font-semibold flex justify-between items-center cursor-pointer"
                onClick={() => toggleTab("CATEGORY")}
              >
                CATEGORY
                <FaChevronDown
                  className={`transition-transform ${
                    activeTab === "CATEGORY" ? "rotate-180" : ""
                  }`}
                />
              </h2>
              {activeTab === "CATEGORY" && (
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {SUBCATEGORIES.map((cat: string) => (
                    <li key={cat} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="accent-[#b3ddf3]"
                        checked={selectedFilters.CATEGORY.has(cat)}
                        onChange={() => handleFilterChange("CATEGORY", cat)}
                      />
                      <span>{cat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* BRANDS */}
            <div className="mb-6 border-b border-[#b3ddf3] pb-4">
              <h2
                className="text-xl font-semibold flex justify-between items-center cursor-pointer"
                onClick={() => toggleTab("BRANDS")}
              >
                BRANDS
                <FaChevronDown
                  className={`transition-transform ${
                    activeTab === "BRANDS" ? "rotate-180" : ""
                  }`}
                />
              </h2>
              {activeTab === "BRANDS" && (
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {brands.map((brand) => (
                    <li key={brand} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="accent-[#b3ddf3]"
                        checked={selectedFilters.BRANDS.has(brand)}
                        onChange={() => handleFilterChange("BRANDS", brand)}
                      />
                      <span>{brand}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* COLOR */}
            <div className="mb-6 border-b border-[#b3ddf3] pb-4">
              <h2
                className="text-xl font-semibged flex justify-between items-center cursor-pointer"
                onClick={() => toggleTab("COLOR")}
              >
                COLOR
                <FaChevronDown
                  className={`transition-transform ${
                    activeTab === "COLOR" ? "rotate-180" : ""
                  }`}
                />
              </h2>
              {activeTab === "COLOR" && (
                <ul
                  className="mt-4 space-y-2 text-sm text-gray-700 max-h-48 overflow-y-auto pr-2"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {colors.map((color) => (
                    <li key={color} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="accent-[#b3ddf3]"
                        checked={selectedFilters.COLOR.has(color)}
                        onChange={() => handleFilterChange("COLOR", color)}
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
                onClick={() => toggleTab("PRICE")}
              >
                PRICE
                <FaChevronDown
                  className={`transition-transform ${
                    activeTab === "PRICE" ? "rotate-180" : ""
                  }`}
                />
              </h2>
              {activeTab === "PRICE" && (
                <div className="mt-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full cursor-pointer accent-[#b3ddf3]"
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
                <p className="text-center text-gray-400 col-span-full">
                  Loading products...
                </p>
              ) : error ? (
                <p className="text-center text-red-500 col-span-full">
                  {error}
                </p>
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, index) => {
                  const displayVariation = product.variations[0];
                  return (
                    <Link
                      to={`/product/${displayVariation.sku}`}
                      key={index}
                      className="bg-white p-4 rounded-xl border border-[#b3ddf3] shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 flex flex-col"
                    >
                      {displayVariation.colorFrontImage && (
                        <img
                          src={`https://www.ssactivewear.com/${displayVariation.colorFrontImage}`}
                          alt={product.styleName}
                          className="h-48 w-full object-cover rounded-lg mb-4"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/public/img01.avif";
                          }}
                        />
                      )}
                      <h3 className="text-lg font-bold mb-1 truncate">
                        {product.productName}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{
                            backgroundColor:
                              displayVariation.color1 ||
                              displayVariation.color2,
                          }}
                        ></div>
                        <span className="text-sm text-gray-400">
                          {displayVariation.colorName}
                        </span>
                      </div>
                      <p className="text-[#b3ddf3] font-semibold text-md">
                        $
                        {(
                          displayVariation.salePrice ||
                          displayVariation.customerPrice ||
                          displayVariation.piecePrice
                        ).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        In Stock: {displayVariation.qty}
                      </p>
                    </Link>
                  );
                })
              ) : (
                <p className="text-gray-400 text-center col-span-full">
                  No products found for this category.
                </p>
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

export default CustomBagsPage;
