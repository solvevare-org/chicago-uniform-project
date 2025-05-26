import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const DynamicProductPage: React.FC = () => {
  const { sku } = useParams<{ sku: string }>(); // Get the SKU from the route parameters
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Quantity for purchase
  const [logoData, setLogoData] = useState<Record<number, { image: string | null; x: number; y: number; size: number; rotation: number }>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the current image index
  const mainSliderRef = useRef<Slider | null>(null);
  const [logoLocked, setLogoLocked] = useState<Record<number, boolean>>({});

  // Load logoData and logoLocked from localStorage on mount
  useEffect(() => {
    const savedLogoData = localStorage.getItem('dynamicProductLogoData');
    const savedLogoLocked = localStorage.getItem('dynamicProductLogoLocked');
    if (savedLogoData) setLogoData(JSON.parse(savedLogoData));
    if (savedLogoLocked) setLogoLocked(JSON.parse(savedLogoLocked));
  }, []);

  // Save logoData and logoLocked to localStorage when they change
  useEffect(() => {
    localStorage.setItem('dynamicProductLogoData', JSON.stringify(logoData));
    localStorage.setItem('dynamicProductLogoLocked', JSON.stringify(logoLocked));
  }, [logoData, logoLocked]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://31.97.41.27:5000/api/products/sku/${sku}`); // Fetch product by SKU
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        const data = await response.json();
        setProduct(data.product); // Access the "product" field in the JSON
      } catch (error) {
        console.error('Error loading product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [sku]);

  // Expire logo lock after 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const expiresObj = JSON.parse(localStorage.getItem('dynamicProductLogoExpires') || '{}');
      const now = Date.now();
      let changed = false;
      Object.entries(expiresObj).forEach(([idx, exp]) => {
        if (typeof exp === 'number' && now > exp) {
          setLogoLocked((prev) => ({ ...prev, [Number(idx)]: false }));
          delete expiresObj[idx];
          changed = true;
        }
      });
      if (changed) localStorage.setItem('dynamicProductLogoExpires', JSON.stringify(expiresObj));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.caseQty) {
      setQuantity(newQuantity);
    }
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
    if (logoLocked[currentImageIndex]) return; // Prevent upload if locked
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
    setLogoLocked((prev) => ({ ...prev, [currentImageIndex]: false })); // Unlock after delete
  };

  const handleSaveLogo = () => {
    setLogoLocked((prev) => ({ ...prev, [currentImageIndex]: true }));
    // Save timestamp for expiration (5 minutes)
    const expires = Date.now() + 5 * 60 * 1000;
    localStorage.setItem('dynamicProductLogoExpires', JSON.stringify({ ...JSON.parse(localStorage.getItem('dynamicProductLogoExpires') || '{}'), [currentImageIndex]: expires }));
  };

  // Handle slide change for main slider
  const handleSlideChange = (next: number) => {
    setCurrentImageIndex(next);
  };

  // Dragging logic for logo positioning
  const startDragging = () => {
    setIsDragging(true);
  };
  const stopDragging = () => {
    setIsDragging(false);
  };

  // Handle thumbnail click to change main image
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    if (mainSliderRef.current) {
      mainSliderRef.current.slickGoTo(index);
    }
  };

  // Handle purchase button click (placeholder)
  const handlePurchase = () => {
    alert('Purchase functionality coming soon!');
  };

  // Collect all available images (filter out empty strings, duplicates, and ensure only unique, non-empty images)
  let images: string[] = [];
  if (product) {
    images = [
      product.colorFrontImage && product.colorFrontImage !== '' ? `https://www.ssactivewear.com/${product.colorFrontImage}` : undefined,
      product.colorSideImage && product.colorSideImage !== '' ? `https://www.ssactivewear.com/${product.colorSideImage}` : undefined,
      product.colorBackImage && product.colorBackImage !== '' ? `https://www.ssactivewear.com/${product.colorBackImage}` : undefined,
      product.colorOnModelFrontImage && product.colorOnModelFrontImage !== '' ? `https://www.ssactivewear.com/${product.colorOnModelFrontImage}` : undefined,
      product.colorOnModelSideImage && product.colorOnModelSideImage !== '' ? `https://www.ssactivewear.com/${product.colorOnModelSideImage}` : undefined,
      product.colorOnModelBackImage && product.colorOnModelBackImage !== '' ? `https://www.ssactivewear.com/${product.colorOnModelBackImage}` : undefined,
    ].filter((img): img is string => !!img && img !== 'https://www.ssactivewear.com/');
    // Remove duplicates (keep only unique images)
    images = images.filter((img, idx, arr) => arr.indexOf(img) === idx);
    // If only one unique image, keep only one
    if (images.length > 1 && images.every((img) => img === images[0])) {
      images = [images[0]];
    }
  }

  // If there are no images, show a placeholder
  if (images.length === 0) {
    images = ["/public/img01.avif"];
  }
  // If only one image, disable infinite and arrows in slider
  const singleImage = images.length === 1;

  // Calculate subtotal price
  const subtotal = product ? (quantity * product.salePrice).toFixed(2) : '0.00';

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
    <div className="min-h-screen bg-black from-[#0d0d0d] to-black from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Conditional rendering for loading and product-not-found */}
        {loading ? (
          <div>Loading...</div>
        ) : !product ? (
          <div>Product not found</div>
        ) : (
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
                      style={{ display: 'block', margin: '0 auto' }}
                    />

                    {/* Uploaded Logo */}
                    {logoData[index]?.image && (
                      <img
                        src={logoData[index].image}
                        alt="Uploaded Logo"
                        className="absolute"
                        style={{
                          top: logoData[index].y || '50%',
                          left: logoData[index].x || '50%',
                          transform: `translate(-50%, -50%) rotate(${logoData[index].rotation || 0}deg)`,
                          width: `${logoData[index].size || 50}px`,
                          height: `${logoData[index].size || 50}px`,
                          cursor: 'grab',
                          mixBlendMode: 'multiply', // Blend mode for embossed effect
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
                      currentImageIndex === index ? 'border-green-500' : 'border-transparent'
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-auto h-auto max-h-20 object-contain rounded-lg"
                      style={{ margin: '0 auto' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div>
              <h1 className="text-5xl font-extrabold mb-4 text-green-400">
                {product.brandName} {product.styleName}
              </h1>
              <p className="text-lg text-gray-400 mb-6 italic">{product.colorName}</p>
              <p className="text-3xl font-bold mb-2 text-green-500">${product.salePrice.toFixed(2)}</p>
              <p className="text-lg font-medium mb-6 text-gray-300">
                Subtotal: <span className="text-green-400">${subtotal}</span>
              </p>

              <div className="mb-6">
                <p className="text-sm text-gray-400">SKU: {product.sku}</p>
                <p className="text-sm text-gray-400">GTIN: {product.gtin}</p>
                <p className="text-sm text-gray-400">Country of Origin: {product.countryOfOrigin}</p>
                <p className="text-sm text-gray-400">
                  Available Quantity: <span className="font-bold">{product.caseQty}</span>
                </p>
                <p className="text-sm text-gray-400">Case Quantity (Max): {product.caseQty}</p>
                <p className="text-sm text-gray-400">Unit Weight: {product.unitWeight} lbs</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    className="w-16 text-center px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="1"
                    max={product.caseQty}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105"
                    disabled={quantity >= product.caseQty}
                  >
                    +
                  </button>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(quantity / product.caseQty) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Selected: <span className="font-bold">{quantity}</span> / {product.caseQty}
                  </p>
                </div>
                {quantity > product.caseQty && (
                  <p className="text-sm text-red-500 mt-2">Quantity exceeds the maximum case quantity!</p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Upload Your Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-400"
                  disabled={logoLocked[currentImageIndex]}
                />
                {logoData[currentImageIndex]?.image && !logoLocked[currentImageIndex] && (
                  <button
                    onClick={handleSaveLogo}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-500 transition"
                  >
                    Save Logo Position
                  </button>
                )}
                {logoLocked[currentImageIndex] && (
                  <div className="mt-2 text-green-400 text-sm">Logo position locked for this image.</div>
                )}
              </div>

              {/* Logo Size Slider (show only if logo is present for the current image) */}
              {logoData[currentImageIndex]?.image && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Logo Size</label>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    value={logoData[currentImageIndex]?.size || 50}
                    onChange={handleLogoSizeChange}
                    className="w-full appearance-none bg-gray-700 rounded-full h-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
              {/* Logo controls (show only if logo is present for the current image) */}
              {logoData[currentImageIndex]?.image && (
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
                className="w-full py-3 bg-green-500 text-black rounded-lg font-medium hover:bg-green-400 transition-transform transform hover:scale-105 shadow-lg"
              >
                Purchase
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicProductPage;