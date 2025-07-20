import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { Helmet } from "react-helmet";

const DynamicCategoryPage: React.FC = () => {
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

  // --- New state for subcategories, reviews, related categories, and SEO content ---
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categoryReviews, setCategoryReviews] = useState<any[]>([]);
  const [relatedCategories, setRelatedCategories] = useState<any[]>([]);
  const [seoContent, setSeoContent] = useState<string | null>(null);

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
          `http://localhost:3000/api/products/by-title/${category}?limit=100`
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

  // Fetch subcategories (if any)
  useEffect(() => {
    if (!category) return;
    fetch(`http://localhost:3000/api/categories/subcategories/${category}`)
      .then((res) => res.json())
      .then((data) => setSubcategories(data.subcategories || []))
      .catch(() => setSubcategories([]));
  }, [category]);

  // Fetch reviews for this category (if any)
  useEffect(() => {
    if (!category) return;
    fetch(`http://localhost:3000/api/reviews/category/${category}`)
      .then((res) => res.json())
      .then((data) => setCategoryReviews(data.reviews || []))
      .catch(() => setCategoryReviews([]));
  }, [category]);

  // Fetch related categories (if any)
  useEffect(() => {
    if (!category) return;
    fetch(`http://localhost:3000/api/categories/related/${category}`)
      .then((res) => res.json())
      .then((data) => setRelatedCategories(data.relatedCategories || []))
      .catch(() => setRelatedCategories([]));
  }, [category]);

  // Fetch SEO content (if any)
  useEffect(() => {
    if (!category) return;
    fetch(`http://localhost:3000/api/categories/seo/${category}`)
      .then((res) => res.json())
      .then((data) => setSeoContent(data.seoContent || null))
      .catch(() => setSeoContent(null));
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
    if (
      selectedFilters.CATEGORY.size > 0 &&
      !selectedFilters.CATEGORY.has(product.category)
    )
      return false;
    // Brand filter
    if (
      selectedFilters.BRANDS.size > 0 &&
      !selectedFilters.BRANDS.has(product.brandName)
    )
      return false;
    // Color filter
    if (
      selectedFilters.COLOR.size > 0 &&
      !selectedFilters.COLOR.has(product.colorName)
    )
      return false;
    // Price filter
    if (product.salePrice > priceRange) return false;
    return true;
  });

  // Get unique brands and colors from products
  const brands = Array.from(new Set(products.map((p) => p.brandName))).filter(
    Boolean
  );
  const colors = Array.from(new Set(products.map((p) => p.colorName))).filter(
    Boolean
  );

  return (
    <>
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
      <div className="min-h-screen bg-white text-[#222] py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header tags */}
          <h1 className="text-4xl font-extrabold mb-2 text-[#b3ddf3]">
            {category}
          </h1>
          <h2 className="text-2xl font-bold mb-4 text-blue-900">
            {products.length} Products
          </h2>
          {/* Subcategory Internal Mesh */}
          {subcategories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2 text-blue-900">
                Subcategories
              </h2>
              <div className="flex flex-wrap gap-4">
                {subcategories.map((sub: any) => (
                  <button
                    key={sub._id || sub.name}
                    className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg font-semibold hover:bg-blue-200 transition"
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filters Section */}
            <div className="col-span-1 bg-[#f3f8fa] p-6 rounded-xl shadow-lg border border-[#b3ddf3]">
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
                  <ul className="mt-4 space-y-2 text-sm text-gray-300">
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
                  <ul className="mt-4 space-y-2 text-sm text-gray-300">
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
                  <ul className="mt-4 space-y-2 text-sm text-gray-300">
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
                      className="w-full cursor-pointer"
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
                filteredProducts.map((product, index) => (
                  <Link
                    to={`/product/${product.sku}`}
                    key={index}
                    className="bg-white p-4 rounded-xl border border-[#b3ddf3] shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 flex flex-col"
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
                      <span className="text-sm text-gray-400">
                        {product.colorName}
                      </span>
                    </div>
                    <p className="text-[#b3ddf3] font-semibold text-md">
                      ${product.salePrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      In Stock: {product.qty}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-gray-400 text-center col-span-full">
                  No products found for this category.
                </p>
              )}
            </div>
          </div>
          {/* Customer reviews relevant for that category */}
          {categoryReviews.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2 text-blue-900">
                Customer Reviews
              </h2>
              <ul className="space-y-4">
                {categoryReviews.map((review: any, idx: number) => (
                  <li key={idx} className="bg-gray-50 p-4 rounded-xl shadow">
                    <div className="font-semibold text-blue-900 mb-1">
                      {review.user}
                    </div>
                    <div className="text-yellow-400 mb-1">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    <div className="text-gray-700">{review.comment}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Related Categories Internal Mesh */}
          {relatedCategories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2 text-blue-900">
                Related Categories
              </h2>
              <div className="flex flex-wrap gap-4">
                {relatedCategories.map((cat: any) => (
                  <button
                    key={cat._id || cat.name}
                    className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg font-semibold hover:bg-blue-200 transition"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Place for SEO Content */}
          {seoContent && (
            <div className="mb-8 bg-blue-50 rounded-xl p-4 shadow text-gray-700">
              <h2 className="text-xl font-bold mb-2 text-blue-900">
                About {category}
              </h2>
              <div dangerouslySetInnerHTML={{ __html: seoContent }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DynamicCategoryPage;
