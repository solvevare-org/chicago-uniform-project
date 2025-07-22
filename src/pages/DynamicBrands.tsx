import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { Helmet } from "react-helmet";

const DynamicBrands: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>("CATEGORY");
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: Set<string>;
  }>({
    CATEGORY: new Set(),
    BRANDS: new Set(),
    COLOR: new Set(),
  });
  const [priceRange, setPriceRange] = useState<number>(500);
  // Track selected color globally (not per product)
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { category } = useParams();

  // Fetch categories (for sidebar)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch {
        setCategories([]);
      }
    };
    -fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:3000/api/products/by-brand/${category}`
        );
        if (!response.ok)
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error: any) {
        setError(error.message || "An error occurred while fetching products.");
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

  // Get unique brands and colors from products
  const brands = Array.from(new Set(products.map((p) => p.brandName))).filter(
    Boolean
  );

  // Filter products client-side
  const filteredProducts = products
    .map((product) => {
      // Find all valid variations with image and within price range
      const validVariations = (product.variations || []).filter(
        (v: any) =>
          v.colorFrontImage &&
          v.colorFrontImage.trim() !== "" &&
          v.salePrice <= priceRange
      );
      if (validVariations.length === 0) return null;
      // If a color is selected, use the first variation with that color
      let displayVariation = validVariations[0];
      if (selectedColor) {
        const match = validVariations.find(
          (v: any) => v.colorName === selectedColor
        );
        if (match) displayVariation = match;
        else return null; // If product doesn't have the selected color, don't show it
      }
      return { ...product, _displayVariation: displayVariation };
    })
    .filter(Boolean);

  // Get unique colors from all valid variations of all products
  const colors = Array.from(
    new Set(
      products.flatMap((p) =>
        (p.variations || [])
          .filter(
            (v: any) => v.colorFrontImage && v.colorFrontImage.trim() !== ""
          )
          .map((v: any) => v.colorName)
      )
    )
  ).filter(Boolean);

  return (
    <>
      <Helmet>
        {category && category.toLowerCase() === "nike" && (
          <meta name="keywords" content="dri fit custom shirts" />
        )}
        {category && category.toLowerCase() === "carhartt" && (
          <meta
            name="keywords"
            content="custom carhartt hoodies, custom carhartt jacket, custom carhartt shirts, carhartt custom shirts, carhartt custom hoodies, custom carhartt hoodie, custom carhartt jackets, custom carhartt beanie, custom carhartt sweatshirts"
          />
        )}
        {category && category.toLowerCase() === "patagonia" && (
          <meta
            name="keywords"
            content="custom patagonia, patagonia custom embroidery, custom patagonia vest, custom patagonia jackets, custom patagonia jacket, custom patagonia quarter zip"
          />
        )}
        {category && category.toLowerCase() === "gildan" && (
          <meta
            name="keywords"
            content="gildan custom shirts, custom gildan shirts, custom gildan hoodies"
          />
        )}
        {category && category.toLowerCase() === "champion" && (
          <meta
            name="keywords"
            content="custom champion hoodie, champion custom hoodie, custom champion sweatshirt"
          />
        )}
        {category && category.toLowerCase() === "the north face" && (
          <meta
            name="keywords"
            content="custom north face backpack, custom north face jacket, north face custom jacket, custom north face jackets, north face custom embroidery, custom under armour polo, under armour custom uniforms, custom under armour shirts, under armour custom shirts, custom under armour hoodie"
          />
        )}
        {category && category.toLowerCase() === "comfort colors" && (
          <meta
            name="keywords"
            content="comfort colors custom shirts, custom comfort colors shirts, custom comfort colors sweatshirt"
          />
        )}
        {category && category.toLowerCase() === "under armour" && (
          <meta name="keywords" content="custom under armour shirts" />
        )}
      </Helmet>
      <div className="min-h-screen bg-white text-[#222] py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filters Section */}
            <div
              className="col-span-1 bg-[#f3f8fa] p-6 rounded-xl shadow-lg border border-[#b3ddf3]"
              style={{ maxHeight: "24rem", overflowY: "auto" }}
            >
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
                    {categories.length > 0 &&
                      categories.map((cat: any) => (
                        <li
                          key={cat.title}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            className="accent-[#b3ddf3]"
                            checked={selectedFilters.CATEGORY.has(cat.title)}
                            onChange={() =>
                              handleFilterChange("CATEGORY", cat.title)
                            }
                          />
                          <span>{cat.title}</span>
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
                  className="text-xl font-semibold flex justify-between items-center cursor-pointer"
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
                  <div className="mt-4 max-h-48 overflow-y-auto">
                    <ul className="space-y-2 text-sm text-gray-700">
                      {colors.map((color) => (
                        <li
                          key={color}
                          className="flex items-center space-x-2 min-w-0"
                        >
                          <input
                            type="checkbox"
                            className="accent-[#b3ddf3] flex-shrink-0"
                            checked={selectedColor === color}
                            onChange={() =>
                              setSelectedColor(
                                selectedColor === color ? null : color
                              )
                            }
                          />
                          <span className="truncate">{color}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
            </div>
            {/* Product Grid Section */}
            <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                <p className="text-center text-gray-400 col-span-full">
                  Loading products...
                </p>
              ) : error ? (
                <p className="text-center text-red-500 col-span-full">
                  {error}
                </p>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product: any, index: number) => {
                  const v = product._displayVariation;
                  return (
                    <div
                      key={v.sku}
                      className="bg-white p-4 rounded-xl border border-[#b3ddf3] shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 flex flex-col"
                    >
                      <Link to={`/product/${v.sku}`} className="block">
                        <img
                          src={`https://www.ssactivewear.com/${v.colorFrontImage}`}
                          alt={product.styleName}
                          className="h-48 w-full object-cover rounded-lg mb-4"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/public/img01.avif";
                          }}
                        />
                        <h3 className="text-lg font-bold mb-1 truncate">
                          {product.brandName} {product.styleName}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: v.color1 }}
                          ></div>
                          <span className="text-sm text-gray-400">
                            {v.colorName}
                          </span>
                        </div>
                        <p className="text-[#b3ddf3] font-semibold text-md">
                          ${v.salePrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          In Stock: {v.qty}
                        </p>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-center col-span-full">
                  No products found for this category.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicBrands;
