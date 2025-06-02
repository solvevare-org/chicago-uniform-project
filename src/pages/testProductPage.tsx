import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Typewriter-style loading component with enhanced animation and style
const TypewriterLoading: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = 'Loading...';
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950">
      <div className="relative">
        <span className="text-5xl md:text-7xl font-mono font-extrabold text-green-400 drop-shadow-lg animate-pulse">
          {text}
        </span>
        <span className="absolute -right-8 top-0 text-5xl md:text-7xl text-green-300 animate-blink">|</span>
      </div>
      <div className="mt-8 flex gap-2">
        <span className="w-4 h-4 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="w-4 h-4 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-4 h-4 rounded-full bg-green-600 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
      </div>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s step-end infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
        .animate-bounce { animation: bounce 1.2s infinite; }
      `}</style>
    </div>
  );
};

const ThreeDProducts: React.FC = () => {
  const { sku } = useParams<{ sku: string }>(); // Get the SKU from the route parameters
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Quantity for purchase
  const [logoData, setLogoData] = useState<Record<number, LogoData>>({
    0: { image: null, x: 0, y: 0, size: 50, rotation: 0, _noTransition: false },
    1: { image: null, x: 0, y: 0, size: 50, rotation: 0, _noTransition: false },
  });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSide, setDraggedSide] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{x: number, y: number} | null>(null);
  const [flipped, setFlipped] = useState(false);

  // Restore selectedLockedArea state variable for locked logo area logic
  const selectedLockedArea: Record<number, number> = {};

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://31.97.41.27:5000/api/process-product/${sku}`, {
          method: 'POST'
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('DEBUG: API response:', data);
        // Try to set product directly if data.product is undefined
        setProduct(data.product !== undefined ? data.product : data);
      } catch (error) {
        console.error('Error loading product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [sku]);

  if (loading) return <TypewriterLoading />;
  if (!product || !product.sku) {
    console.log('DEBUG: Product fetch result:', product);
    return <div className="flex flex-col items-center justify-center min-h-screen text-2xl text-red-400">Product not found</div>;
  }

  // Collect only front and back images for 3D effect, using direct API links
  let images = [
    product.colorFrontImage && product.colorFrontImage !== '' ? product.colorFrontImage : undefined,
    product.colorBackImage && product.colorBackImage !== '' ? product.colorBackImage : undefined,
  ].filter((img): img is string => !!img);
  // Remove duplicates (keep only unique images)
  images = images.filter((img, idx, arr) => arr.indexOf(img) === idx);
  // If only one unique image, keep only one
  if (images.length > 1 && images.every((img) => img === images[0])) {
    images = [images[0]];
  }
  // If there are no images, show a placeholder
  if (images.length === 0) {
    images = ["/public/img01.avif"];
  }
  // If only one image, disable infinite and arrows in slider
  const handleFlip = () => setFlipped(f => !f);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.caseQty) {
      setQuantity(newQuantity);
    }
  };

  // Define locked logo positions for baseCategoryID 16 (different for front/back)
  const lockedLogoAreas = product.baseCategoryID === '16'
    ? [
        // Front image boxes
        [
          { x: 80, y: 20, w: 40, h: 40, label: 'Shoulder' },
          { x: 20, y: 70, w: 40, h: 40, label: 'Pocket' },
          { x: 50, y: 45, w: 50, h: 50, label: 'Chest' },
        ],
        // Back image boxes (example: different positions/sizes)
        [
          { x: 75, y: 25, w: 35, h: 35, label: 'Shoulder' },
          { x: 25, y: 75, w: 45, h: 45, label: 'Pocket' },
          { x: 50, y: 60, w: 60, h: 40, label: 'Back Center' },
        ],
      ]
    : [];

  // --- 3D Flip Card ---
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (selectedLockedArea[flipped ? 1 : 0] !== undefined) {
          const areaIdx = selectedLockedArea[flipped ? 1 : 0];
          setLogoData((prev) => ({
            ...prev,
            [flipped ? 1 : 0]: {
              ...prev[flipped ? 1 : 0],
              image: reader.result as string,
              x: lockedLogoAreas[flipped ? 1 : 0][areaIdx].x + lockedLogoAreas[flipped ? 1 : 0][areaIdx].w / 2,
              y: lockedLogoAreas[flipped ? 1 : 0][areaIdx].y + lockedLogoAreas[flipped ? 1 : 0][areaIdx].h / 2,
              size: prev[flipped ? 1 : 0]?.size || 50,
              rotation: prev[flipped ? 1 : 0]?.rotation || 0,
            },
          }));
        } else {
          setLogoData((prev) => ({
            ...prev,
            [flipped ? 1 : 0]: {
              ...prev[flipped ? 1 : 0],
              image: reader.result as string,
              x: prev[flipped ? 1 : 0]?.x || 50,
              y: prev[flipped ? 1 : 0]?.y || 50,
              size: prev[flipped ? 1 : 0]?.size || 50,
              rotation: prev[flipped ? 1 : 0]?.rotation || 0,
            },
          }));
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleLogoSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const size = Number(event.target.value);
    setLogoData((prev) => ({
      ...prev,
      [flipped ? 1 : 0]: {
        ...prev[flipped ? 1 : 0],
        size,
      },
    }));
  };

  const handleRotateLogo = () => {
    setLogoData((prev) => ({
      ...prev,
      [flipped ? 1 : 0]: {
        ...prev[flipped ? 1 : 0],
        rotation: (prev[flipped ? 1 : 0]?.rotation || 0) + 15,
      },
    }));
  };

  const handleDeleteLogo = () => {
    setLogoData((prev) => ({
      ...prev,
      [flipped ? 1 : 0]: {
        ...prev[flipped ? 1 : 0],
        image: null,
      },
    }));
  };
 const handlePurchase = () => {
    alert(`You have purchased ${quantity} units of ${product.styleName}.`);
  };
  const startDragging = (e: React.MouseEvent, sideIdx: number) => {
    if (!logoData[sideIdx]?.image) return;
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left - (logoData[sideIdx].size || 50) / 2;
    const offsetY = e.clientY - rect.top - (logoData[sideIdx].size || 50) / 2;
    setIsDragging(true);
    setDraggedSide(sideIdx);
    setDragOffset({x: offsetX, y: offsetY});
  };

  const SNAP_THRESHOLD = 30; // px, distance from center to trigger snap

  const handleLogoDragMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && draggedSide !== null && logoData[draggedSide]?.image) {
      const rect = event.currentTarget.getBoundingClientRect();
      let x = event.clientX - rect.left - (dragOffset?.x || 0);
      let y = event.clientY - rect.top - (dragOffset?.y || 0);
      // If locked, restrict to selected box
      if (selectedLockedArea[draggedSide] !== undefined) {
        const area = lockedLogoAreas[draggedSide][selectedLockedArea[draggedSide]];
        x = Math.max(area.x, Math.min(x, area.x + area.w));
        y = Math.max(area.y, Math.min(y, area.y + area.h));
      }
      setLogoData((prev) => ({
        ...prev,
        [draggedSide]: {
          ...prev[draggedSide],
          x,
          y,
          // Add a flag to disable transition while dragging
          _noTransition: true,
        },
      }));
    }
  };

  const stopDragging = () => {
    if (draggedSide !== null && selectedLockedArea[draggedSide] !== undefined) {
      const area = lockedLogoAreas[draggedSide][selectedLockedArea[draggedSide]];
      const centerX = area.x + area.w / 2;
      const centerY = area.y + area.h / 2;
      const logo = logoData[draggedSide];
      if (logo) {
        const dist = Math.sqrt(
          Math.pow((logo.x || 0) - centerX, 2) + Math.pow((logo.y || 0) - centerY, 2)
        );
        if (dist < SNAP_THRESHOLD) {
          // Snap to center with transition
          setLogoData((prev) => ({
            ...prev,
            [draggedSide]: {
              ...prev[draggedSide],
              x: centerX,
              y: centerY,
              _noTransition: false,
            },
          }));
        } else {
          // Remove transition flag
          setLogoData((prev) => ({
            ...prev,
            [draggedSide]: {
              ...prev[draggedSide],
              _noTransition: false,
            },
          }));
        }
      }
    }
    setIsDragging(false);
    setDraggedSide(null);
    setDragOffset(null);
  };

  // Extend logoData type
  type LogoData = {
    image: string | null;
    x: number;
    y: number;
    size: number;
    rotation: number;
    _noTransition?: boolean;
  };

  return (
    <div className="min-h-screen bg-black from-[#0d0d0d] to-black from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Section */}
          <div className="relative flex flex-col items-center">
            {/* 3D Flip Card */}
            <div
              className="group w-[350px] h-[450px] mb-6 cursor-pointer flex items-center justify-center"
              onClick={handleFlip}
              style={{ perspective: '1200px' }}
            >
              <div
                className={`relative w-full h-full transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  borderRadius: '1.5rem',
                  background: 'none',
                }}
              >
                {/* Front */}
                <div
                  className="absolute w-full h-full flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    borderRadius: '1.5rem',
                    background: 'none',
                    boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
                    zIndex: !flipped ? 2 : 1,
                    transform: 'rotateY(0deg)',
                    transition: 'background 0.3s',
                  }}
                  onMouseMove={handleLogoDragMove}
                  onMouseUp={stopDragging}
                  onMouseLeave={stopDragging}
                >
                  <img
                    src={images[0]}
                    alt="Front"
                    className="object-contain w-full h-full select-none"
                    draggable={false}
                    style={{ background: 'none', zIndex: 1 }}
                  />
                  {/* Locked logo areas (front) */}
                  {lockedLogoAreas[0].map((area, idx) => (
                    <div
                      key={idx}
                      className={`absolute border-2 rounded-lg pointer-events-none ${selectedLockedArea[0] === idx ? 'border-green-400' : 'border-red-500'}`}
                      style={{
                        left: `${area.x}%`,
                        top: `${area.y}%`,
                        width: `${area.w}px`,
                        height: `${area.h}px`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        boxShadow: selectedLockedArea[0] === idx ? '0 0 0 3px rgba(34,197,94,0.5)' : '0 0 0 2px rgba(255,0,0,0.3)',
                        pointerEvents: 'none',
                        background: 'rgba(0,0,0,0.05)',
                      }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-black/70 px-2 py-0.5 rounded shadow" style={{ color: selectedLockedArea[0] === idx ? '#22c55e' : '#f87171', zIndex: 11 }}>{area.label}</span>
                    </div>
                  ))}
                  {/* Logo overlay on front - moveable and snappable */}
                  {logoData[0]?.image && (
                    <img
                      src={logoData[0].image}
                      alt="Logo"
                      className="absolute z-20 shadow-xl border-2 border-green-400 rounded-lg cursor-move"
                      style={{
                        top: logoData[0].y || '50%',
                        left: logoData[0].x || '50%',
                        width: `${logoData[0].size || 50}px`,
                        height: `${logoData[0].size || 50}px`,
                        transform: `translate(-50%, -50%) rotate(${logoData[0].rotation || 0}deg)` ,
                        opacity: 1,
                        mixBlendMode: 'normal',
                        zIndex: 20,
                        background: 'white',
                        transition: logoData[0]._noTransition ? 'none' : 'top 0.3s, left 0.3s',
                      }}
                      onMouseDown={e => startDragging(e, 0)}
                    />
                  )}
                </div>
                {/* Back */}
                <div
                  className="absolute w-full h-full flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    borderRadius: '1.5rem',
                    background: 'none',
                    boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
                    zIndex: flipped ? 2 : 1,
                    transform: 'rotateY(180deg)',
                    transition: 'background 0.3s',
                  }}
                  onMouseMove={handleLogoDragMove}
                  onMouseUp={stopDragging}
                  onMouseLeave={stopDragging}
                >
                  <img
                    src={images[1] || images[0]}
                    alt="Back"
                    className="object-contain w-full h-full select-none"
                    draggable={false}
                    style={{ background: 'none', zIndex: 1 }}
                  />
                  {/* Locked logo areas (back) */}
                  {lockedLogoAreas[1].map((area, idx) => (
                    <div
                      key={idx}
                      className={`absolute border-2 rounded-lg pointer-events-none ${selectedLockedArea[1] === idx ? 'border-green-400' : 'border-red-500'}`}
                      style={{
                        left: `${area.x}%`,
                        top: `${area.y}%`,
                        width: `${area.w}px`,
                        height: `${area.h}px`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        boxShadow: selectedLockedArea[1] === idx ? '0 0 0 3px rgba(34,197,94,0.5)' : '0 0 0 2px rgba(255,0,0,0.3)',
                        pointerEvents: 'none',
                        background: 'rgba(0,0,0,0.05)',
                      }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-black/70 px-2 py-0.5 rounded shadow" style={{ color: selectedLockedArea[1] === idx ? '#22c55e' : '#f87171', zIndex: 11 }}>{area.label}</span>
                    </div>
                  ))}
                  {/* Logo overlay on back - moveable and snappable */}
                  {logoData[1]?.image && (
                    <img
                      src={logoData[1].image}
                      alt="Logo"
                      className="absolute z-20 shadow-xl border-2 border-green-400 rounded-lg cursor-move"
                      style={{
                        top: logoData[1].y || '50%',
                        left: logoData[1].x || '50%',
                        width: `${logoData[1].size || 50}px`,
                        height: `${logoData[1].size || 50}px`,
                        transform: `translate(-50%, -50%) rotate(${logoData[1].rotation || 0}deg)` ,
                        opacity: 1,
                        mixBlendMode: 'normal',
                        zIndex: 20,
                        background: 'white',
                        transition: logoData[1]._noTransition ? 'none' : 'top 0.3s, left 0.3s',
                      }}
                      onMouseDown={e => startDragging(e, 1)}
                    />
                  )}
                </div>
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                <span className={`w-3 h-3 rounded-full ${!flipped ? 'bg-green-400' : 'bg-gray-500'} transition-all`}></span>
                <span className={`w-3 h-3 rounded-full ${flipped ? 'bg-green-400' : 'bg-gray-500'} transition-all`}></span>
              </div>
              <div className="absolute top-2 right-2 z-30 text-xs text-gray-300 bg-black/60 px-2 py-1 rounded shadow">Click to flip</div>
            </div>

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
              />
            </div>

            {/* Logo Size Slider (show only if logo is present for the current image) */}
            {logoData[flipped ? 1 : 0]?.image && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Logo Size</label>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={logoData[flipped ? 1 : 0]?.size || 50}
                  onChange={handleLogoSizeChange}
                  className="w-full appearance-none bg-gray-700 rounded-full h-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
            {/* Logo controls (show only if logo is present for the current image) */}
            {logoData[flipped ? 1 : 0]?.image && (
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

export default ThreeDProducts;