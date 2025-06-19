// This is a copy of DynamicCategoryPage.tsx, renamed as EmbroideredDynamicPage.tsx
// You can now customize this page for embroidered categories as needed.

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';

const EmbroideredDynamicPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('CATEGORY');
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: Set<string> }>({
    CATEGORY: new Set(),
    BRANDS: new Set(),
    COLOR: new Set(),
  });
  const [priceRange, setPriceRange] = useState<number>(500);
  // State for pagination
  const [visibleCount, setVisibleCount] = useState(30);

  const location = useLocation();
  const path = location.pathname;
  let embroideredType = '';
  if (path.includes('custom-embroidered-polo')) embroideredType = 'polo';
  else if (path.includes('custom-embroidered-hoodie')) embroideredType = 'hoodie';
  else if (path.includes('custom-embroidered-t-shirt')) embroideredType = 't-shirt';
  else if (path.includes('custom-embroidered-sweatshirt')) embroideredType = 'sweatshirt';
  console.log('embroideredType:', embroideredType);

  // Fetch products (filtered by embroidered subcategory)
  useEffect(() => {
    const fetchProducts = async () => {
      if (!embroideredType) {
        setLoading(false); // Always set loading to false if no category
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://31.97.41.27:5000/api/products/by-keyword/${embroideredType}`);
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
        const data = await response.json();
        setProducts(data.products || []);
        console.log('Fetched products:', data.products);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred while fetching products.');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
        console.log('Loading:', loading, 'Error:', error);
      }
    };
    fetchProducts();
  }, [embroideredType]);

  // Get unique brands and colors from products
  const brands = Array.from(new Set(products.map((p) => p.brandName))).filter(Boolean);
  const colors = Array.from(new Set(products.map((p) => p.colorName))).filter(Boolean);

  // Improved return logic for loading and empty state
  return (
    <>
      {/* SEO Meta Tags and H1 for Polo */}
      {embroideredType === 'polo' && (
        <>
          <Helmet>
            <title>Custom Embroidered Polo Shirts | Brand Name</title>
            <meta name="description" content="Design custom embroidered polo shirts with your logo! Perfect for teams, businesses, or personal use. Create unique styles and high-quality stitching—order now!" />
            <meta name="keywords" content="custom embroidered polo shirts, high-quality custom embroidered polos, embroidered custom polos, personalised embroidered polos" />
            <link rel="canonical" href="https://www.chicagouniformcompany.com/" />
          </Helmet>
          <h1 className="text-3xl font-bold mb-4">Custom Embroidered Polo Shirts</h1>
        </>
      )}
      {/* SEO Meta Tags and H1 for Hoodie */}
      {embroideredType === 'hoodie' && (
        <>
          <Helmet>
            <title>Custom Embroidered Hoodies 🧥 | South Loop Prints</title>
            <meta name="description" content="Show off your brand in style with premium custom embroidered hoodies 🧵🔥 from South Loop Prints! Ideal for teams, staff uniforms, or giveaways. Fast delivery & bulk order pricing! 🚀" />
            <meta name="keywords" content="custom embroidered hoodies, high-quality custom embroidered hoodies, embroidered custom hoodies, personalised embroidered hoodies" />
            <link rel="canonical" href="https://www.chicagouniformcompany.com/" />
          </Helmet>
          <h1 className="text-3xl font-bold mb-4">Custom Embroidered Hoodies</h1>
        </>
      )}
      {/* SEO Meta Tags and H1 for T-Shirt */}
      {embroideredType === 't-shirt' && (
        <>
          <Helmet>
            <title>Custom Embroidered T-Shirts 👕 | South Loop Prints</title>
            <meta name="description" content="Create your best look with custom embroidered T-shirts from South Loop Prints 🧵✨ Great for branding, staff uniforms, and events. Quick turnaround & volume pricing! 🚀" />
            <meta name="keywords" content="custom embroidered t-shirts, t shirts embroidered, custom t shirts embroidered logo, personalised t shirts embroidered" />
            <link rel="canonical" href="https://www.chicagouniformcompany.com/" />
          </Helmet>
          <h1 className="text-3xl font-bold mb-4">Custom Embroidered T-Shirts</h1>
        </>
      )}
      {/* SEO Meta Tags and H1 for Sweatshirt */}
      {embroideredType === 'sweatshirt' && (
        <Helmet>
          <title>Custom Embroidered Sweatshirts | South Loop Prints</title>
          <meta name="description" content="Stay warm and professional with custom embroidered sweatshirts from South Loop Prints🧵🔥 Ideal for teams, events, and branded apparel. Fast service & bulk discounts! 🚚" />
          <meta name="keywords" content="custom embroidered sweatshirts, custom embroidery sweatshirts, custom logo sweatshirts, personalized embroidered sweatshirts" />
          <link rel="canonical" href="https://www.chicagouniformcompany.com/" />
        </Helmet>
      )}
      {embroideredType === 'sweatshirt' && (
        <h1 className="text-3xl font-bold mb-4">Custom Embroidered Sweatshirts</h1>
      )}
      {/* Breadcrumb */}
      <div className="text-[#b3ddf3] text-sm mb-6">
        <span className="hover:underline cursor-pointer">Home</span> /Category/
        <span className="text-[#b3ddf3] font-semibold">{embroideredType}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Section */}
        <div className="col-span-1 bg-[#f3f8fa] p-6 rounded-xl shadow-lg border border-[#b3ddf3]">
          {/* CATEGORY (filtered by embroideredCategory) */}
          <div className="mb-6 border-b border-[#b3ddf3] pb-4">
            <h2
              className="text-xl font-semibold flex justify-between items-center cursor-pointer"
              onClick={() => setActiveTab(activeTab === 'CATEGORY' ? null : 'CATEGORY')}
            >
              CATEGORY
              <FaChevronDown className={`transition-transform ${activeTab === 'CATEGORY' ? 'rotate-180' : ''}`} />
            </h2>
            {activeTab === 'CATEGORY' && embroideredType && (
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="accent-[#b3ddf3]"
                    checked={selectedFilters.CATEGORY.has(embroideredType)}
                    onChange={() => {
                      setSelectedFilters((prev) => {
                        const updated = new Set(prev.CATEGORY);
                        if (updated.has(embroideredType)) updated.delete(embroideredType);
                        else updated.add(embroideredType);
                        return { ...prev, CATEGORY: updated };
                      });
                    }}
                  />
                  <span>{embroideredType}</span>
                </li>
              </ul>
            )}
          </div>
          {/* BRANDS */}
          <div className="mb-6 border-b border-[#b3ddf3] pb-4">
            <h2
              className="text-xl font-semibold flex justify-between items-center cursor-pointer"
              onClick={() => setActiveTab(activeTab === 'BRANDS' ? null : 'BRANDS')}
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
                      className="accent-[#b3ddf3]"
                      checked={selectedFilters.BRANDS.has(brand)}
                      onChange={() => {
                        setSelectedFilters((prev) => {
                          const updated = new Set(prev.BRANDS);
                          if (updated.has(brand)) updated.delete(brand);
                          else updated.add(brand);
                          return { ...prev, BRANDS: updated };
                        });
                      }}
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
              onClick={() => setActiveTab(activeTab === 'COLOR' ? null : 'COLOR')}
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
                      className="accent-[#b3ddf3]"
                      checked={selectedFilters.COLOR.has(color)}
                      onChange={() => {
                        setSelectedFilters((prev) => {
                          const updated = new Set(prev.COLOR);
                          if (updated.has(color)) updated.delete(color);
                          else updated.add(color);
                          return { ...prev, COLOR: updated };
                        });
                      }}
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
              onClick={() => setActiveTab(activeTab === 'PRICE' ? null : 'PRICE')}
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
        </div>
        {/* Product Grid Section */}
        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <p className="text-center text-gray-400 col-span-full">Loading products...</p>
          ) : error ? (
            <p className="text-center text-red-500 col-span-full">{error}</p>
          ) : products.length > 0 ? (
            products
              .filter((product) => {
                if (selectedFilters.CATEGORY.size > 0 && !selectedFilters.CATEGORY.has(embroideredType)) return false;
                if (selectedFilters.BRANDS.size > 0 && !selectedFilters.BRANDS.has(product.brandName)) return false;
                if (selectedFilters.COLOR.size > 0 && !selectedFilters.COLOR.has(product.colorName)) return false;
                if (product.salePrice > priceRange) return false;
                return true;
              })
              .slice(0, visibleCount)
              .map((product, index) => (
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
                    <span className="text-sm text-gray-400">{product.colorName}</span>
                  </div>
                  <p className="text-[#b3ddf3] font-semibold text-md">${product.salePrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">In Stock: {product.qty}</p>
                </Link>
              ))
          ) : (
            <p className="text-gray-400 text-center col-span-full">No products found for this category.</p>
          )}
          {/* Show More button */}
          {products.filter((product) => {
            if (selectedFilters.CATEGORY.size > 0 && !selectedFilters.CATEGORY.has(embroideredType)) return false;
            if (selectedFilters.BRANDS.size > 0 && !selectedFilters.BRANDS.has(product.brandName)) return false;
            if (selectedFilters.COLOR.size > 0 && !selectedFilters.COLOR.has(product.colorName)) return false;
            if (product.salePrice > priceRange) return false;
            return true;
          }).length > visibleCount && (
            <div className="col-span-full flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 30)}
                className="px-6 py-2 rounded-lg bg-[#3ab7ea] text-white font-semibold shadow hover:bg-[#2563eb] transition-all"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Polo-specific content at the end with improved spacing and heading color */}
      {embroideredType === 'polo' && (
        <div className="mt-16 px-4 md:px-16 lg:px-32 py-10 bg-white rounded-2xl shadow-xl border border-[#b3ddf3]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#3ab7ea]">Custom Embroidered Polo Shirts</h2>
          {/* SEO Meta Tags and H1 for Polo */}
          {embroideredType === 'polo' && (
            <>
              <Helmet>
                <title>Custom Embroidered Polo Shirts | Brand Name</title>
                <meta name="description" content="Design custom embroidered polo shirts with your logo! Perfect for teams, businesses, or personal use. Create unique styles and high-quality stitching—order now!" />
                <meta name="keywords" content="custom embroidered polo shirts, high-quality custom embroidered polos, embroidered custom polos, personalised embroidered polos" />
                <link rel="canonical" href="https://www.chicagouniformcompany.com/" />
              </Helmet>
              <h1 className="text-3xl font-bold mb-4">Custom Embroidered Polo Shirts</h1>
            </>
          )}
          {/* Polo-specific rich content and FAQs */}
          {embroideredType === 'polo' && (
            <section className="mt-12 space-y-10">
              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Shop High-Quality Embroidered Polo Shirts Custom Made for You</h2>
              <p className="mb-4">Discover premium custom embroidered polo shirts designed to your exact specifications. Our polos are crafted for comfort, durability, and a polished look—perfect for businesses, teams, clubs, and events. Every shirt is embroidered with precision, ensuring your logo stands out with clarity and style.</p>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Customize Your Polo Shirts with No Minimum Order Required</h2>
              <p className="mb-4">Order as few or as many polos as you need—there’s no minimum! Choose your preferred style, color, and size, then upload your logo for professional embroidery. Our easy online process and expert team make it simple to create unique, branded apparel for any group or occasion.</p>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Embroidered Logo Polo Shirts That Elevate Your Brand Identity</h2>
              <p className="mb-4">Your logo is more than just a design—it’s the face of your brand. We use advanced embroidery techniques to ensure every detail is crisp and long-lasting. Whether you’re outfitting staff, students, or event teams, our polos help you present a unified, professional image.</p>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Polo Brands for You to Customize</h2>
              <ul className="list-disc ml-6 mb-6">
                <li><strong>Carhartt:</strong> Rugged and reliable, Carhartt polos are built for performance and comfort in demanding environments.</li>
                <li><strong>Patagonia:</strong> Sustainable and stylish, Patagonia polos are perfect for eco-conscious brands seeking quality and responsibility.</li>
                <li><strong>Gildan:</strong> Affordable and versatile, Gildan polos are a favorite for bulk orders and everyday wear.</li>
                <li><strong>Champion:</strong> Athletic-inspired and comfortable, Champion polos are ideal for teams and active organizations.</li>
                <li><strong>Comfort Colors:</strong> Garment-dyed for a soft, vintage feel, Comfort Colors polos offer relaxed style and unique color options.</li>
                <li><strong>Under Armour:</strong> Engineered for performance, Under Armour polos feature moisture-wicking fabrics and a modern fit.</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Why Choose Us for Your Custom Polo Shirt Needs?</h2>
              <p className="mb-4">We focus exclusively on embroidery for our polo shirts—no printing or print-on-demand. Our in-house embroidery experts ensure every shirt meets the highest standards for quality and consistency. Enjoy fast turnaround, personalized service, and a wide range of customization options to make your polos truly unique.</p>

              {/* Example: Polo-specific FAQ using Accordion with Chicago flag blue */}
              {embroideredType === "polo" && (
                <div className="bg-white rounded-2xl shadow-xl p-8 mt-12 mb-8 border border-gray-100">
                  <h2 className="text-2xl font-extrabold mb-6 text-[#113f7c]">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full mb-8">
                    <AccordionItem value="faq1" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">Fabric Options for Custom Embroidered Polo Shirts</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">We offer polos in a variety of premium fabrics, including cotton, cotton blends, and moisture-wicking performance materials. Each is selected for comfort, durability, and embroidery quality.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq2" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">Can I Mix and Match Polo Shirt Styles and Sizes?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Yes! You can combine different styles, colors, and sizes within a single order to suit your team or organization’s needs.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq3" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">What Affects the Cost of Embroidered Polo Shirts?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Pricing depends on the brand, fabric, quantity, and complexity of your embroidery design. Bulk orders and simpler logos typically offer the best value.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq4" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">How Do I Upload My Logo for Embroidery?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Our online ordering system makes it easy to upload your logo. Our team will digitize your design for embroidery and help you select thread colors for the best results.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq5" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">Where to place embroidery on a polo shirt?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Popular embroidery placements include the left chest, right chest, and sleeves. We’ll help you choose the best location for your logo or design.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq6" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">What is the best material for polo shirts for embroidery?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Cotton and cotton-blend polos provide a smooth surface for crisp, detailed embroidery. Performance fabrics are also available for moisture management and comfort.</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </section>
          )}
        </div>
      )}
      {/* Hoodie-specific content at the end */}
      {embroideredType === 'hoodie' && (
        <div className="mt-16 px-4 md:px-16 lg:px-32 py-10 bg-white rounded-2xl shadow-xl border border-[#b3ddf3]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#3ab7ea]">Custom Embroidered Hoodies</h2>
          {/* SEO Meta Tags and H1 for Hoodie */}
          {embroideredType === 'hoodie' && (
            <>
              <Helmet>
                <title>Custom Embroidered Hoodies 🧥 | South Loop Prints</title>
                <meta name="description" content="Show off your brand in style with premium custom embroidered hoodies 🧵🔥 from South Loop Prints! Ideal for teams, staff uniforms, or giveaways. Fast delivery & bulk order pricing! 🚀" />
                <meta name="keywords" content="custom embroidered hoodies, high-quality custom embroidered hoodies, embroidered custom hoodies, personalised embroidered hoodies" />
                <link rel="canonical" href="https://www.chicagouniformcompany.com/" />
              </Helmet>
              <h1 className="text-3xl font-bold mb-4">Custom Embroidered Hoodies</h1>
            </>
          )}
          {/* Hoodie-specific rich content and FAQs */}
          {embroideredType === 'hoodie' && (
            <section className="mt-12 space-y-10">
              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Shop High-Quality Custom Embroidered Hoodies with Your Logo</h2>
              <p className="mb-4">South Loop Prints offers premium custom embroidered hoodies, crafted to your exact logo and branding specifications. Our hoodies are made from the finest materials for comfort, warmth, and a professional look that stands out. Every hoodie is embroidered with precision—no printing or print-on-demand—ensuring your logo is sharp and long-lasting.</p>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Create Personalised Embroidered Hoodies with No Minimums</h2>
              <p className="mb-4">Order as few or as many as you need—there’s no minimum! Choose your style, color, and size, then upload your logo for expert embroidery. Our easy online process and in-house team make it simple to create unique, branded hoodies for any group or event.</p>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Embroidered Custom Hoodies That Make a Lasting Impression</h2>
              <p className="mb-4">Your logo is more than just a design—it’s your brand’s identity. We use advanced embroidery techniques to ensure every detail is crisp and durable. Whether for staff, teams, or events, our hoodies help you present a unified, professional image that lasts.</p>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Trusted Brands and Premium Hoodie Materials</h2>
              <ul className="list-disc ml-6 mb-6">
                <li><strong>Carhartt:</strong> Rugged and warm, Carhartt hoodies are built for performance in demanding environments.</li>
                <li><strong>Patagonia:</strong> Sustainable and stylish, Patagonia hoodies are perfect for eco-conscious brands.</li>
                <li><strong>Gildan:</strong> Affordable and comfortable, Gildan hoodies are a favorite for bulk orders and everyday wear.</li>
                <li><strong>Champion:</strong> Athletic-inspired and comfortable, Champion hoodies are ideal for teams and active organizations.</li>
                <li><strong>Comfort Colors:</strong> Garment-dyed for a soft, vintage feel, Comfort Colors hoodies offer relaxed style and unique color options.</li>
                <li><strong>Under Armour:</strong> Engineered for performance, Under Armour hoodies feature moisture-wicking fabrics and a modern fit.</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Why Choose Us for Custom Hoodie Embroidery?</h2>
              <p className="mb-4">We focus exclusively on embroidery for our hoodies—no printing or print-on-demand. Our in-house embroidery experts ensure every hoodie meets the highest standards for quality and consistency. Enjoy fast turnaround, personalized service, and a wide range of customization options to make your hoodies truly unique.</p>

              {/* Hoodie-specific FAQ using Accordion with consistent styling */}
              {embroideredType === "hoodie" && (
                <div className="bg-white rounded-2xl shadow-xl p-8 mt-12 mb-8 border border-gray-100">
                  <h2 className="text-2xl font-extrabold mb-6 text-[#113f7c]">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full mb-8">
                    <AccordionItem value="faq1" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">What Hoodie Styles Are Best for Embroidery?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">We offer a variety of hoodie styles, including pullover, zip-up, and heavyweight options. Cotton and cotton-blend hoodies from brands like Carhartt, Champion, and Gildan provide the best foundation for crisp, professional embroidery.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq2" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">How to Order Personalised Embroidered Hoodies Online</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Visit our website, select your hoodie style and color, and upload your logo. Specify embroidery placement and any customization details. Our team will digitize your design and deliver high-quality embroidered hoodies quickly and efficiently.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq3" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">How Much Does It Cost to Get Custom Embroidered Hoodies?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Pricing depends on the hoodie brand, material, embroidery design, and quantity. Bulk orders and simpler logos offer the best value. Contact us for a detailed quote tailored to your needs.</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </section>
          )}
        </div>
      )}
      {/* T-shirt-specific content at the end */}
      {embroideredType === 't-shirt' && (
        <div className="mt-16 px-4 md:px-16 lg:px-32 py-10 bg-white rounded-2xl shadow-xl border border-[#b3ddf3]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#3ab7ea]">Custom Embroidered T-Shirts</h2>
          {/* SEO Meta Tags and H1 for T-Shirt */}
          {embroideredType === 't-shirt' && (
            <>
              <Helmet>
                <title>Custom Embroidered T-Shirts 👕 | South Loop Prints</title>
                <meta name="description" content="Create your best look with custom embroidered T-shirts from South Loop Prints 🧵✨ Great for branding, staff uniforms, and events. Quick turnaround & volume pricing! 🚀" />
                <meta name="keywords" content="custom embroidered t-shirts, t shirts embroidered, custom t shirts embroidered logo, personalised t shirts embroidered" />
                <link rel="canonical" href="https://www.chicagouniformcompany.com/" />
              </Helmet>
              <h1 className="text-3xl font-bold mb-4">Custom Embroidered T-Shirts</h1>
            </>
          )}
          {/* T-shirt-specific rich content and FAQs */}
          {embroideredType === 't-shirt' && (
            <section className="mt-12 space-y-10">
              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Shop Custom Embroidered T-Shirts to Elevate Your Brand</h2>
              <p className="mb-4">Showcase your brand with high-quality custom embroidered t-shirts—no printed or print-on-demand products, just professional embroidery. Perfect for corporate identity, staff uniforms, events, and promotional apparel, our t-shirts are designed to help your business stand out with a polished, professional look.</p>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Design T-Shirts with Embroidered Logos That Stand Out</h2>
              <p className="mb-4">Personalize your t-shirts with your company logo, name, or custom artwork. Our advanced embroidery techniques ensure crisp, durable results that reflect your brand’s quality. Upload your logo and choose from a variety of thread colors for a truly custom look.</p>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Choose From Trusted Brands</h2>
              <ul className="list-disc ml-6 mb-6">
                <li><strong>Carhartt:</strong> Rugged and reliable, Carhartt t-shirts are built for performance and comfort in demanding environments.</li>
                <li><strong>Patagonia:</strong> Sustainable and stylish, Patagonia t-shirts are perfect for eco-conscious brands seeking quality and responsibility.</li>
                <li><strong>Gildan:</strong> Affordable and versatile, Gildan t-shirts are a favorite for bulk orders and everyday wear.</li>
                <li><strong>Champion:</strong> Athletic-inspired and comfortable, Champion t-shirts are ideal for teams and active organizations.</li>
                <li><strong>Comfort Colors:</strong> Garment-dyed for a soft, vintage feel, Comfort Colors t-shirts offer relaxed style and unique color options.</li>
                <li><strong>Under Armour:</strong> Engineered for performance, Under Armour t-shirts feature moisture-wicking fabrics and a modern fit.</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">No Minimum Orders on Custom T-Shirts with Embroidery</h2>
              <p className="mb-4">Order just one t-shirt or hundreds—there’s no minimum! Our flexible ordering system is perfect for both small businesses and large organizations. Enjoy bulk pricing for larger orders and the same high-quality embroidery on every piece.</p>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Why Choose Us</h2>
              <p className="mb-4">We specialize in custom embroidery for t-shirts—no printing or print-on-demand. Our in-house embroidery experts ensure every shirt meets the highest standards for quality and consistency. Fast turnaround, personalized service, and a wide range of customization options make us the trusted choice for branded apparel.</p>

              {/* T-shirt-specific FAQ using Accordion with consistent styling */}
              {embroideredType === "t-shirt" && (
                <div className="bg-white rounded-2xl shadow-xl p-8 mt-12 mb-8 border border-gray-100">
                  <h2 className="text-2xl font-extrabold mb-6 text-[#113f7c]">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full mb-8">
                    <AccordionItem value="faq1" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">What Are the Best T-Shirt Fabrics for Embroidery?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Cotton and cotton-blend t-shirts provide the best foundation for high-quality embroidery. Premium brands like Gildan, Champion, and Carhartt offer ideal fabric compositions for crisp, professional stitching.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq2" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">Can I Upload My Own Logo for Embroidered T-Shirts?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Yes! Upload your logo directly through our online ordering system. Our design team will digitize your artwork and match thread colors for the best results.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq3" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">Where Can Embroidery Be Placed on a T-Shirt?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Popular placements include the left chest, center chest, sleeves, and back. We’ll help you choose the best location for your logo or design.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq4" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">Is There a Minimum Order for Embroidered T-Shirts?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">No minimum order required! Order a single shirt or as many as you need, with consistent quality on every piece.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq5" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">How Much Do Custom Embroidered T-Shirts Cost?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Pricing depends on the brand, fabric, embroidery design, and quantity. Bulk orders and simpler logos offer the best value. Contact us for a detailed quote tailored to your needs.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq6" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">Can I Order Multiple Sizes and Styles in One Order?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Absolutely! Mix and match sizes, colors, and styles within a single order to suit your team or organization’s needs.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq7" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">Do You Offer Bulk Pricing for Large Orders?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Yes, we offer attractive bulk pricing for large quantity orders. The more you order, the better your per-piece pricing becomes.</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </section>
          )}
        </div>
      )}
      {/* Sweatshirt-specific content at the end */}
      {embroideredType === 'sweatshirt' && (
        <div className="mt-16 px-4 md:px-16 lg:px-32 py-10 bg-white rounded-2xl shadow-xl border border-[#b3ddf3]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#3ab7ea]">Custom Embroidered Sweatshirts</h2>
          {/* SEO Meta Tags and H1 for Sweatshirt */}
          {embroideredType === 'sweatshirt' && (
            <Helmet>
              <title>Custom Embroidered Sweatshirts | South Loop Prints</title>
              <meta name="description" content="Stay warm and professional with custom embroidered sweatshirts from South Loop Prints🧵🔥 Ideal for teams, events, and branded apparel. Fast service & bulk discounts! 🚚" />
              <meta name="keywords" content="custom embroidered sweatshirts, custom embroidery sweatshirts, custom logo sweatshirts, personalized embroidered sweatshirts" />
              <link rel="canonical" href="https://www.chicagouniformcompany.com/" />
            </Helmet>
          )}
          {embroideredType === 'sweatshirt' && (
            <h1 className="text-3xl font-bold mb-4">Custom Embroidered Sweatshirts</h1>
          )}
          {/* Sweatshirt-specific rich content and FAQs */}
          {embroideredType === 'sweatshirt' && (
            <section className="mt-12 space-y-10">
              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">High-Quality Custom Embroidered Sweatshirts for Every Occasion</h2>
              <p className="mb-4">Showcase your brand with high-quality custom embroidered sweatshirts—no printed or print-on-demand items, just professional embroidery. Perfect for corporate events, team wear, and client gifts, our sweatshirts are designed for comfort, durability, and a polished, professional look.</p>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Customize Your Sweatshirts with Logos, Names, and More</h2>
              <p className="mb-4">Personalize your sweatshirts with your company logo, team name, or custom artwork. Our advanced embroidery techniques ensure crisp, long-lasting results that reflect your brand’s quality. Upload your logo and choose from a variety of thread colors for a truly custom look.</p>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Personalized Embroidered Sweatshirts with No Minimum Order</h2>
              <p className="mb-4">Order just one sweatshirt or hundreds—there’s no minimum! Our flexible ordering system is perfect for both small businesses and large organizations. Enjoy bulk pricing for larger orders and the same high-quality embroidery on every piece.</p>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Top Sweatshirt Styles: Crewnecks, Hoodies, and Pullovers</h2>
              <p className="mb-4">Choose from a variety of sweatshirt styles to suit your needs. Crewnecks offer a classic, professional look; hoodies provide warmth and versatility; and pullovers deliver a modern, athletic style. All are available for custom embroidery and made from premium, durable materials.</p>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Trusted Brands for You to Personalize</h2>
              <ul className="list-disc ml-6 mb-6">
                <li><strong>Carhartt:</strong> Rugged and reliable, Carhartt sweatshirts are built for performance and comfort in demanding environments.</li>
                <li><strong>Patagonia:</strong> Sustainable and stylish, Patagonia sweatshirts are perfect for eco-conscious brands seeking quality and responsibility.</li>
                <li><strong>Gildan:</strong> Affordable and versatile, Gildan sweatshirts are a favorite for bulk orders and everyday wear.</li>
                <li><strong>Champion:</strong> Athletic-inspired and comfortable, Champion sweatshirts are ideal for teams and active organizations.</li>
                <li><strong>Comfort Colors:</strong> Garment-dyed for a soft, vintage feel, Comfort Colors sweatshirts offer relaxed style and unique color options.</li>
                <li><strong>Under Armour:</strong> Engineered for performance, Under Armour sweatshirts feature moisture-wicking fabrics and a modern fit.</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">Why Choose Us</h2>
              <p className="mb-4">We specialize in custom embroidery for sweatshirts—no printing or print-on-demand. Our in-house embroidery experts ensure every sweatshirt meets the highest standards for quality and consistency. Fast turnaround, personalized service, and a wide range of customization options make us the trusted choice for branded apparel.</p>

              {/* Sweatshirt-specific FAQ using Accordion with consistent styling */}
              {embroideredType === "sweatshirt" && (
                <div className="bg-white rounded-2xl shadow-xl p-8 mt-12 mb-8 border border-gray-100">
                  <h2 className="text-2xl font-extrabold mb-6 text-[#113f7c]">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full mb-8">
                    <AccordionItem value="faq1" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">How Do I Upload a Logo for Embroidery?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Upload your logo directly through our online ordering system. Our design team will digitize your artwork and match thread colors for the best results.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq2" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">What’s the Typical Turnaround Time for Orders?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Most orders are completed within a few business days, depending on order size and design complexity. Contact us for a precise estimate for your project.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq3" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">Where Can Embroidery Be Placed on a Sweatshirt?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Popular placements include the left chest, center chest, sleeves, and back. We’ll help you choose the best location for your logo or design.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq4" className="rounded-lg border mb-4 overflow-hidden bg-gray-50">
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">What Are the Best Fabrics for Embroidered Sweatshirts?</AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">Cotton and cotton-blend sweatshirts provide the best foundation for high-quality embroidery. Fleece-lined options also work well for crisp, professional stitching.</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </>
  );
};

export default EmbroideredDynamicPage;
