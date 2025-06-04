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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // --- FIX: Add selectedLockedArea state and update logic ---
  const [selectedLockedArea, setSelectedLockedArea] = useState<Record<number, number>>({});
  // --- FIX: Add missing handlers and state for quantity, subtotal, flipping, and images ---
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    if (product && product.price) {
      setSubtotal(product.price * quantity);
    }
  }, [product, quantity]);

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
  };

  const handleFlip = () => {
    setFlipped((prev) => !prev);
    setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0));
  };

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

  // --- FIX: Robust fallback image logic ---
  const images: string[] = React.useMemo(() => {
    if (!product) return [];
    let imgs = [
      product.colorFrontImage && product.colorFrontImage !== '' ? product.colorFrontImage : undefined,
      product.colorBackImage && product.colorBackImage !== '' ? product.colorBackImage : undefined,
    ].filter((img): img is string => !!img);
    imgs = imgs.filter((img, idx, arr) => arr.indexOf(img) === idx);
    if (imgs.length > 1 && imgs.every((img) => img === imgs[0])) {
      imgs = [imgs[0]];
    }
    if (imgs.length === 0) {
      if (product.image && product.image !== '') {
        imgs = [product.image];
      } else {
        imgs = ["/public/img01.avif"];
      }
    }
    return imgs;
  }, [product]);

  // --- Ensure selectedLockedArea resets on product or side change ---
  // This must be the last hook before any conditional return!
  useEffect(() => {
    if (!loading && product && product.baseCategoryID !== undefined) {
      setSelectedLockedArea({ 0: 0, 1: 0 });
    }
  }, [loading, product?.baseCategoryID, flipped]);

  if (loading) return <TypewriterLoading />;
  if (!product || !product.sku) {
    console.log('DEBUG: Product fetch result:', product);
    return <div className="flex flex-col items-center justify-center min-h-screen text-2xl text-red-400">Product not found</div>;
  }

  // --- Locked Logo Area Mapping ---
  // Only these baseCategoryIDs will have locked logo areas and snapping logic
  const LOCKED_BASE_CATEGORY_IDS = [
    '1', '2', '4', '5', '6', '7', '9', '10', '11', '12', '16', '26', '27'
  ];
  const lockedLogoAreaMap: Record<string, [Array<any>, Array<any>]> = {
    '1': [
      [
        { x: 220, y: 90,  w: 55,  h: 45,  label: 'Pocket (Right)' },
        { x: 105, y: 200, w: 140, h: 110, label: 'Front Center' },
      ],
      [
        { x: 105, y: 60, w: 140, h: 60, label: 'Back Top' },
        { x: 105, y: 200, w: 140, h: 110, label: 'Back Center' },
      ],
    ],
    '16': [
      [
        { x: 220, y: 90,  w: 55,  h: 45,  label: 'Pocket (Right)' },
        { x: 105, y: 200, w: 140, h: 110, label: 'Front Center' },
      ],
      [
        { x: 105, y: 60, w: 140, h: 60, label: 'Back Top' },
        { x: 105, y: 200, w: 140, h: 110, label: 'Back Center' },
      ],
    ],
    '2': [
      [
        { x: 60,  y: 260, w: 70, h: 90, label: 'Left Leg' },
        { x: 220, y: 260, w: 70, h: 90, label: 'Right Leg' },
        { x: 135, y: 180, w: 80, h: 60, label: 'Front Center' },
      ],
      [
        { x: 60,  y: 260, w: 70, h: 90, label: 'Back Left Leg' },
        { x: 220, y: 260, w: 70, h: 90, label: 'Back Right Leg' },
        { x: 135, y: 180, w: 80, h: 60, label: 'Back Center' },
      ],
    ],
    '4': [
      [
        { x: 120, y: 120, w: 110, h: 70, label: 'Front Center' },
      ],
      [
        { x: 140, y: 220, w: 70, h: 40, label: 'Back Center' },
      ],
    ],
    '5': [
      [
        { x: 90, y: 90, w: 90, h: 70, label: 'Chest' },
        { x: 60, y: 320, w: 60, h: 60, label: 'Left Shorts' },
        { x: 150, y: 320, w: 60, h: 60, label: 'Right Shorts' },
      ],
      [
        { x: 90, y: 90, w: 90, h: 70, label: 'Back Upper' },
        { x: 60, y: 320, w: 60, h: 60, label: 'Back Left Shorts' },
        { x: 150, y: 320, w: 60, h: 60, label: 'Back Right Shorts' },
      ],
    ],
    '6': [
      [
        { x: 60, y: 220, w: 70, h: 80, label: 'Left Thigh' },
        { x: 170, y: 220, w: 70, h: 80, label: 'Right Thigh' },
        { x: 120, y: 140, w: 80, h: 60, label: 'Front Center' },
      ],
      [],
    ],
    '7': [
      [
        { x: 110, y: 70, w: 60, h: 60, label: 'Left Chest' },
        { x: 170, y: 70, w: 60, h: 60, label: 'Center Chest' },
        { x: 220, y: 370, w: 60, h: 40, label: 'Bottom Right' },
      ],
      [
        { x: 120, y: 60, w: 80, h: 50, label: 'Upper Back' },
        { x: 170, y: 200, w: 60, h: 60, label: 'Center Back' },
      ],
    ],
    '9': [
      [
        { x: 80, y: 80, w: 60, h: 60, label: 'Left Chest' },
        { x: 210, y: 80, w: 60, h: 60, label: 'Right Chest' },
        { x: 145, y: 140, w: 70, h: 60, label: 'Center Chest' },
      ],
      [
        { x: 120, y: 60, w: 80, h: 50, label: 'Upper Back' },
        { x: 145, y: 180, w: 70, h: 60, label: 'Center Back' },
      ],
    ],
    '10': [
      [
        { x: 90, y: 200, w: 170, h: 60, label: 'Front Center' },
      ],
      [
        { x: 90, y: 200, w: 170, h: 60, label: 'Back Center' },
      ],
    ],
    '11': [
      [
        { x: 110, y: 240, w: 60, h: 60, label: 'Left Sock' },
        { x: 210, y: 240, w: 60, h: 60, label: 'Right Sock' },
      ],
      [
        { x: 110, y: 240, w: 60, h: 60, label: 'Left Sock Back' },
        { x: 210, y: 240, w: 60, h: 60, label: 'Right Sock Back' },
      ],
    ],
    '12': [
      [
        { x: 130, y: 90, w: 110, h: 80, label: 'Front Center' },
      ],
      [
        { x: 130, y: 90, w: 110, h: 80, label: 'Back Center' },
      ],
    ],
    '26': [
      [
        // Example: center chest for front
        { x: 120, y: 100, w: 100, h: 80, label: 'Front Center' },
      ],
      [
        // Example: upper back for back
        { x: 120, y: 60, w: 100, h: 60, label: 'Back Upper' },
      ],
    ],
    '27': [
      [
        // Left chest (front)
        { x: 70, y: 90, w: 60, h: 60, label: 'Left Chest' },
        // Center chest (front)
        { x: 160, y: 90, w: 60, h: 60, label: 'Center Chest' },
      ],
      [
        // Upper back (back)
        { x: 120, y: 60, w: 100, h: 60, label: 'Back Upper' },
      ],
    ],
  };

  // Always treat baseCategoryID as string for lookup
  const baseCategoryKey = String(product.baseCategoryID);
  // Only activate locked logic for the specified IDs
  const isLockedLogo = LOCKED_BASE_CATEGORY_IDS.includes(baseCategoryKey);
  // Always use the map for the string key, not a fallback
  const lockedLogoAreas = lockedLogoAreaMap[baseCategoryKey] ?? [[], []];

  // --- 3D Flip Card ---
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (!flipped) {
          let areaIdx = selectedLockedArea[0];
          if (areaIdx === undefined) areaIdx = 0;
          const area = lockedLogoAreas[0][areaIdx];
          setSelectedLockedArea(prev => ({ ...prev, 0: areaIdx }));
          // Auto-size logo to fit inside the box (with margin)
          const margin = 8;
          const logoSize = Math.max(20, Math.min(area.w, area.h) - margin);
          setLogoData((prev) => ({
            ...prev,
            0: {
              ...prev[0],
              image: reader.result as string,
              x: area.x + area.w / 2,
              y: area.y + area.h / 2,
              size: logoSize,
              rotation: prev[0]?.rotation || 0,
              _noTransition: false,
            },
          }));
        } else {
          // BACK: Place in center, auto-size to back box
          const area = lockedLogoAreas[1][0];
          const margin = 8;
          const logoSize = Math.max(20, Math.min(area.w, area.h) - margin);
          setLogoData((prev) => ({
            ...prev,
            1: {
              ...prev[1],
              image: reader.result as string,
              x: area.x + area.w / 2,
              y: area.y + area.h / 2,
              size: logoSize,
              rotation: prev[1]?.rotation || 0,
              _noTransition: false,
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
      let x = event.clientX - rect.left - (logoData[draggedSide].size || 50) / 2;
      let y = event.clientY - rect.top - (logoData[draggedSide].size || 50) / 2;
      // FRONT: Always restrict to currently selected box, but allow full movement inside the box
      if (isLockedLogo && draggedSide === 0 && lockedLogoAreas[0].length > 0) {
        const areaIdx = selectedLockedArea[0] ?? 0;
        const area = lockedLogoAreas[0][areaIdx];
        // Clamp logo so its center stays inside the box
        x = Math.max(area.x, Math.min(x, area.x + area.w));
        y = Math.max(area.y, Math.min(y, area.y + area.h));
        setLogoData((prev) => ({
          ...prev,
          0: {
            ...prev[0],
            x,
            y,
            _noTransition: true,
          },
        }));
        return;
      }
      // BACK: No snap/restrict for other categories
      setLogoData((prev) => ({
        ...prev,
        [draggedSide]: {
          ...prev[draggedSide],
          x,
          y,
          _noTransition: true,
        },
      }));
    }
  };

  const stopDragging = () => {
    // FRONT: Snap to nearest box center if close
    if (isLockedLogo && draggedSide === 0 && lockedLogoAreas[0].length > 0) {
      const logo = logoData[0];
      let snapIdx = selectedLockedArea[0] ?? 0;
      let minDist = Infinity;
      let snapX = logo.x, snapY = logo.y;
      lockedLogoAreas[0].forEach((area, idx) => {
        const centerX = area.x + area.w / 2;
        const centerY = area.y + area.h / 2;
        const dist = Math.sqrt(Math.pow((logo.x || 0) - centerX, 2) + Math.pow((logo.y || 0) - centerY, 2));
        if (dist < SNAP_THRESHOLD && dist < minDist) {
          minDist = dist;
          snapIdx = idx;
          snapX = centerX;
          snapY = centerY;
        }
      });
      if (minDist < SNAP_THRESHOLD) {
        setSelectedLockedArea(prev => ({ ...prev, 0: snapIdx }));
        setLogoData((prev) => ({
          ...prev,
          0: {
            ...prev[0],
            x: snapX,
            y: snapY,
            _noTransition: false,
          },
        }));
      } else {
        setLogoData((prev) => ({
          ...prev,
          0: {
            ...prev[0],
            _noTransition: false,
          },
        }));
      }
    }
    // BACK: No snap
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

  // --- Ensure selectedLockedArea resets on product or side change ---
  // This must be the last hook before any conditional return!
  useEffect(() => {
    if (!loading && product && product.baseCategoryID !== undefined) {
      setSelectedLockedArea({ 0: 0, 1: 0 });
    }
  }, [loading, product?.baseCategoryID, flipped]);

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
                  {/* Locked logo areas (front) - always show for locked categories */}
                  {isLockedLogo && lockedLogoAreas[0] && lockedLogoAreas[0].length > 0 && lockedLogoAreas[0].map((area, idx) => {
                    const isSelected = selectedLockedArea[0] === idx;
                    return (
                      <div
                        key={idx}
                        className={`absolute border-2 rounded-lg pointer-events-auto ${isSelected ? 'border-green-400' : 'border-red-500'} cursor-pointer`}
                        style={{
                          left: `${area.x}px`,
                          top: `${area.y}px`,
                          width: `${area.w}px`,
                          height: `${area.h}px`,
                          zIndex: 10,
                          boxShadow: isSelected ? '0 0 0 3px rgba(34,197,94,0.5)' : '0 0 0 2px rgba(255,0,0,0.3)',
                          background: 'rgba(0,0,0,0.05)',
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedLockedArea(prev => ({ ...prev, 0: idx }));
                          if (logoData[0]?.image) {
                            const area = lockedLogoAreas[0][idx];
                            const margin = 8;
                            const logoSize = Math.max(20, Math.min(area.w, area.h) - margin);
                            setLogoData(prev => ({
                              ...prev,
                              0: {
                                ...prev[0],
                                x: area.x + area.w / 2,
                                y: area.y + area.h / 2,
                                size: logoSize,
                                _noTransition: false,
                              },
                            }));
                          }
                        }}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-black/70 px-2 py-0.5 rounded shadow" style={{ color: isSelected ? '#22c55e' : '#f87171', zIndex: 11 }}>{area.label}</span>
                      </div>
                    );
                  })}
                  {/* Logo overlay on front - moveable and snappable */}
                  {logoData[0]?.image && (
                    <img
                      src={logoData[0].image}
                      alt="Logo"
                      className="absolute z-20 shadow-xl border-2 border-green-400 rounded-lg cursor-move"
                      style={{
                        top: logoData[0].y ? `${logoData[0].y}px` : '50%',
                        left: logoData[0].x ? `${logoData[0].x}px` : '50%',
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
                  {/* Locked logo areas (back) - always show for locked categories */}
                  {isLockedLogo && lockedLogoAreas[1] && lockedLogoAreas[1].length > 0 && lockedLogoAreas[1].map((area, idx) => {
                    const isSelected = selectedLockedArea[1] === idx;
                    return (
                      <div
                        key={idx}
                        className={`absolute border-2 rounded-lg pointer-events-auto ${isSelected ? 'border-green-400' : 'border-red-500'} cursor-pointer`}
                        style={{
                          left: `${area.x}px`,
                          top: `${area.y}px`,
                          width: `${area.w}px`,
                          height: `${area.h}px`,
                          zIndex: 10,
                          boxShadow: isSelected ? '0 0 0 3px rgba(34,197,94,0.5)' : '0 0 0 2px rgba(255,0,0,0.3)',
                          background: 'rgba(0,0,0,0.05)',
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedLockedArea(prev => ({ ...prev, 1: idx }));
                          if (logoData[1]?.image) {
                            const margin = 8;
                            const logoSize = Math.max(20, Math.min(area.w, area.h) - margin);
                            setLogoData(prev => ({
                              ...prev,
                              1: {
                                ...prev[1],
                                x: area.x + area.w / 2,
                                y: area.y + area.h / 2,
                                size: logoSize,
                                _noTransition: false,
                              },
                            }));
                          }
                        }}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-black/70 px-2 py-0.5 rounded shadow" style={{ color: isSelected ? '#22c55e' : '#f87171', zIndex: 11 }}>{area.label}</span>
                      </div>
                    );
                  })}
                  {/* Logo overlay on back - moveable and snappable */}
                  {logoData[1]?.image && (
                    <img
                      src={logoData[1].image}
                      alt="Logo"
                      className="absolute z-20 shadow-xl border-2 border-green-400 rounded-lg cursor-move"
                      style={{
                        top: logoData[1].y ? `${logoData[1].y}px` : '50%',
                        left: logoData[1].x ? `${logoData[1].x}px` : '50%',
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
                  onClick={() => setCurrentImageIndex(index)}
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