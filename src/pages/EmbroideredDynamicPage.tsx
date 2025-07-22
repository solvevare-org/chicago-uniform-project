// This is a copy of DynamicCategoryPage.tsx, renamed as EmbroideredDynamicPage.tsx
// You can now customize this page for embroidered categories as needed.

import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";

const EmbroideredDynamicPage: React.FC = () => {
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
  // State for pagination
  const [visibleCount, setVisibleCount] = useState(30);

  const location = useLocation();
  const path = location.pathname;
  let embroideredType = "";
  if (path.includes("custom-embroidered-polo")) embroideredType = "polo";
  else if (path.includes("custom-embroidered-hoodie"))
    embroideredType = "hoodie";
  else if (path.includes("custom-embroidered-t-shirt"))
    embroideredType = "t-shirt";
  else if (path.includes("custom-embroidered-sweatshirt"))
    embroideredType = "sweatshirt";
  console.log("embroideredType:", embroideredType);

  // Reset filters and pagination when embroideredType changes
  useEffect(() => {
    setSelectedFilters({
      CATEGORY: new Set(),
      BRANDS: new Set(),
      COLOR: new Set(),
    });
    setVisibleCount(30);
  }, [embroideredType]);

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
        const response = await fetch(
          `http://localhost:3000/api/products/by-keyword/${embroideredType}`
        );
        if (!response.ok)
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        const data = await response.json();
        setProducts(data.products || []);
        console.log("Fetched products:", data.products);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching products."
        );
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
        console.log("Loading:", loading, "Error:", error);
      }
    };
    fetchProducts();
  }, [embroideredType]);

  // Get all valid variations for each product
  const productsWithValidVariation = products
    .map((product) => {
      const validVariations = (product.variations || [product]).filter(
        (v: any) => v.colorFrontImage && v.colorFrontImage.trim() !== ""
      );
      if (validVariations.length === 0) return null;
      return { ...product, _validVariations: validVariations };
    })
    .filter(Boolean);

  // Get unique brands from all products
  const brands = Array.from(
    new Set(productsWithValidVariation.map((p: any) => p.brandName))
  ).filter(Boolean);
  // Get unique colors from all valid variations
  const colors = Array.from(
    new Set(
      productsWithValidVariation.flatMap((p: any) =>
        (p._validVariations || []).map((v: any) => v.colorName)
      )
    )
  ).filter(Boolean);

  // Filter products client-side
  const filteredProducts = productsWithValidVariation
    .map((product: any) => {
      let displayVariation = product._validVariations[0];
      if (selectedFilters.COLOR.size > 0) {
        const match = product._validVariations.find((vv: any) =>
          selectedFilters.COLOR.has(vv.colorName)
        );
        if (match) displayVariation = match;
        else return null; // If no variation matches the color, exclude product
      }
      // Price filter (use displayVariation.salePrice)
      if (displayVariation.salePrice > priceRange) return null;
      // Brand filter
      if (
        selectedFilters.BRANDS.size > 0 &&
        !selectedFilters.BRANDS.has(product.brandName)
      )
        return null;
      // Category filter
      if (
        selectedFilters.CATEGORY.size > 0 &&
        !selectedFilters.CATEGORY.has(embroideredType)
      )
        return null;
      return { ...product, _displayVariation: displayVariation };
    })
    .filter(Boolean);

  // Improved return logic for loading and empty state
  return (
    <div className="min-h-screen bg-white text-[#222] py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header and Breadcrumb aligned */}
        {embroideredType === "polo" && (
          <h1 className="text-3xl font-bold mb-4 text-[#3ab7ea]">
            Custom Embroidered Polo Shirts
          </h1>
        )}
        {embroideredType === "hoodie" && (
          <h1 className="text-3xl font-bold mb-4 text-[#3ab7ea]">
            Custom Embroidered Hoodies
          </h1>
        )}
        {embroideredType === "t-shirt" && (
          <h1 className="text-3xl font-bold mb-4 text-[#3ab7ea]">
            Custom Embroidered T-Shirts
          </h1>
        )}
        {embroideredType === "sweatshirt" && (
          <h1 className="text-3xl font-bold mb-4 text-[#3ab7ea]">
            Custom Embroidered Sweatshirts
          </h1>
        )}
        <div className="text-[#b3ddf3] text-sm mb-6">
          <span className="hover:underline cursor-pointer ">Home</span>{" "}
          /Category/
          <span className="text-[#b3ddf3] font-semibold">
            {embroideredType}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Section */}
          <div
            className="col-span-1 bg-[#f3f8fa] p-6 rounded-xl shadow-lg border border-[#b3ddf3]"
            style={{ maxHeight: "24rem", overflowY: "auto" }}
          >
            {/* CATEGORY (filtered by embroideredCategory) */}
            <div className="mb-6 border-b border-[#b3ddf3] pb-4">
              <h2
                className="text-xl font-semibold flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setActiveTab(activeTab === "CATEGORY" ? null : "CATEGORY")
                }
              >
                CATEGORY
                <FaChevronDown
                  className={`transition-transform ${
                    activeTab === "CATEGORY" ? "rotate-180" : ""
                  }`}
                />
              </h2>
              {activeTab === "CATEGORY" && embroideredType && (
                <ul className="mt-4 space-y-2 text-sm text-black">
                  <li className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="accent-[#b3ddf3]"
                      checked={selectedFilters.CATEGORY.has(embroideredType)}
                      onChange={() => {
                        setSelectedFilters((prev) => {
                          const updated = new Set(prev.CATEGORY);
                          if (updated.has(embroideredType))
                            updated.delete(embroideredType);
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
                onClick={() =>
                  setActiveTab(activeTab === "BRANDS" ? null : "BRANDS")
                }
              >
                BRANDS
                <FaChevronDown
                  className={`transition-transform ${
                    activeTab === "BRANDS" ? "rotate-180" : ""
                  }`}
                />
              </h2>
              {activeTab === "BRANDS" && (
                <ul className="mt-4 space-y-2 text-sm text-black">
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
                onClick={() =>
                  setActiveTab(activeTab === "COLOR" ? null : "COLOR")
                }
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
                  <ul className="space-y-2 text-sm text-black">
                    {colors.map((color) => (
                      <li key={color} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="accent-[#b3ddf3]"
                          checked={selectedFilters.COLOR.has(color)}
                          onChange={() => {
                            setSelectedFilters((prev) => {
                              // Single-select: only one color can be selected
                              const updated = new Set<string>();
                              if (!prev.COLOR.has(color)) updated.add(color);
                              return { ...prev, COLOR: updated };
                            });
                          }}
                        />
                        <span>{color}</span>
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
                onClick={() =>
                  setActiveTab(activeTab === "PRICE" ? null : "PRICE")
                }
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
          <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <p className="text-center text-gray-400 col-span-full">
                Loading products...
              </p>
            ) : error ? (
              <p className="text-center text-black/50 col-span-full">{error}</p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts
                .slice(0, visibleCount)
                .map((product: any, index: number) => {
                  const v = product._displayVariation;
                  return (
                    <Link
                      to={`/product/${v.sku}`}
                      key={v.sku}
                      className="bg-white p-4 rounded-xl border border-[#b3ddf3] shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 flex flex-col"
                    >
                      <img
                        src={`https://www.ssactivewear.com/${v.colorFrontImage}`}
                        alt={product.styleName}
                        className="h-48 w-full object-cover rounded-lg mb-4"
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
                      <p className="text-sm text-gray-500">In Stock: {v.qty}</p>
                    </Link>
                  );
                })
            ) : (
              <p className="text-gray-400 text-center col-span-full">
                No Products Found.
              </p>
            )}
            {/* Show More button */}
            {!loading && filteredProducts.length > visibleCount && (
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

        {/* Remove all duplicate/extra headers below the products for all types */}
        {/* Main top header for all embroidered types with left padding and Chicago flag blue color */}

        {/* Polo-specific content at the end with improved spacing and heading color */}
        {embroideredType === "polo" && (
          <div className="mt-16 px-4 md:px-16 lg:px-32 py-10 bg-white rounded-2xl shadow-xl border border-[#b3ddf3]">
            {/* Polo-specific rich content and FAQs */}
            {embroideredType === "polo" && (
              <section className="mt-12 space-y-10">
                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  High-Quality Custom Embroidered Polo Shirts to Your
                  Specification
                </h2>
                <p className="mb-4">
                  South Loop Prints is committed to providing you with the best
                  quality custom embroidered polo shirts, tailored to your exact
                  branding specifications. Our specialized range of shirts is
                  ideal for outfitting corporate crews, sports teams, or
                  hospitality staff. We can tailor our designs to meet your
                  specific needs, offering polo shirts that deliver comfort,
                  durability, and a professional appearance. Our shirts fit
                  comfortably and turn heads with their stylish and
                  well-designed features.
                </p>

                <p className="mb-4">
                  Our extensive range of custom polo shirts features top brands,
                  guaranteeing that all our shirts are of superior quality and
                  style. Our polos feature moisture-wicking capabilities, along
                  with classic cotton blends, to keep you dry and comfortable
                  day after day, all in the best style.
                </p>

                <p className="mb-4">
                  One of the things that sets us apart is our in-house
                  embroidery department, which can create same-day, individual
                  personalizations. Your logos, names, or designs are carefully
                  stitched with precision, making your brand look visible and
                  professional. With remarkable speed and exceptional attention
                  to detail, we can help you leave a bold and lasting
                  impression.
                </p>

                <p className="mb-4">
                  Whether you need one shirt or wholesale orders, South Loop
                  Prints promises to supply high-quality embroidered polo shirts
                  that accurately reflect your company's image. Browse today and
                  experience the finest combination of style, comfort, and
                  personalization.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Customize Your Polo Shirts with No Minimum Order Required
                </h2>
                <p className="mb-4">
                  Order as few or as many polos as you need—there’s no minimum!
                  Choose your preferred style, color, and size, then upload your
                  logo for professional embroidery. Our easy online process and
                  expert team make it simple to create unique, branded apparel
                  for any group or occasion.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Embroidered Logo Polo Shirts That Elevate Your Brand Identity
                </h2>
                <p className="mb-4">
                  Your logo is more than just a design—it’s the face of your
                  brand. We use advanced embroidery techniques to ensure every
                  detail is crisp and long-lasting. Whether you’re outfitting
                  staff, students, or event teams, our polos help you present a
                  unified, professional image.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Brands You Can Choose from
                </h2>
                <p className="mb-4">
                  We offer our clients a carefully curated selection of premium
                  brands to choose from, ensuring that your custom embroidered
                  polo shirts are of the highest fabric quality and style. All
                  these brands offer something unique, so you can select the
                  perfect polo that aligns with your brand identity as well as
                  functional needs.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-[#3ab7ea]">
                  Carhartt
                </h3>
                <p className="mb-4">
                  Reputed for rugged durability, Carhartt polos are built to
                  endure harsh environments. Ideal for hard-wearing industries
                  such as construction, manufacturing, and logistics, these
                  polos offer both functionality and long-lasting quality,
                  making them a go-to for teams that need dependable workwear.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-[#3ab7ea]">
                  Patagonia
                </h3>
                <p className="mb-4">
                  A leader in sustainability, Patagonia polos are crafted from
                  environmentally responsible materials like recycled polyester
                  and organic cotton. Perfect for eco-conscious businesses,
                  these shirts align with green brand values while delivering
                  comfort and performance in every stitch.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-[#3ab7ea]">
                  Gildan
                </h3>
                <p className="mb-4">
                  As a well-known name in everyday activewear, Gildan offers
                  polos that strike a balance between comfort, affordability,
                  and practicality. Their polos are especially suited for
                  large-scale orders, making them an excellent choice for
                  schools, events, and businesses seeking value without
                  sacrificing quality.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-[#3ab7ea]">
                  Champion
                </h3>
                <p className="mb-4">
                  With deep roots in athletic apparel, Champion polos fuse style
                  and performance. Known for their breathable fabrics and modern
                  cuts, these shirts are ideal for sports teams, fitness staff,
                  or anyone seeking a sporty edge in their everyday attire.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-[#3ab7ea]">
                  Comfort Colors
                </h3>
                <p className="mb-4">
                  Comfort Colors polos stand out with their soft, garment-dyed
                  fabric, which delivers a vintage, lived-in look from the
                  moment you put them on. These polos are ideal for lifestyle
                  brands, creative teams, or casual work environments that seek
                  a relaxed, timeless aesthetic.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-[#3ab7ea]">
                  Under Armour
                </h3>
                <p className="mb-4">
                  Engineered for performance, Under Armour polos feature
                  moisture-wicking technology and breathable materials, making
                  them a top pick for professionals on the move. Whether in the
                  office, on the golf course, or in the field, these polos keep
                  wearers cool, dry, and comfortable throughout the day.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Why Choose Us for Your Custom Polo Shirt Needs?
                </h2>
                <p className="mb-4">
                  By choosing South Loop Prints for your Polo shirt and personal
                  embroidery needs, you are choosing high quality and
                  reliability. You will be partnering with a conscientious team
                  of specialists who can fulfill your exact vision and deliver
                  high-quality custom embroidered polo shirts that perfectly
                  suit your requirements. Our in-house embroidery plant ensures
                  that your designs and logos are executed with accuracy and
                  attention, providing you with a professional finish that
                  improves the image of your firm. With same-day services, we
                  meet your emergency needs without compromising quality.
                </p>

                <p className="mb-4">
                  We recognize that each client has unique needs. That's why we
                  offer personalized consultations to help you select the right
                  products and designs. With a diverse portfolio of premium
                  brands, you can choose shirts, shoes, or other apparel that
                  reflects your brand image while serving practical, everyday
                  purposes. At South Loop Prints, we are committed to providing
                  exceptional customer service, prompt delivery, and
                  high-quality products. Whether you need to dress a small group
                  or an entire corporation, we are here to guide you through the
                  process.
                </p>

                <p className="mb-4">
                  Shop now and experience the difference with South Loop
                  Prints—your trusted ally for custom embroidered logo polo
                  shirts that are super stylish and make a lasting impression.
                </p>

                {/* Example: Polo-specific FAQ using Accordion with Chicago flag blue */}
                {embroideredType === "polo" && (
                  <div className="bg-white rounded-2xl shadow-xl p-8 mt-12 mb-8 border border-gray-100">
                    <h2 className="text-2xl font-extrabold mb-6 text-[#113f7c]">
                      Frequently Asked Questions
                    </h2>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full mb-8"
                    >
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-lg font-semibold text-[#113f7c]">
                          Fabric Options for Custom Embroidered Polo Shirts
                        </AccordionTrigger>
                        <AccordionContent className="text-[#52525b] leading-relaxed">
                          South Loop Prints offers a variety of fabric options
                          for custom embroidered polo shirts, including 100%
                          cotton for comfort, polyester for durability, and
                          poly-cotton blends that strike a balance between
                          comfort and durability. These fabrics strike a balance
                          between comfort, longevity, and suitability for
                          embroidery, allowing you to choose the most suitable
                          option for your needs.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq2"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          Can I Mix and Match Polo Shirt Styles and Sizes?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Yes! You can combine different styles, colors, and
                          sizes within a single order to suit your team or
                          organization’s needs.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq3"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          What Affects the Cost of Embroidered Polo Shirts?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Pricing depends on the brand, fabric, quantity, and
                          complexity of your embroidery design. Bulk orders and
                          simpler logos typically offer the best value.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq4"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          How Do I Upload My Logo for Embroidery?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Our online ordering system makes it easy to upload
                          your logo. Our team will digitize your design for
                          embroidery and help you select thread colors for the
                          best results.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq5"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          Where to place embroidery on a polo shirt?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Popular embroidery placements include the left chest,
                          right chest, and sleeves. We’ll help you choose the
                          best location for your logo or design.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq6"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          What is the best material for polo shirts for
                          embroidery?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Cotton and cotton-blend polos provide a smooth surface
                          for crisp, detailed embroidery. Performance fabrics
                          are also available for moisture management and
                          comfort.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
        {/* Hoodie-specific content at the end */}
        {embroideredType === "hoodie" && (
          <div className="mt-16 px-4 md:px-16 lg:px-32 py-10 bg-white rounded-2xl shadow-xl border border-[#b3ddf3]">
            {/* Hoodie-specific rich content and FAQs */}
            {embroideredType === "hoodie" && (
              <section className="mt-12 space-y-10">
                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  High Quality Custom Embroidered Hoodies To Your Specification
                </h2>
                <p className="mb-4">
                  South Loop Prints offers superior-quality custom embroidered
                  hoodies, designed and manufactured to your precise logo and
                  branding specifications. Are you considering equipping your
                  company, corporate team, sports club, or children's sports
                  team? Our hoodies are the choice to go for. They are crafted
                  from the finest materials and designed to offer style,
                  comfort, warmth, and a professional appearance that stands out
                  from the crowd, making a lasting impression.
                </p>

                <p className="mb-4">
                  Our line of customized hoodies includes premium brands for
                  excellent fabric and style. From dense fleece to a superior
                  blend of moisture-wicking, our hoodies guarantee durability
                  and comfort all day. For your sports team, club members, or
                  everyday promotional apparel uniforms, they are the ideal
                  blend of function and style.
                </p>

                <p className="mb-4">
                  What sets South Loop Prints apart from other clothing
                  manufacturers is our in-house embroidery factory, which allows
                  us to provide same-day service on most orders. Logos, names,
                  and artwork are carefully crafted with precision by skilled
                  operators, leaving no room for error and resulting in sharp
                  detail and a strong brand image. With a superfast turnaround
                  and careful attention to detail, we help you create stylish,
                  eye-catching, custom apparel that stands out.
                </p>

                <p className="mb-4">
                  Regardless of whether you order in bulk or individually, South
                  Loop Prints is your one-stop shop for custom embroidered
                  hoodies that reflect your company's values and image. Explore
                  our collection today and experience the perfect blend of
                  business style, comfort, and personalization.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Create Personalised Embroidered Hoodies with No Minimums
                </h2>
                <p className="mb-4">
                  Order as few or as many as you need—there’s no minimum! Choose
                  your style, color, and size, then upload your logo for expert
                  embroidery. Our easy online process and in-house team make it
                  simple to create unique, branded hoodies for any group or
                  event.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Embroidered Custom Hoodies That Make a Lasting Impression
                </h2>
                <p className="mb-4">
                  Your logo is more than just a design—it’s your brand’s
                  identity. We use advanced embroidery techniques to ensure
                  every detail is crisp and durable. Whether for staff, teams,
                  or events, our hoodies help you present a unified,
                  professional image that lasts.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Trusted Brands and Premium Hoodie Materials
                </h2>
                <ul className="list-disc ml-6 mb-6">
                  <li>
                    <strong>Carhartt:</strong> Rugged and warm, Carhartt hoodies
                    are built for performance in demanding environments.
                  </li>
                  <li>
                    <strong>Patagonia:</strong> Sustainable and stylish,
                    Patagonia hoodies are perfect for eco-conscious brands.
                  </li>
                  <li>
                    <strong>Gildan:</strong> Affordable and comfortable, Gildan
                    hoodies are a favorite for bulk orders and everyday wear.
                  </li>
                  <li>
                    <strong>Champion:</strong> Athletic-inspired and
                    comfortable, Champion hoodies are ideal for teams and active
                    organizations.
                  </li>
                  <li>
                    <strong>Comfort Colors:</strong> Garment-dyed for a soft,
                    vintage feel, Comfort Colors hoodies offer relaxed style and
                    unique color options.
                  </li>
                  <li>
                    <strong>Under Armour:</strong> Engineered for performance,
                    Under Armour hoodies feature moisture-wicking fabrics and a
                    modern fit.
                  </li>
                </ul>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Why Choose Us for Custom Hoodie Embroidery?
                </h2>
                <p className="mb-4">
                  We focus exclusively on embroidery for our hoodies—no printing
                  or print-on-demand. Our in-house embroidery experts ensure
                  every hoodie meets the highest standards for quality and
                  consistency. Enjoy fast turnaround, personalized service, and
                  a wide range of customization options to make your hoodies
                  truly unique.
                </p>

                {/* Hoodie-specific FAQ using Accordion with consistent styling */}
                {embroideredType === "hoodie" && (
                  <div className="bg-white rounded-2xl shadow-xl p-8 mt-12 mb-8 border border-gray-100">
                    <h2 className="text-2xl font-extrabold mb-6 text-[#113f7c]">
                      Frequently Asked Questions
                    </h2>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full mb-8"
                    >
                      <AccordionItem
                        value="faq1"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          What Hoodie Styles Are Best for Embroidery?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          We offer a variety of hoodie styles, including
                          pullover, zip-up, and heavyweight options. Cotton and
                          cotton-blend hoodies from brands like Carhartt,
                          Champion, and Gildan provide the best foundation for
                          crisp, professional embroidery.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq2"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          How to Order Personalised Embroidered Hoodies Online
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Visit our website, select your hoodie style and color,
                          and upload your logo. Specify embroidery placement and
                          any customization details. Our team will digitize your
                          design and deliver high-quality embroidered hoodies
                          quickly and efficiently.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq3"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          How Much Does It Cost to Get Custom Embroidered
                          Hoodies?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Pricing depends on the hoodie brand, material,
                          embroidery design, and quantity. Bulk orders and
                          simpler logos offer the best value. Contact us for a
                          detailed quote tailored to your needs.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
        {/* T-shirt-specific content at the end */}
        {embroideredType === "t-shirt" && (
          <div className="mt-16 px-4 md:px-16 lg:px-32 py-10 bg-white rounded-2xl shadow-xl border border-[#b3ddf3]">
            {/* T-shirt-specific rich content and FAQs */}
            {embroideredType === "t-shirt" && (
              <section className="mt-12 space-y-10">
                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Shop Custom Embroidered T-Shirts to Elevate Your Brand
                </h2>
                <p className="mb-4">
                  Showcase your brand with high-quality custom embroidered
                  t-shirts—no printed or print-on-demand products, just
                  professional embroidery. Perfect for corporate identity, staff
                  uniforms, events, and promotional apparel, our t-shirts are
                  designed to help your business stand out with a polished,
                  professional look.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Design T-Shirts with Embroidered Logos That Stand Out
                </h2>
                <p className="mb-4">
                  Personalize your t-shirts with your company logo, name, or
                  custom artwork. Our advanced embroidery techniques ensure
                  crisp, durable results that reflect your brand’s quality.
                  Upload your logo and choose from a variety of thread colors
                  for a truly custom look.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Choose From Trusted Brands
                </h2>
                <ul className="list-disc ml-6 mb-6">
                  <li>
                    <strong>Carhartt:</strong> Rugged and reliable, Carhartt
                    t-shirts are built for performance and comfort in demanding
                    environments.
                  </li>
                  <li>
                    <strong>Patagonia:</strong> Sustainable and stylish,
                    Patagonia t-shirts are perfect for eco-conscious brands
                    seeking quality and responsibility.
                  </li>
                  <li>
                    <strong>Gildan:</strong> Affordable and versatile, Gildan
                    t-shirts are a favorite for bulk orders and everyday wear.
                  </li>
                  <li>
                    <strong>Champion:</strong> Athletic-inspired and
                    comfortable, Champion t-shirts are ideal for teams and
                    active organizations.
                  </li>
                  <li>
                    <strong>Comfort Colors:</strong> Garment-dyed for a soft,
                    vintage feel, Comfort Colors t-shirts offer relaxed style
                    and unique color options.
                  </li>
                  <li>
                    <strong>Under Armour:</strong> Engineered for performance,
                    Under Armour t-shirts feature moisture-wicking fabrics and a
                    modern fit.
                  </li>
                </ul>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  No Minimum Orders on Custom T-Shirts with Embroidery
                </h2>
                <p className="mb-4">
                  Order just one t-shirt or hundreds—there’s no minimum! Our
                  flexible ordering system is perfect for both small businesses
                  and large organizations. Enjoy bulk pricing for larger orders
                  and the same high-quality embroidery on every piece.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Why Choose Us
                </h2>
                <p className="mb-4">
                  We specialize in custom embroidery for t-shirts—no printing or
                  print-on-demand. Our in-house embroidery experts ensure every
                  shirt meets the highest standards for quality and consistency.
                  Fast turnaround, personalized service, and a wide range of
                  customization options make us the trusted choice for branded
                  apparel.
                </p>

                {/* T-shirt-specific FAQ using Accordion with consistent styling */}
                {embroideredType === "t-shirt" && (
                  <div className="bg-white rounded-2xl shadow-xl p-8 mt-12 mb-8 border border-gray-100">
                    <h2 className="text-2xl font-extrabold mb-6 text-[#113f7c]">
                      Frequently Asked Questions
                    </h2>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full mb-8"
                    >
                      <AccordionItem
                        value="faq1"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          What Are the Best T-Shirt Fabrics for Embroidery?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Cotton and cotton-blend t-shirts provide the best
                          foundation for high-quality embroidery. Premium brands
                          like Gildan, Champion, and Carhartt offer ideal fabric
                          compositions for crisp, professional stitching.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq2"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          Can I Upload My Own Logo for Embroidered T-Shirts?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Yes! Upload your logo directly through our online
                          ordering system. Our design team will digitize your
                          artwork and match thread colors for the best results.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq3"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          Where Can Embroidery Be Placed on a T-Shirt?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Popular placements include the left chest, center
                          chest, sleeves, and back. We’ll help you choose the
                          best location for your logo or design.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq4"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          Is There a Minimum Order for Embroidered T-Shirts?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          No minimum order required! Order a single shirt or as
                          many as you need, with consistent quality on every
                          piece.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq5"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          How Much Do Custom Embroidered T-Shirts Cost?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Pricing depends on the brand, fabric, embroidery
                          design, and quantity. Bulk orders and simpler logos
                          offer the best value. Contact us for a detailed quote
                          tailored to your needs.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq6"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          Can I Order Multiple Sizes and Styles in One Order?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Absolutely! Mix and match sizes, colors, and styles
                          within a single order to suit your team or
                          organization’s needs.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq7"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          Do You Offer Bulk Pricing for Large Orders?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Yes, we offer attractive bulk pricing for large
                          quantity orders. The more you order, the better your
                          per-piece pricing becomes.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
        {/* Sweatshirt-specific content at the end */}
        {embroideredType === "sweatshirt" && (
          <div className="mt-16 px-4 md:px-16 lg:px-32 py-10 bg-white rounded-2xl shadow-xl border border-[#b3ddf3]">
            {/* Sweatshirt-specific rich content and FAQs */}
            {embroideredType === "sweatshirt" && (
              <section className="mt-12 space-y-10">
                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  High-Quality Custom Embroidered Sweatshirts for Every Occasion
                </h2>
                <p className="mb-4">
                  Showcase your brand with high-quality custom embroidered
                  sweatshirts—no printed or print-on-demand items, just
                  professional embroidery. Perfect for corporate events, team
                  wear, and client gifts, our sweatshirts are designed for
                  comfort, durability, and a polished, professional look.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Customize Your Sweatshirts with Logos, Names, and More
                </h2>
                <p className="mb-4">
                  Personalize your sweatshirts with your company logo, team
                  name, or custom artwork. Our advanced embroidery techniques
                  ensure crisp, long-lasting results that reflect your brand’s
                  quality. Upload your logo and choose from a variety of thread
                  colors for a truly custom look.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Personalized Embroidered Sweatshirts with No Minimum Order
                </h2>
                <p className="mb-4">
                  Order just one sweatshirt or hundreds—there’s no minimum! Our
                  flexible ordering system is perfect for both small businesses
                  and large organizations. Enjoy bulk pricing for larger orders
                  and the same high-quality embroidery on every piece.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Top Sweatshirt Styles: Crewnecks, Hoodies, and Pullovers
                </h2>
                <p className="mb-4">
                  Choose from a variety of sweatshirt styles to suit your needs.
                  Crewnecks offer a classic, professional look; hoodies provide
                  warmth and versatility; and pullovers deliver a modern,
                  athletic style. All are available for custom embroidery and
                  made from premium, durable materials.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Trusted Brands for You to Personalize
                </h2>
                <ul className="list-disc ml-6 mb-6">
                  <li>
                    <strong>Carhartt:</strong> Rugged and reliable, Carhartt
                    sweatshirts are built for performance and comfort in
                    demanding environments.
                  </li>
                  <li>
                    <strong>Patagonia:</strong> Sustainable and stylish,
                    Patagonia sweatshirts are perfect for eco-conscious brands
                    seeking quality and responsibility.
                  </li>
                  <li>
                    <strong>Gildan:</strong> Affordable and versatile, Gildan
                    sweatshirts are a favorite for bulk orders and everyday
                    wear.
                  </li>
                  <li>
                    <strong>Champion:</strong> Athletic-inspired and
                    comfortable, Champion sweatshirts are ideal for teams and
                    active organizations.
                  </li>
                  <li>
                    <strong>Comfort Colors:</strong> Garment-dyed for a soft,
                    vintage feel, Comfort Colors sweatshirts offer relaxed style
                    and unique color options.
                  </li>
                  <li>
                    <strong>Under Armour:</strong> Engineered for performance,
                    Under Armour sweatshirts feature moisture-wicking fabrics
                    and a modern fit.
                  </li>
                </ul>

                <h2 className="text-2xl font-semibold mb-4 text-[#3ab7ea]">
                  Why Choose Us
                </h2>
                <p className="mb-4">
                  We specialize in custom embroidery for sweatshirts—no printing
                  or print-on-demand. Our in-house embroidery experts ensure
                  every sweatshirt meets the highest standards for quality and
                  consistency. Fast turnaround, personalized service, and a wide
                  range of customization options make us the trusted choice for
                  branded apparel.
                </p>

                {/* Sweatshirt-specific FAQ using Accordion with consistent styling */}
                {embroideredType === "sweatshirt" && (
                  <div className="bg-white rounded-2xl shadow-xl p-8 mt-12 mb-8 border border-gray-100">
                    <h2 className="text-2xl font-extrabold mb-6 text-[#113f7c]">
                      Frequently Asked Questions
                    </h2>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full mb-8"
                    >
                      <AccordionItem
                        value="faq1"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          How Do I Upload a Logo for Embroidery?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Upload your logo directly through our online ordering
                          system. Our design team will digitize your artwork and
                          match thread colors for the best results.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq2"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          What’s the Typical Turnaround Time for Orders?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Most orders are completed within a few business days,
                          depending on order size and design complexity. Contact
                          us for a precise estimate for your project.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq3"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          Where Can Embroidery Be Placed on a Sweatshirt?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Popular placements include the left chest, center
                          chest, sleeves, and back. We’ll help you choose the
                          best location for your logo or design.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem
                        value="faq4"
                        className="rounded-lg border mb-4 overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#3ab7ea] bg-gray-100 hover:bg-blue-50 transition-all">
                          What Are the Best Fabrics for Embroidered Sweatshirts?
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-gray-700 bg-white">
                          Cotton and cotton-blend sweatshirts provide the best
                          foundation for high-quality embroidery. Fleece-lined
                          options also work well for crisp, professional
                          stitching.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbroideredDynamicPage;
