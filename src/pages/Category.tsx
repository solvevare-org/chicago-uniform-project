import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { Helmet } from "react-helmet";

const CategoryPage: React.FC = () => {
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
    Price: new Set(),
  });
  const [priceRange, setPriceRange] = useState<number>(500);
  const [visibleCount, setVisibleCount] = useState<number>(15);

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
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:3000/api/products/by-base-category/${category}?limit=100`
        );
        if (!response.ok)
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        const data = await response.json();
        console.log("total products", data);
        // Filter out products that don't have valid variations with images
        const validProducts = (data.products || []).reduce(
          (acc: any[], product: any) => {
            // Filter variations that have colorFrontImage
            const validVariations = product.variations.filter(
              (variation: any) =>
                variation.colorFrontImage &&
                variation.colorFrontImage.trim() !== ""
            );

            // If product has valid variations, include it with only valid variations
            if (validVariations.length > 0) {
              acc.push({
                ...product,
                variations: validVariations,
              });
            }
            return acc;
          },
          []
        );

        console.log("Filtered products:", validProducts);
        setProducts(validProducts);
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

  // Filter products client-side and return products with filtered variations
  const filteredProducts = products.reduce((acc: any[], product) => {
    // First filter variations based on price and color
    let validVariations = product.variations.filter((variation: any) => {
      // Price filter - check if variation is within price range
      const price =
        variation.salePrice || variation.customerPrice || variation.piecePrice;
      const withinPriceRange = price >= 0 && price <= priceRange;

      // Color filter - check if variation color matches selected colors
      const matchesColor =
        selectedFilters.COLOR.size === 0 ||
        selectedFilters.COLOR.has(variation.colorName);

      return withinPriceRange && matchesColor;
    });

    // If no variations pass the filter, exclude this product
    if (validVariations.length === 0) return acc;

    // Apply other product-level filters
    // Category filter
    if (
      selectedFilters.CATEGORY.size > 0 &&
      !selectedFilters.CATEGORY.has(product.category)
    )
      return acc;

    // Brand filter
    if (
      selectedFilters.BRANDS.size > 0 &&
      !selectedFilters.BRANDS.has(product.brandName)
    )
      return acc;

    // Add product with only the valid variations
    acc.push({
      ...product,
      variations: validVariations,
    });

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

  // Products to display based on pagination
  const paginatedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white text-[#222] py-12 px-4 md:px-6 lg:px-8">
      <Helmet>
        {category && category.toLowerCase() === "headwear" && (
          <meta
            name="keywords"
            content="custom hats, custom baseball hats, embroidered baseball caps, custom embroidered baseball hats, embroidered baseball hats, custom embroidered baseball hat, custom embroidered hats, custom trucker hats, trucker hats custom, embroidered trucker hats, custom patch trucker hats, flat bill trucker hats, custom made trucker hats, custom embroidered trucker hats, embroidered trucker hat, custom bucket hats, custom embroidered bucket hats, embroidered bucket hat, embroidered richardson 112 hats, embroidered richardson hats, custom richardson 112 hats, richardson custom hats, custom fitted hats, embroidered fitted hats, custom embroidered fitted hats, custom flexfit hats, custom embroidered flexfit hats, embroidered flexfit hats, custom beanies, custom beanie, embroidered beanie, custom winter hats, custom beanie hats, customized beanies, custom beanies with logo, custom embroidered beanies, embroidered beanies, customizable beanies, personalized beanie, beanie embroidery, custom embroidered beanie, custom 47 brand hats, custom snapback hats, custom dad hats, custom embroidered dad hats, custom golf hats, custom cammo hats, custom visors, custom visor, custom sun visor, custom sun visors, custom headbands, custom headband, customized headbands, custom headbands with logo, custom sports headbands, customizable headbands, custom embroidered hats"
          />
        )}
        {category &&
          [
            "t-shirts - long sleeve",
            "t-shirts - premium",
            "t-shirts - core",
          ].includes(category.toLowerCase()) && (
            <meta
              name="keywords"
              content="custom t shirts, custom print t-shirt, custom printed t-shirt, custom long sleeve shirt, embroidered t shirts, bulk custom t shirts, cheap custom t shirts, custom embroidered t-shirts, t shirts embroidered, custom embroidered t shirts"
            />
          )}
        {category &&
          (category.toLowerCase().includes("shirt") ||
            category.toLowerCase().includes("shirts")) && (
            <meta
              name="keywords"
              content="custom polo shirts, custom polo shirts with logo, embroidered polo shirts, custom embroidered polo shirts, custom logo polo shirts, custom printed polo shirts, polo shirts embroidered, embroidered polo shirts no minimum order, embroidered polo shirts custom, mens embroidered polo shirts, embroidered logo polo shirts, custom t shirts, custom print t-shirt, custom printed t-shirt, custom long sleeve shirt, embroidered t shirts, bulk custom t shirts, cheap custom t shirts, custom embroidered t-shirts, t shirts embroidered, custom embroidered t shirts, custom work shirts, work shirts with logo, embroidered work shirts, custom embroidered work shirts, work shirts embroidered, embroidered dickies work shirts, embroidered shirts for work, custom golf shirts, embroidered golf shirts, embroidered dress shirts, custom logo dress shirts, embroidered business shirts, embroidered button up shirts, custom embroidered golf shirts, custom embroidered golf shirts no minimum, custom embroidered dress shirts, business embroidered shirts, custom embroidered button down shirts, dress shirts embroidered, business polo shirts embroidered, custom tank tops"
            />
          )}
        {category && category.toLowerCase().includes("outerwear") && (
          <meta
            name="keywords"
            content="custom hoodies, custom embroidered hoodies, custom zip up  hoodies, custom hoodies for men, custom nike hoodies, custom printed hoodies, embroidered hoodies, custom print hoodies, custom sweaters, custom embroidered sweaters, custom christmas sweaters, embroidered sweaters, custom knit sweaters, custom sweatshirts, custom embroidered sweatshirts, custom printed sweatshirts, custom college sweatshirts, custom crewneck sweatshirts, custom embroidered sweatshirts, custom embroidery sweatshirts, custom logo sweatshirts, custom sweatshirts embroidered, custom sweatshirts no minimum, cute embroidered sweatshirts, embroidered college sweatshirts, embroidered sweatshirts, embroidered sweatshirts custom, custom quarter zip, embroidered quarter zip, custom quarter zip pullover, custom quarter zip sweatshirt, personalized embroidered sweatshirts, custom jackets, custom jackets with logo, custom logo jackets, custom windbreakers, custom bomber jackets, custom denim jackets, custom embroidered jackets, custom fleece jackets, custom hi vis jackets, custom jackets with logo, custom leather jackets, custom letterman jackets, custom logo jackets, custom nike jackets, custom rain jackets, custom sports jackets, custom starter jackets, custom team jackets, custom track jackets, custom windbreaker jackets, custom work jackets, custom zip up jackets, embroidered fleece jackets, embroidered jackets, varsity jackets custom, women's embroidered jackets, custom vests, embroidered vests"
          />
        )}
        {category && category.toLowerCase().includes("bags") && (
          <meta
            name="keywords"
            content="custom bags, custom backpacks nike, embroidered tote bag, embroidered backpack, custom nike backpack, custom nike elite backpack, custom kids backpack, custom toddler backpack, custom drawstring backpack, embroidered tote bags, backpack custom, embroidered tote, custom tote bags, custom drawstring bags, custom bags with logo, custom paper bags, custom duffle bags, custom tote bags with logo, custom printed bags, custom printed tote bags, custom printed canvas tote bags, custom gym bags, custom duffle bags"
          />
        )}
        {category && category.toLowerCase().includes("bottoms") && (
          <meta
            name="keywords"
            content="custom pants, custom shorts, custom sweatpants, embroidered sweatpants, custom pants design, custom sweat pants, embroidered jean shorts, embroidered denim shorts, mens embroidered pants, custom cargo pants, embroidered linen pants, custom embroidered sweatpants, custom scrubs, custom scrubs with logo, custom nurse scrubs, custom embroidered scrubs"
          />
        )}
        {category && category.toLowerCase().includes("accessories") && (
          <meta
            name="keywords"
            content="embroidered blankets, custom blankets, custom embroidered blankets, embroidered hand towels, custom hand towels, embroidered towel, custom scarves, custom scarves with logo, custom aprons, custom printed aprons, custom aprons with logo, custom embroidered aprons, custom bandanas"
          />
        )}
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
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
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
                  // Use the first variation from the filtered variations
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
                            // If image fails to load, set a default image
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

export default CategoryPage;
