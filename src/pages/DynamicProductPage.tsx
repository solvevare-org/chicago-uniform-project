import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DynamicProductPage: React.FC = () => {
  const { sku } = useParams<{ sku: string }>(); // Get the SKU from the route parameters
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [relatedCategories, setRelatedCategories] = useState<string[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // Restore missing states for logo and size quantities
  const [logoData, setLogoData] = useState<
    Record<
      number,
      {
        image: string | null;
        x: number;
        y: number;
        size: number;
        rotation: number;
      }
    >
  >({});
  const [isDragging, setIsDragging] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const mainSliderRef = useRef<any>(null);

  // Size and quantity management
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>(
    {}
  );

  // Restore missing states for logo upload/size
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(50);

  // Restore brands, best sellers, and related products logic
  const [brands, setBrands] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  // Only show 5 brands
  const displayedBrands = brands.slice(0, 5);

  // Fetch product details
  useEffect(() => {
    if (!sku) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3000/api/products/sku/${sku}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("product data", data);
        setProduct(data.product);
        // Set initial variation to the first one
        if (data.product?.variations?.length > 0) {
          const firstVariation = data.product.variations[0];

          // Find all variations with the same color code as the first variation
          const colorVariations = data.product.variations.filter(
            (v: any) => v.colorCode === firstVariation.colorCode
          );

          // Get all available sizes for this color by collecting sizeName from each variation
          const sizesForColor = Array.from(
            new Set(
              colorVariations
                .filter((v: any) => v.sizeName && v.qty > 0)
                .map((v: any) => v.sizeName as string)
            )
          ).sort() as string[];

          console.log("Initial sizes for color:", sizesForColor);

          setSelectedVariation(firstVariation);
          setAvailableSizes(sizesForColor);

          // Initialize size quantities
          const initialSizeQuantities: Record<string, number> = {};
          sizesForColor.forEach((size) => {
            initialSizeQuantities[size] = 0;
          });
          setSizeQuantities(initialSizeQuantities);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product details.");
        setLoading(false);
      });
  }, [sku]);

  // Fetch categories for related categories mesh
  useEffect(() => {
    fetch("http://localhost:3000/api/styles/base-categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.baseCategories || []))
      .catch(() => setCategories([]));
  }, []);

  // Fetch reviews for this product
  useEffect(() => {
    if (!sku) return;
    fetch(`http://localhost:3000/api/reviews/${sku}`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => setReviews([]));
  }, [sku]);

  // Find related categories (excluding current)
  useEffect(() => {
    if (!product || !product.baseCategory) return;
    setRelatedCategories(
      categories.filter((cat) => cat !== product.baseCategory)
    );
  }, [categories, product]);

  // Fetch brands
  useEffect(() => {
    fetch("http://localhost:3000/api/brands/")
      .then((res) => res.json())
      .then((data) => setBrands(data.brands || []))
      .catch(() => setBrands([]));
  }, []);

  // Fetch best sellers (top 8 in base category)
  useEffect(() => {
    if (product?.baseCategory) {
      fetch(
        `http://localhost:3000/api/products/by-base-category/${product.baseCategory}?limit=8`
      )
        .then((res) => res.json())
        .then((data) => setBestSellers(data.products || []))
        .catch(() => setBestSellers([]));
    }
  }, [product?.baseCategory]);

  // Fetch related products (top 8 in base category)
  useEffect(() => {
    if (product?.baseCategory) {
      fetch(
        `http://localhost:3000/api/products/by-base-category/${product.baseCategory}?limit=8`
      )
        .then((res) => res.json())
        .then((data) => setRelatedProducts(data.products || []))
        .catch(() => setRelatedProducts([]));
    }
  }, [product?.baseCategory]);

  if (loading) return <div>Loading...</div>;

  if (!product) return <div>Product not found</div>;

  // Function to handle color selection
  const handleColorSelection = (selectedVariation: any) => {
    console.log("Selected variation:", selectedVariation); // Debug log
    console.log(
      "Selected variation full data:",
      JSON.stringify(selectedVariation, null, 2)
    );
    // Find all variations with the same color code
    const colorVariations = product.variations.filter(
      (v: any) => v.colorCode === selectedVariation.colorCode
    );

    // Get all available sizes for this color by collecting sizeName from each variation
    const sizesForColor = Array.from(
      new Set(
        colorVariations
          .filter((v: any) => v.sizeName && v.qty > 0) // Only include sizes that have inventory
          .map((v: any) => v.sizeName as string)
      )
    ).sort() as string[];

    setSelectedVariation(selectedVariation);
    setAvailableSizes(sizesForColor);

    // Reset size quantities for new color
    const newSizeQuantities: Record<string, number> = {};
    sizesForColor.forEach((size) => {
      newSizeQuantities[size] = 0;
    });
    setSizeQuantities(newSizeQuantities);
  };

  // Ensure images is always an array
  let images: string[] = [];
  if (selectedVariation) {
    images = [
      selectedVariation.colorFrontImage &&
      selectedVariation.colorFrontImage !== ""
        ? `https://www.ssactivewear.com/${selectedVariation.colorFrontImage}`
        : undefined,
      selectedVariation.colorSideImage &&
      selectedVariation.colorSideImage !== ""
        ? `https://www.ssactivewear.com/${selectedVariation.colorSideImage}`
        : undefined,
      selectedVariation.colorBackImage &&
      selectedVariation.colorBackImage !== ""
        ? `https://www.ssactivewear.com/${selectedVariation.colorBackImage}`
        : undefined,
      selectedVariation.colorOnModelFrontImage &&
      selectedVariation.colorOnModelFrontImage !== ""
        ? `https://www.ssactivewear.com/${selectedVariation.colorOnModelFrontImage}`
        : undefined,
      selectedVariation.colorOnModelSideImage &&
      selectedVariation.colorOnModelSideImage !== ""
        ? `https://www.ssactivewear.com/${selectedVariation.colorOnModelSideImage}`
        : undefined,
      selectedVariation.colorOnModelBackImage &&
      selectedVariation.colorOnModelBackImage !== ""
        ? `https://www.ssactivewear.com/${selectedVariation.colorOnModelBackImage}`
        : undefined,
      selectedVariation.colorDirectSideImage &&
      selectedVariation.colorDirectSideImage !== ""
        ? `https://www.ssactivewear.com/${selectedVariation.colorDirectSideImage}`
        : undefined,
    ].filter(
      (img): img is string => !!img && img !== "https://www.ssactivewear.com/"
    );
    // Remove duplicates (keep only unique images)
    images = images.filter((img, idx, arr) => arr.indexOf(img) === idx);
    // If only one unique image, keep only one
    if (images.length > 1 && images.every((img) => img === images[0])) {
      images = [images[0]];
    }
  }
  // If there are no images, show a placeholder
  if (!Array.isArray(images) || images.length === 0) {
    images = ["/public/img01.avif"];
  }
  // If only one image, disable infinite and arrows in slider
  const singleImage = images.length === 1;

  const handleSizeQuantityChange = (size: string, newQuantity: number) => {
    if (newQuantity >= 0) {
      setSizeQuantities((prev) => ({
        ...prev,
        [size]: newQuantity,
      }));
    }
  };

  const getTotalQuantity = () => {
    return Object.values(sizeQuantities).reduce((total, qty) => total + qty, 0);
  };

  const getTotalPrice = () => {
    const totalQty = getTotalQuantity();
    return (totalQty * selectedVariation.salePrice).toFixed(2);
  };

  const handleLogoPosition = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setLogoData((prev) => ({
        ...prev,
        [currentImageIndex]: {
          ...prev[currentImageIndex],
          x,
          y,
        },
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoData((prev) => ({
          ...prev,
          [currentImageIndex]: {
            ...prev[currentImageIndex],
            image: reader.result as string,
            x: prev[currentImageIndex]?.x || 50,
            y: prev[currentImageIndex]?.y || 50,
            size: prev[currentImageIndex]?.size || 50,
            rotation: prev[currentImageIndex]?.rotation || 0,
          },
        }));
        setUploadedImage(reader.result as string); // Set uploaded image
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleLogoSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const size = Number(event.target.value);
    setLogoData((prev) => ({
      ...prev,
      [currentImageIndex]: {
        ...prev[currentImageIndex],
        size,
      },
    }));
    setLogoSize(size); // Update logo size state
  };

  const handleRotateLogo = () => {
    setLogoData((prev) => ({
      ...prev,
      [currentImageIndex]: {
        ...prev[currentImageIndex],
        rotation: (prev[currentImageIndex]?.rotation || 0) + 15,
      },
    }));
  };

  const handleDeleteLogo = () => {
    setLogoData((prev) => ({
      ...prev,
      [currentImageIndex]: {
        ...prev[currentImageIndex],
        image: null,
      },
    }));
    setUploadedImage(null); // Clear uploaded image
  };
  const handlePurchase = () => {
    const totalQty = getTotalQuantity();
    if (totalQty === 0) {
      alert("Please select at least one item to purchase.");
      return;
    }

    const selectedSizes = Object.entries(sizeQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([size, qty]) => `${size}: ${qty}`)
      .join(", ");

    alert(
      `You have purchased ${totalQty} units of ${
        product.styleName
      }.\nSizes: ${selectedSizes}\nTotal: $${getTotalPrice()}`
    );
  };
  const startDragging = () => {
    if (logoData[currentImageIndex]?.image) {
      setIsDragging(true);
    }
  };

  const stopDragging = () => setIsDragging(false);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    mainSliderRef.current?.slickGoTo(index); // Navigate to the selected image in the main slider
  };

  const handleSlideChange = (index: number) => {
    setCurrentImageIndex(index); // Update the current image index when the main slider changes
  };

  // Calculate subtotal price - now handled by getTotalPrice()

  // Slider settings for react-slick
  const sliderSettings = {
    dots: false,
    infinite: !singleImage,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: !singleImage,
    beforeChange: (_: number, next: number) => handleSlideChange(next),
  };

  return (
    <div className="min-h-screen bg-white text-[#222] min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}

        {/* HQ Visuals */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Section */}
          <div className="relative">
            {/* Main Slider */}
            <Slider {...sliderSettings} ref={mainSliderRef}>
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative flex items-center justify-center"
                  onMouseMove={handleLogoPosition}
                  onMouseDown={startDragging}
                  onMouseUp={stopDragging}
                  onMouseLeave={stopDragging}
                >
                  {/* Product Image */}
                  <img
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    className="w-auto h-auto max-w-full max-h-[500px] object-contain rounded-lg shadow-lg"
                    style={{ display: "block", margin: "0 auto" }}
                  />

                  {/* Uploaded Logo */}
                  {logoData[index]?.image && (
                    <img
                      src={logoData[index].image}
                      alt="Uploaded Logo"
                      className="absolute"
                      style={{
                        top: logoData[index].y || "50%",
                        left: logoData[index].x || "50%",
                        transform: `translate(-50%, -50%) rotate(${
                          logoData[index].rotation || 0
                        }deg)`,
                        width: `${logoData[index].size || 50}px`,
                        height: `${logoData[index].size || 50}px`,
                        cursor: "grab",
                        mixBlendMode: "multiply", // Blend mode for embossed effect
                        opacity: 0.8, // Slight transparency for editing mode
                      }}
                    />
                  )}
                </div>
              ))}
            </Slider>

            {/* Thumbnail Slider */}
            <div className="mt-4 flex justify-center space-x-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border-2 rounded-lg ${
                    currentImageIndex === index
                      ? "border-[#b3ddf3]"
                      : "border-transparent"
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-auto h-auto max-h-20 object-contain rounded-lg"
                    style={{ margin: "0 auto" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h1 className="text-5xl font-extrabold mb-4 text-[#b3ddf3]">
                  {product.productName}
                </h1>
                <p className="text-lg text-[#b3ddf3] mb-6 italic">
                  {selectedVariation?.colorName}
                </p>

                {/* Color Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Available Colors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {/* Filter unique colors by colorCode */}
                    {product?.variations
                      ?.filter(
                        (variation: any, index: number, self: any[]) =>
                          index ===
                          self.findIndex(
                            (v: any) => v.colorCode === variation.colorCode
                          )
                      )
                      .map((variation: any, index: number) => (
                        <button
                          key={`${variation.colorCode}-${index}`}
                          onClick={() => handleColorSelection(variation)}
                          className={`relative p-1 rounded-full ${
                            selectedVariation?.colorCode === variation.colorCode
                              ? "ring-2 ring-blue-500"
                              : ""
                          }`}
                          title={variation.colorName}
                        >
                          {variation.colorSwatchImage ? (
                            <img
                              src={`https://www.ssactivewear.com/${variation.colorSwatchImage}`}
                              alt={variation.colorName}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full border border-gray-300"
                              style={{
                                backgroundColor: `#${variation.colorCode}`,
                              }}
                            />
                          )}
                        </button>
                      ))}
                  </div>
                </div>
                <p className="text-3xl font-bold mb-2 text-[#b3ddf3]">
                  ${selectedVariation?.salePrice.toFixed(2)}
                </p>
                <div className="flex items-center mb-2">
                  {/* Generate 3D Button - right of price with dashed border */}
                  <button
                    onClick={() =>
                      navigate(`/3dproducts/${selectedVariation.sku}`)
                    }
                    className="py-2 px-6 border-2 border-dashed border-blue-400 rounded-xl bg-blue-900/20 text-blue-300 font-bold text-base shadow-lg hover:bg-blue-800/30 hover:text-white transition-all duration-200 ml-2"
                    style={{ minWidth: "140px" }}
                  >
                    Generate 3D
                  </button>
                </div>
                <p className="text-lg font-medium mb-6 text-gray-300">
                  Subtotal:{" "}
                  <span className="text-[#b3ddf3]">${getTotalPrice()}</span>
                </p>
                <div className="mb-6">
                  <p className="text-sm text-gray-400">
                    SKU: {selectedVariation.sku}
                  </p>
                  <p className="text-sm text-gray-400">
                    GTIN: {selectedVariation.gtin}
                  </p>
                  <p className="text-sm text-gray-400">
                    Country of Origin: {selectedVariation.countryOfOrigin}
                  </p>
                  <p className="text-sm text-gray-400">
                    Available Quantity:{" "}
                    <span className="font-bold">{selectedVariation.qty}</span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Case Quantity (Max): {selectedVariation.caseQty}
                  </p>
                  <p className="text-sm text-gray-400">
                    Unit Weight: {selectedVariation.unitWeight} lbs
                  </p>
                </div>

                {/* Size and Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold mb-4 text-gray-800">
                    Select Size & Quantity
                  </label>

                  {/* Size Grid - Enhanced Design */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {availableSizes.map((size) => {
                      const qty = sizeQuantities[size] || 0;
                      return (
                        <div key={size} className="flex flex-col items-center">
                          {/* Size Box with Input */}
                          <div className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors shadow-sm">
                            {/* Size Label */}
                            <div className="text-center mb-3">
                              <span className="text-lg font-bold text-gray-800 block">
                                {size}
                              </span>
                            </div>

                            {/* Quantity Input Section */}
                            <div className="flex flex-col items-center space-y-2">
                              {/* Quantity Display/Input */}
                              <div className="flex items-center justify-center w-full">
                                <input
                                  type="number"
                                  value={qty}
                                  onChange={(e) =>
                                    handleSizeQuantityChange(
                                      size,
                                      Math.max(0, parseInt(e.target.value) || 0)
                                    )
                                  }
                                  className="w-16 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                  min="0"
                                  placeholder="0"
                                />
                              </div>

                              {/* Plus/Minus Buttons */}
                              <div className="flex items-center space-x-2 w-full">
                                <button
                                  onClick={() =>
                                    handleSizeQuantityChange(
                                      size,
                                      Math.max(0, qty - 1)
                                    )
                                  }
                                  className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                  disabled={qty <= 0}
                                >
                                  −
                                </button>
                                <button
                                  onClick={() =>
                                    handleSizeQuantityChange(size, qty + 1)
                                  }
                                  className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <span className="text-sm text-gray-600 block mb-1">
                          Total Quantity
                        </span>
                        <span className="text-3xl font-bold text-blue-600">
                          {getTotalQuantity()}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-sm text-gray-600 block mb-1">
                          Total Price
                        </span>
                        <span className="text-3xl font-bold text-green-600">
                          ${getTotalPrice()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Selected Sizes Summary */}
                  {getTotalQuantity() > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Order Summary:
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(sizeQuantities)
                          .filter(([_, qty]) => qty > 0)
                          .map(([size, qty]) => (
                            <div
                              key={size}
                              className="flex justify-between items-center py-1"
                            >
                              <span className="text-sm font-medium text-gray-700">
                                Size {size}:
                              </span>
                              <span className="text-sm font-bold text-gray-900">
                                {qty} × $
                                {selectedVariation.salePrice.toFixed(2)} = $
                                {(qty * selectedVariation.salePrice).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        <div className="border-t border-gray-300 pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-gray-800">
                              Total:
                            </span>
                            <span className="text-lg font-bold text-green-600">
                              ${getTotalPrice()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Upload Your Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#b3ddf3] file:text-[#222] hover:file:bg-[#a0cbe8]"
                  />
                </div>

                {uploadedImage && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Logo Size
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={logoSize}
                      onChange={handleLogoSizeChange}
                      className="w-full appearance-none bg-gray-700 rounded-full h-2 focus:outline-none focus:ring-2 focus:ring-[#b3ddf3]"
                    />
                  </div>
                )}

                {uploadedImage && (
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={handleRotateLogo}
                      className="py-1 px-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-transform transform hover:scale-105 shadow-lg"
                    >
                      Rotate
                    </button>
                    <button
                      onClick={handleDeleteLogo}
                      className="py-1 px-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-400 transition-transform transform hover:scale-105 shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                )}

                <button
                  onClick={handlePurchase}
                  disabled={getTotalQuantity() === 0}
                  className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 ${
                    getTotalQuantity() > 0
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {getTotalQuantity() > 0
                    ? `Purchase ${getTotalQuantity()} Items - $${getTotalPrice()}`
                    : "Select Items to Purchase"}
                </button>
              </div>
              {/* Generate 3D Button - moved to the right with dashed border */}
            </div>
          </div>
        </div>
      </div>

      {/* Category Internal Mesh */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <section className="bg-white rounded-xl shadow p-6 mb-8 border border-blue-100">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-4">
            {categories.length === 0 ? (
              <span className="text-gray-400">No categories found.</span>
            ) : (
              categories.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => navigate(`/category/${cat}`)}
                  className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg font-semibold hover:bg-blue-200 transition"
                >
                  {cat}
                </button>
              ))
            )}
          </div>
        </section>
      </div>
      {/* Brands Internal Mesh */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <section className="bg-white rounded-xl shadow p-6 mb-8 border border-blue-100">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Brands</h2>
          <div className="flex flex-wrap gap-4">
            {displayedBrands.map((brand) => (
              <button
                key={brand._id}
                onClick={() => navigate(`/brand/${brand.name}`)}
                className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg font-semibold hover:bg-blue-200 transition"
              >
                {brand.name}
              </button>
            ))}
          </div>
        </section>
      </div>
      {/* Best Sellers Internal Mesh */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <section className="bg-white rounded-xl shadow p-6 mb-8 border border-blue-100">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Best Sellers</h2>
          <div className="flex flex-wrap gap-4">
            {bestSellers.map((prod) => (
              <button
                key={prod.sku}
                onClick={() => navigate(`/product/${prod.sku}`)}
                className="px-4 py-2 bg-yellow-100 text-yellow-900 rounded-lg font-semibold hover:bg-yellow-200 transition"
              >
                {prod.brandName} {prod.styleName}
              </button>
            ))}
          </div>
        </section>
      </div>
      {/* Shop Related Styles Section */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Shop Related Styles
            </h2>
            <p className="text-gray-600 text-lg">
              Discover similar products you might love
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.slice(0, 4).map((prod: any, index: number) => {
                // Get the main product image
                const productImage =
                  prod.colorFrontImage && prod.colorFrontImage !== ""
                    ? `https://www.ssactivewear.com/${prod.colorFrontImage}`
                    : "/public/img01.avif";

                // Generate mock rating and reviews if not available
                const rating = prod.rating || 4.0 + Math.random() * 1.0;
                const reviewCount =
                  prod.reviewCount || Math.floor(Math.random() * 3000) + 100;

                // Available sizes (mock data)
                const availableSizes = ["S", "M", "L", "XL", "2XL", "3XL"];
                const hasEcoFriendly = Math.random() > 0.7; // 30% chance of eco-friendly
                const isTopSeller = index === 2; // Make third item a top seller

                return (
                  <div
                    key={prod.sku}
                    className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/product/${prod.sku}`)}
                  >
                    {/* Top Badge */}
                    {isTopSeller && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          Top Seller
                        </span>
                      </div>
                    )}

                    {/* Eco-Friendly Badge */}
                    {hasEcoFriendly && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Eco-Friendly
                        </span>
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={productImage}
                        alt={`${prod.brandName} ${prod.styleName}`}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>

                      {/* Quick View Button */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition-colors">
                          Quick View
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {/* Brand & Product Name */}
                      <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                        {prod.brandName}
                      </h3>
                      <h4 className="text-gray-700 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {prod.styleName}
                      </h4>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < Math.round(rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 font-medium">
                          {reviewCount} reviews
                        </span>
                      </div>

                      {/* Available Sizes */}
                      <div className="mb-3">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs font-medium text-gray-700">
                            Sizes:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {availableSizes.map((size) => (
                            <span
                              key={size}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border hover:bg-gray-200 transition-colors"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">No Minimum</p>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-gray-900">
                            $
                            {prod.salePrice
                              ? prod.salePrice.toFixed(2)
                              : "0.00"}
                          </span>
                          <span className="text-xs text-gray-500">
                            each for 50 items
                          </span>
                        </div>

                        {/* Info Icon */}
                        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Empty State
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No related products found
                </h3>
                <p className="text-gray-500">
                  Check back later for similar items.
                </p>
              </div>
            )}
          </div>

          {/* View More Button */}
          {relatedProducts.length > 4 && (
            <div className="text-center mt-10">
              <button
                onClick={() => navigate(`/category/${product.baseCategory}`)}
                className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View All Related Products
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </button>
            </div>
          )}
        </section>
      </div>
      {/* Customer Reviews Section */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <section className="bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl shadow-xl p-10 mb-8 border border-blue-100/50 backdrop-blur-sm">
          {/* Reviews Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
                  Customer Reviews
                </h2>
                <p className="text-gray-600 mt-1">
                  What our customers are saying
                </p>
              </div>
            </div>
            <button className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Write a Review
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            </button>
          </div>

          {/* Overall Rating Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 p-8 bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 rounded-2xl border border-yellow-200/50 shadow-inner">
            {/* Average Rating Display */}
            <div className="flex flex-col items-center text-center lg:border-r lg:border-yellow-200/50 lg:pr-8">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur opacity-20"></div>
                <div className="relative text-6xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {product?.rating ? product.rating.toFixed(1) : "0.0"}
                </div>
              </div>
              <div className="flex items-center mb-3 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="relative">
                    <span
                      className={`text-2xl transition-all duration-300 ${
                        i < Math.round(product?.rating || 0)
                          ? "text-yellow-400 drop-shadow-sm"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 font-medium">
                Based on{" "}
                <span className="font-bold text-blue-600">
                  {reviews.length}
                </span>{" "}
                reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="lg:col-span-2 lg:pl-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Rating Breakdown
              </h3>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter(
                  (r: any) => r.rating === stars
                ).length;
                const percentage =
                  reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                return (
                  <div
                    key={stars}
                    className="flex items-center gap-4 mb-3 group"
                  >
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <span className="text-sm font-semibold text-gray-700">
                        {stars}
                      </span>
                      <span className="text-yellow-500 text-sm">★</span>
                    </div>
                    <div className="flex-1 relative">
                      <div className="bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 min-w-[30px] text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
              Recent Reviews
            </h3>

            {reviews.length > 0 ? (
              reviews.map((review: any, idx: number) => (
                <div
                  key={idx}
                  className="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:border-blue-200/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-6">
                    {/* Enhanced Avatar */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {review.user?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>

                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                        <h4 className="text-xl font-bold text-gray-900">
                          {review.user || "Anonymous User"}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {review.date
                              ? new Date(review.date).toLocaleDateString()
                              : "Recent"}
                          </span>
                        </div>
                      </div>

                      {/* Enhanced Star Rating */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xl transition-all duration-200 ${
                                i < review.rating
                                  ? "text-yellow-400 drop-shadow-sm"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600 bg-yellow-100 px-2 py-1 rounded-full">
                          {review.rating}.0 out of 5
                        </span>
                      </div>

                      {/* Review Title */}
                      {review.title && (
                        <h5 className="text-lg font-semibold text-gray-900 mb-3 leading-relaxed">
                          {review.title}
                        </h5>
                      )}

                      {/* Review Text */}
                      <p className="text-gray-700 leading-relaxed mb-4 text-base">
                        {review.comment}
                      </p>

                      {/* Enhanced Review Actions */}
                      <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group/btn">
                          <div className="p-1 rounded-full group-hover/btn:bg-blue-100 transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V18m-7-8a2 2 0 01-2-2V6a2 2 0 012-2h2.343M11 7L9 5l2-2"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-medium">
                            Helpful ({review.helpful || 0})
                          </span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group/btn">
                          <div className="p-1 rounded-full group-hover/btn:bg-red-100 transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-medium">Report</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-20"></div>
                  <div className="relative w-20 h-20 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No reviews yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Be the first to share your thoughts about this product and
                  help other customers make informed decisions.
                </p>
                <button className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Write the First Review
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </button>
              </div>
            )}
          </div>

          {/* Enhanced Load More Reviews */}
          {reviews.length > 3 && (
            <div className="text-center mt-10 pt-8 border-t border-gray-200">
              <button className="group relative px-10 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-300 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 transition-transform group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Load More Reviews
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          )}
        </section>
      </div>
      {/* Related Categories Internal Mesh */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <section className="bg-white rounded-xl shadow p-6 mb-8 border border-blue-100">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            Related Categories
          </h2>
          <div className="flex flex-wrap gap-4">
            {relatedCategories.map((cat: string) => (
              <button
                key={cat}
                className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg font-semibold hover:bg-blue-200 transition"
                onClick={() => navigate(`/category/${cat}`)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Shop Related Styles Section - Moved to Bottom */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Shop Related Styles
            </h2>
            <p className="text-gray-600 text-lg">
              Discover similar products you might love
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.slice(0, 4).map((prod: any, index: number) => {
                // Get the main product image
                const productImage =
                  prod.colorFrontImage && prod.colorFrontImage !== ""
                    ? `https://www.ssactivewear.com/${prod.colorFrontImage}`
                    : "/public/img01.avif";

                // Generate mock rating and reviews if not available
                const rating = prod.rating || 4.0 + Math.random() * 1.0;
                const reviewCount =
                  prod.reviewCount || Math.floor(Math.random() * 3000) + 100;

                // Available sizes (mock data)
                const availableSizes = ["S", "M", "L", "XL", "2XL", "3XL"];
                const hasEcoFriendly = Math.random() > 0.7; // 30% chance of eco-friendly
                const isTopSeller = index === 2; // Make third item a top seller

                return (
                  <div
                    key={prod.sku}
                    className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/product/${prod.sku}`)}
                  >
                    {/* Top Badge */}
                    {isTopSeller && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          Top Seller
                        </span>
                      </div>
                    )}

                    {/* Eco-Friendly Badge */}
                    {hasEcoFriendly && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Eco-Friendly
                        </span>
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={productImage}
                        alt={`${prod.brandName} ${prod.styleName}`}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>

                      {/* Quick View Button */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                          className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${prod.sku}`);
                          }}
                        >
                          Quick View
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {/* Brand & Product Name */}
                      <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                        {prod.brandName}
                      </h3>
                      <h4 className="text-gray-700 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {prod.styleName}
                      </h4>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < Math.round(rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 font-medium">
                          {reviewCount} reviews
                        </span>
                      </div>

                      {/* Available Sizes */}
                      <div className="mb-3">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs font-medium text-gray-700">
                            Sizes:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {availableSizes.map((size) => (
                            <span
                              key={size}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border hover:bg-gray-200 transition-colors"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">No Minimum</p>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-gray-900">
                            $
                            {prod.salePrice
                              ? prod.salePrice.toFixed(2)
                              : "0.00"}
                          </span>
                          <span className="text-xs text-gray-500">
                            each for 50 items
                          </span>
                        </div>

                        {/* Info Icon */}
                        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Empty State
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No related products found
                </h3>
                <p className="text-gray-500">
                  Check back later for similar items.
                </p>
              </div>
            )}
          </div>

          {/* View More Button */}
          {relatedProducts.length > 4 && (
            <div className="text-center mt-10">
              <button
                onClick={() => navigate(`/category/${product.baseCategory}`)}
                className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View All Related Products
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DynamicProductPage;
