import React, { useState, useRef } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const images = [
  '/src/pages/testimage/front.png',
  '/src/pages/testimage/back.png',
];

const product = {
  brandName: 'Test Brand',
  styleName: 'Test Style',
  colorName: 'Test Color',
  salePrice: 99.99,
  sku: 'TESTSKU123',
  gtin: '1234567890123',
  countryOfOrigin: 'Testland',
  qty: 100,
  caseQty: 10,
  unitWeight: 1.5,
};

const TestProductPage: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [logoData, setLogoData] = useState<Record<number, { image: string | null; x: number; y: number; size: number; rotation: number }>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Drag state for 3D flip
  const dragStartX = useRef<number | null>(null);
  const dragDeltaX = useRef<number>(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // 3D flip drag handlers
  const handle3DDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsFlipping(true);
    if ('touches' in e) {
      dragStartX.current = e.touches[0].clientX;
    } else {
      if (e.button !== 0) return; // Only left mouse button
      dragStartX.current = e.clientX;
    }
    dragDeltaX.current = 0;
  };

  const handle3DDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isFlipping || dragStartX.current === null) return;
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    dragDeltaX.current = clientX - dragStartX.current;
  };

  const handle3DDragEnd = () => {
    if (!isFlipping) return;
    setIsFlipping(false);
    if (dragDeltaX.current > 80 && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (dragDeltaX.current < -80 && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    dragStartX.current = null;
    dragDeltaX.current = 0;
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
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // Logo drag on image (for positioning logo)
  const [isLogoDragging, setIsLogoDragging] = useState(false);
  const logoDragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleLogoDragStart = (e: React.MouseEvent | React.TouchEvent, idx: number) => {
    e.stopPropagation();
    setIsLogoDragging(true);
    let clientX = 0, clientY = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    logoDragOffset.current = {
      x: clientX - (logoData[idx]?.x || 0),
      y: clientY - (logoData[idx]?.y || 0),
    };
  };

  const handleLogoDragMove = (e: React.MouseEvent | React.TouchEvent, idx: number) => {
    if (!isLogoDragging) return;
    let clientX = 0, clientY = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    setLogoData((prev) => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        x: clientX - logoDragOffset.current.x,
        y: clientY - logoDragOffset.current.y,
      },
    }));
  };

  const handleLogoDragEnd = () => {
    setIsLogoDragging(false);
  };

  // Quantity change handler
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) setQuantity(newQuantity);
  };

  // Logo size change handler
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

  // Logo rotate handler
  const handleRotateLogo = () => {
    setLogoData((prev) => ({
      ...prev,
      [currentImageIndex]: {
        ...prev[currentImageIndex],
        rotation: (prev[currentImageIndex]?.rotation || 0) + 15,
      },
    }));
  };

  // Logo delete handler
  const handleDeleteLogo = () => {
    setLogoData((prev) => ({
      ...prev,
      [currentImageIndex]: {
        ...prev[currentImageIndex],
        image: null,
      },
    }));
  };

  // Purchase handler
  const handlePurchase = () => {
    alert(`You have purchased ${quantity} units of Jordan 1 Retro High OG.`);
  };

  return (
    <div className="min-h-screen bg-black from-[#0d0d0d] to-black from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Section */}
          <div className="relative">
            {/* 3D Flip Effect Container */}
            <div
              className="relative w-full flex items-center justify-center"
              style={{ perspective: '1200px', height: 500 }}
              onMouseDown={handle3DDragStart}
              onMouseMove={handle3DDragMove}
              onMouseUp={handle3DDragEnd}
              onMouseLeave={handle3DDragEnd}
              onTouchStart={handle3DDragStart}
              onTouchMove={handle3DDragMove}
              onTouchEnd={handle3DDragEnd}
            >
              <div
                className="relative w-full h-full"
                style={{
                  width: '100%',
                  height: 500,
                  transformStyle: 'preserve-3d',
                  transition: isFlipping ? 'none' : 'transform 1s cubic-bezier(0.16,1,0.3,1)',
                  transform: `rotateY(${-currentImageIndex * 180}deg)`
                }}
              >
                {/* Front Image */}
                <div
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    zIndex: currentImageIndex === 0 ? 2 : 1,
                  }}
                >
                  <img
                    src={images[0]}
                    alt="Front"
                    className="w-auto h-auto max-w-full max-h-[500px] object-contain rounded-lg shadow-lg"
                    style={{ display: 'block', margin: '0 auto' }}
                  />
                  {logoData[0]?.image && (
                    <img
                      src={logoData[0].image}
                      alt="Uploaded Logo"
                      className="absolute"
                      style={{
                        top: logoData[0].y || '50%',
                        left: logoData[0].x || '50%',
                        transform: `translate(-50%, -50%) rotate(${logoData[0].rotation || 0}deg)` ,
                        width: `${logoData[0].size || 50}px`,
                        height: `${logoData[0].size || 50}px`,
                        cursor: isLogoDragging ? 'grabbing' : 'grab',
                        mixBlendMode: 'multiply',
                        opacity: 0.8,
                        pointerEvents: 'auto',
                      }}
                      onMouseDown={(e) => handleLogoDragStart(e, 0)}
                      onMouseMove={(e) => handleLogoDragMove(e, 0)}
                      onMouseUp={handleLogoDragEnd}
                      onMouseLeave={handleLogoDragEnd}
                      onTouchStart={(e) => handleLogoDragStart(e, 0)}
                      onTouchMove={(e) => handleLogoDragMove(e, 0)}
                      onTouchEnd={handleLogoDragEnd}
                    />
                  )}
                </div>
                {/* Back Image */}
                <div
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                  style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    zIndex: currentImageIndex === 1 ? 2 : 1,
                  }}
                >
                  <img
                    src={images[1]}
                    alt="Back"
                    className="w-auto h-auto max-w-full max-h-[500px] object-contain rounded-lg shadow-lg"
                    style={{ display: 'block', margin: '0 auto' }}
                  />
                  {logoData[1]?.image && (
                    <img
                      src={logoData[1].image}
                      alt="Uploaded Logo"
                      className="absolute"
                      style={{
                        top: logoData[1].y || '50%',
                        left: logoData[1].x || '50%',
                        transform: `translate(-50%, -50%) rotate(${logoData[1].rotation || 0}deg)` ,
                        width: `${logoData[1].size || 50}px`,
                        height: `${logoData[1].size || 50}px`,
                        cursor: isLogoDragging ? 'grabbing' : 'grab',
                        mixBlendMode: 'multiply',
                        opacity: 0.8,
                        pointerEvents: 'auto',
                      }}
                      onMouseDown={(e) => handleLogoDragStart(e, 1)}
                      onMouseMove={(e) => handleLogoDragMove(e, 1)}
                      onMouseUp={handleLogoDragEnd}
                      onMouseLeave={handleLogoDragEnd}
                      onTouchStart={(e) => handleLogoDragStart(e, 1)}
                      onTouchMove={(e) => handleLogoDragMove(e, 1)}
                      onTouchEnd={handleLogoDragEnd}
                    />
                  )}
                </div>
              </div>
              {/* 3D Flip Controls (slider-style) */}
              <div className="absolute left-0 right-0 bottom-4 flex justify-center gap-6 z-10">
                <button
                  onClick={() => setCurrentImageIndex(0)}
                  className={`px-6 py-2 rounded-full font-semibold shadow-md transition-all ${currentImageIndex === 0 ? 'bg-green-500 text-black' : 'bg-gray-700 text-white hover:bg-green-400'}`}
                >
                  Front
                </button>
                <button
                  onClick={() => setCurrentImageIndex(1)}
                  className={`px-6 py-2 rounded-full font-semibold shadow-md transition-all ${currentImageIndex === 1 ? 'bg-green-500 text-black' : 'bg-gray-700 text-white hover:bg-green-400'}`}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
          {/* Product Details Section */}
          <div>
            <h1 className="text-5xl font-extrabold mb-4 text-green-400 text-center md:text-left">
              {product.brandName} {product.styleName}
            </h1>
            <p className="text-lg text-gray-400 mb-6 italic text-center md:text-left">{product.colorName}</p>
            <p className="text-3xl font-bold mb-2 text-green-500 text-center md:text-left">${product.salePrice.toFixed(2)}</p>
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
              />
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
      </div>
    </div>
  );
};

export default TestProductPage;