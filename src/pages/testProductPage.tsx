import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import html2canvas from "html2canvas";

// 1. Update Tailwind theme colors in tailwind.config.js
// 2. Update main background and text color in index.css
// 3. Update all green/black/gray classes in testProductPage.tsx to use new theme

// 1. Add custom colors to Tailwind config
// tailwind.config.js
// theme: {
//   extend: {
//     colors: {
//       primary: '#b3ddf3',
//       secondary: '#fff',
//       accent: '#222',
//     },
//   },
// },

// 2. Update index.css for white background and accent text
// :root {
//   color-scheme: light;
// }
// body {
//   background-color: #fff;
//   color: #222;
// }

// 3. Update all green/black/gray classes in testProductPage.tsx
// Replace:
//   bg-black, bg-gray-900, bg-gray-800, bg-green-400, bg-green-500, bg-green-600, text-green-400, text-green-500, text-black
// With:
//   bg-primary, bg-secondary, bg-accent, text-primary, text-accent, text-secondary
// (or use direct hex if needed)

// Example for a section:
// <div className="min-h-screen bg-white text-accent">
// ...existing code...
// <span className="text-5xl font-mono font-extrabold text-[#b3ddf3] drop-shadow-lg animate-pulse">
// ...existing code...
// <button className="bg-[#b3ddf3] text-accent ...">
// ...existing code...
//
// Repeat for all green/black/gray color classes in this file.

// Typewriter-style loading component with enhanced animation and style
const TypewriterLoading: React.FC = () => {
  const [text, setText] = useState("");
  const fullText = "Loading...";
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-[#f3f8fa] to-primary">
      <div className="relative">
        <span className="text-5xl md:text-7xl font-mono font-extrabold text-primary drop-shadow-lg animate-pulse">
          {text}
        </span>
        <span className="absolute -right-8 top-0 text-5xl md:text-7xl text-primary animate-blink">
          |
        </span>
      </div>
      <div className="mt-8 flex gap-2">
        <span
          className="w-4 h-4 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: "0s" }}
        ></span>
        <span
          className="w-4 h-4 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></span>
        <span
          className="w-4 h-4 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></span>
      </div>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s step-end infinite; }a
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
        .animate-bounce { animation: bounce 1.2s infinite; }
      `}</style>
    </div>
  );
};

const PurchasePreview = React.memo(
  ({
    images,
    logoData,
  }: {
    images: string[];
    logoData: Record<number, any>;
  }) => (
    <div className="flex gap-4 mb-4">
      {/* Front Preview (same as main preview, but smaller) */}
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-400 mb-1">Front Preview</span>
        <div className="w-[120px] h-[150px] bg-[#f3f8fa] rounded-lg relative flex items-center justify-center">
          <img
            src={images[0]}
            alt="Front Preview"
            className="absolute w-full h-full object-contain rounded-lg"
          />
          {logoData[0]?.image && (
            <img
              src={logoData[0].image}
              alt="Logo Front Preview"
              className="absolute z-20"
              style={{
                top: logoData[0].y ? `${(logoData[0].y * 120) / 350}px` : "50%",
                left: logoData[0].x
                  ? `${(logoData[0].x * 150) / 450}px`
                  : "50%",
                width: `${((logoData[0].size || 50) * 120) / 350}px`,
                height: `${((logoData[0].size || 50) * 150) / 450}px`,
                transform: `translate(-50%, -50%) rotate(${
                  logoData[0].rotation || 0
                }deg)`,
                opacity: 1,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      </div>
      {/* Back Preview (same as main preview, but smaller) */}
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-400 mb-1">Back Preview</span>
        <div className="w-[120px] h-[150px] bg-[#f3f8fa] rounded-lg relative flex items-center justify-center">
          <img
            src={images[1] || images[0]}
            alt="Back Preview"
            className="absolute w-full h-full object-contain rounded-lg"
          />
          {logoData[1]?.image && (
            <img
              src={logoData[1].image}
              alt="Logo Back Preview"
              className="absolute z-20"
              style={{
                top: logoData[1].y ? `${(logoData[1].y * 120) / 350}px` : "50%",
                left: logoData[1].x
                  ? `${(logoData[1].x * 150) / 450}px`
                  : "50%",
                width: `${((logoData[1].size || 50) * 120) / 350}px`,
                height: `${((logoData[1].size || 50) * 150) / 450}px`,
                transform: `translate(-50%, -50%) rotate(${
                  logoData[1].rotation || 0
                }deg)`,
                opacity: 1,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
);

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
  const [flipped] = useState(false);
  // --- FIX: Add selectedLockedArea state and update logic ---
  const [selectedLockedArea, setSelectedLockedArea] = useState<{
    side: number;
    idx: number;
  }>({ side: 0, idx: 0 });
  // --- Add state for preview modal and slider position ---
  const [showPreview, setShowPreview] = useState(false);
  // --- 360-degree rotation state and handlers ---
  const [rotation360, setRotation360] = useState(0); // 0-359 degrees
  const [sliderValue, setSliderValue] = useState(0); // 0-180 for blend/flip
  const dragRef360 = React.useRef<{
    startX: number;
    startAngle: number;
    lastX: number;
    lastTime: number;
    velocity: number;
  } | null>(null);
  const inertiaRef = React.useRef<number | null>(null);

  const handleMouseDown360 = (e: React.MouseEvent) => {
    const now = Date.now();
    dragRef360.current = {
      startX: e.clientX,
      startAngle: rotation360,
      lastX: e.clientX,
      lastTime: now,
      velocity: 0,
    };
    document.body.style.cursor = "grabbing";
    window.addEventListener("mousemove", handleMouseMove360);
    window.addEventListener("mouseup", handleMouseUp360);
    if (inertiaRef.current) {
      cancelAnimationFrame(inertiaRef.current);
      inertiaRef.current = null;
    }
  };

  const handleMouseMove360 = (e: MouseEvent) => {
    if (!dragRef360.current) return;
    const now = Date.now();
    const deltaX = e.clientX - dragRef360.current.startX;
    let newAngle = (dragRef360.current.startAngle - deltaX * 0.7) % 360;
    if (newAngle < 0) newAngle += 360;
    setRotation360(Math.round(newAngle));
    // Calculate velocity (pixels/ms)
    const dx = e.clientX - dragRef360.current.lastX;
    const dt = now - dragRef360.current.lastTime;
    let velocity = 0;
    if (dt > 0) velocity = dx / dt;
    dragRef360.current.lastX = e.clientX;
    dragRef360.current.lastTime = now;
    dragRef360.current.velocity = velocity;
  };

  const handleMouseUp360 = () => {
    document.body.style.cursor = "";
    window.removeEventListener("mousemove", handleMouseMove360);
    window.removeEventListener("mouseup", handleMouseUp360);
    if (dragRef360.current && Math.abs(dragRef360.current.velocity) > 0.01) {
      let velocity = dragRef360.current.velocity * 25;
      const decay = 0.85;
      let frameCount = 0;
      const maxFrames = 18;
      const animate = () => {
        if (Math.abs(velocity) < 0.1 || frameCount > maxFrames) return;
        setRotation360((prev) => {
          let next = (prev - velocity) % 360;
          if (next < 0) next += 360;
          return Math.round(next);
        });
        velocity *= decay;
        frameCount++;
        inertiaRef.current = requestAnimationFrame(animate);
      };
      inertiaRef.current = requestAnimationFrame(animate);
    }
    dragRef360.current = null;
  };

  React.useEffect(() => {
    return () => {
      if (inertiaRef.current) {
        cancelAnimationFrame(inertiaRef.current);
        inertiaRef.current = null;
      }
    };
  }, []);

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `http://31.97.41.27:5000/api/process-product/${sku}`,
          {
            method: "POST",
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("DEBUG: API response:", data);
        // Try to set product directly if data.product is undefined
        setProduct(data.product !== undefined ? data.product : data);
      } catch (error) {
        console.error("Error loading product details:", error);
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
      product.colorFrontImage && product.colorFrontImage !== ""
        ? product.colorFrontImage
        : undefined,
      product.colorBackImage && product.colorBackImage !== ""
        ? product.colorBackImage
        : undefined,
    ].filter((img): img is string => !!img);
    imgs = imgs.filter((img, idx, arr) => arr.indexOf(img) === idx);
    if (imgs.length > 1 && imgs.every((img) => img === imgs[0])) {
      imgs = [imgs[0]];
    }
    if (imgs.length === 0) {
      if (product.image && product.image !== "") {
        imgs = [product.image];
      } else {
        imgs = ["/public/img01.avif"];
      }
    }
    return imgs;
  }, [product]);

  // --- Ensure selectedLockedArea resets on product or side change ---
  // This must be before any conditional return!
  useEffect(() => {
    if (!loading && product && product.baseCategoryID !== undefined) {
      setSelectedLockedArea({ side: 0, idx: 0 });
    }
  }, [loading, product?.baseCategoryID, flipped]);

  // --- Move handlers above return to avoid ReferenceError ---
  const handleArrowLeft = () => {
    setSliderValue(0);
    setRotation360(0);
  };
  const handleArrowRight = () => {
    setSliderValue(180);
    setRotation360(180);
  };
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setSliderValue(value);
    setRotation360(value); // Sync 3D rotation with slider
  };
  // Keep sliderValue in sync with rotation360 (e.g., when dragging or using arrows)
  useEffect(() => {
    setSliderValue(rotation360);
  }, [rotation360]);

  // --- Add purchase modal state ---
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<"form" | "sent">("form");
  const [compositedFront, setCompositedFront] = useState<string | null>(null);
  const [compositedBack, setCompositedBack] = useState<string | null>(null);
  // --- Add refs for review modal previews (for snapshot) ---
  const reviewFrontRef = React.useRef<HTMLDivElement>(null);
  const reviewBackRef = React.useRef<HTMLDivElement>(null);

  // Add refs for front and back preview containers
  const frontScreenshotRef = React.useRef<HTMLDivElement>(null);
  const backScreenshotRef = React.useRef<HTMLDivElement>(null);

  // --- Purchase Modal Component ---
  const PurchaseModal = ({
    visible,
    onClose,
    images,
    logoData,
    purchaseStep,
    setPurchaseStep,
    frontScreenshotRef,
    backScreenshotRef,
    setCompositedFront,
    setCompositedBack,
    compositedFront,
    compositedBack,
    product,
    quantity,
  }: {
    visible: boolean;
    onClose: () => void;
    images: string[];
    logoData: Record<number, any>;
    purchaseStep: "form" | "sent";
    setPurchaseStep: (step: "form" | "sent") => void;
    frontScreenshotRef: React.RefObject<HTMLDivElement>;
    backScreenshotRef: React.RefObject<HTMLDivElement>;
    setCompositedFront: (img: string | null) => void;
    setCompositedBack: (img: string | null) => void;
    compositedFront: string | null;
    compositedBack: string | null;
    product: any;
    quantity: number;
  }) => {
    const [mergedFront, setMergedFront] = React.useState<string | null>(null);
    const [mergedBack, setMergedBack] = React.useState<string | null>(null);
    // Move input states inside modal to prevent focus loss
    const [localName, setLocalName] = React.useState("");
    const [localAddress, setLocalAddress] = React.useState("");
    const [localDescription, setLocalDescription] = React.useState("");
    const [localEmail, setLocalEmail] = React.useState("");
    const [localPhone, setLocalPhone] = React.useState("");

    // Helper to merge front image and its logo
    const mergeFrontImage = async () => {
      if (!images[0]) return;
      const width = 350,
        height = 450;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const productImg = new window.Image();
      productImg.crossOrigin = "anonymous";
      productImg.src = images[0];
      await new Promise((res) => {
        productImg.onload = res;
      });
      ctx.drawImage(productImg, 0, 0, width, height);
      if (logoData[0]?.image) {
        const logoImg = new window.Image();
        logoImg.crossOrigin = "anonymous";
        logoImg.src = logoData[0].image;
        await new Promise((res) => {
          logoImg.onload = res;
        });
        ctx.save();
        ctx.translate(logoData[0].x || width / 2, logoData[0].y || height / 2);
        ctx.rotate(((logoData[0].rotation || 0) * Math.PI) / 180);
        ctx.drawImage(
          logoImg,
          -(logoData[0].size || 50) / 2,
          -(logoData[0].size || 50) / 2,
          logoData[0].size || 50,
          logoData[0].size || 50
        );
        ctx.restore();
      }
      setMergedFront(canvas.toDataURL());
    };
    // Helper to merge back image and its logo
    const mergeBackImage = async () => {
      if (!images[1]) return;
      const width = 350,
        height = 450;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const productImg = new window.Image();
      productImg.crossOrigin = "anonymous";
      productImg.src = images[1];
      await new Promise((res) => {
        productImg.onload = res;
      });
      ctx.drawImage(productImg, 0, 0, width, height);
      if (logoData[1]?.image) {
        const logoImg = new window.Image();
        logoImg.crossOrigin = "anonymous";
        logoImg.src = logoData[1].image;
        await new Promise((res) => {
          logoImg.onload = res;
        });
        ctx.save();
        ctx.translate(logoData[1].x || width / 2, logoData[1].y || height / 2);
        ctx.rotate(((logoData[1].rotation || 0) * Math.PI) / 180);
        ctx.drawImage(
          logoImg,
          -(logoData[1].size || 50) / 2,
          -(logoData[1].size || 50) / 2,
          logoData[1].size || 50,
          logoData[1].size || 50
        );
        ctx.restore();
      }
      setMergedBack(canvas.toDataURL());
    };

    React.useEffect(() => {
      if (purchaseStep === "sent") {
        mergeFrontImage();
        mergeBackImage();
      } else {
        setMergedFront(null);
        setMergedBack(null);
      }
    }, [purchaseStep]);

    if (!visible) return null;
    return (
      <div className="fixed inset-0 bg-[#b3ddf3] bg-opacity-80 flex items-center justify-center z-50">
        <div className="relative bg-white rounded-xl shadow-2xl p-6 flex flex-col items-center">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-accent text-2xl"
          >
            ×
          </button>
          {purchaseStep === "form" ? (
            <>
              <h2 className="text-2xl font-bold text-[#b3ddf3] mb-2">
                Review & Send Custom Order
              </h2>
              <PurchasePreview images={images} logoData={logoData} />
              <textarea
                className="w-full min-h-[60px] max-h-[120px] mb-3 p-2 rounded bg-[#f3f8fa] text-accent border border-[#b3ddf3] focus:outline-none focus:ring-2 focus:ring-[#b3ddf3]"
                placeholder="Add custom description (optional)"
                value={localDescription}
                onChange={(e) => setLocalDescription(e.target.value)}
              />
              <input
                className="w-full mb-2 p-2 rounded bg-[#f3f8fa] text-accent border border-[#b3ddf3] focus:outline-none focus:ring-2 focus:ring-[#b3ddf3]"
                placeholder="Full Name"
                type="text"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
              />
              <input
                className="w-full mb-2 p-2 rounded bg-[#f3f8fa] text-accent border border-[#b3ddf3] focus:outline-none focus:ring-2 focus:ring-[#b3ddf3]"
                placeholder="Address"
                type="text"
                value={localAddress}
                onChange={(e) => setLocalAddress(e.target.value)}
              />
              <input
                className="w-full mb-2 p-2 rounded bg-[#f3f8fa] text-accent border border-[#b3ddf3] focus:outline-none focus:ring-2 focus:ring-[#b3ddf3]"
                placeholder="Email address"
                type="email"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
              />
              <input
                className="w-full mb-4 p-2 rounded bg-[#f3f8fa] text-accent border border-[#b3ddf3] focus:outline-none focus:ring-2 focus:ring-[#b3ddf3]"
                placeholder="Phone number"
                type="tel"
                value={localPhone}
                onChange={(e) => setLocalPhone(e.target.value)}
              />
              <button
                className="w-full py-2 bg-[#b3ddf3] text-accent rounded-lg font-bold hover:bg-[#a0cbe8] mb-2"
                onClick={async () => {
                  // Generate merged images first
                  let frontScreenshot = null;
                  let backScreenshot = null;
                  if (frontScreenshotRef.current) {
                    const canvas = await html2canvas(
                      frontScreenshotRef.current,
                      { backgroundColor: null }
                    );
                    frontScreenshot = canvas.toDataURL();
                  }
                  if (backScreenshotRef.current) {
                    const canvas = await html2canvas(
                      backScreenshotRef.current,
                      { backgroundColor: null }
                    );
                    backScreenshot = canvas.toDataURL();
                  }
                  // Save merged images to state and localStorage
                  setCompositedFront(frontScreenshot);
                  setCompositedBack(backScreenshot);
                  localStorage.setItem(
                    "lastOrderMergedFront",
                    frontScreenshot || ""
                  );
                  localStorage.setItem(
                    "lastOrderMergedBack",
                    backScreenshot || ""
                  );
                  // Ensure finalMergedFront and finalMergedBack are set
                  let finalMergedFront = frontScreenshot;
                  let finalMergedBack = backScreenshot;
                  if (!finalMergedFront)
                    finalMergedFront =
                      localStorage.getItem("lastOrderMergedFront") || "";
                  if (!finalMergedBack)
                    finalMergedBack =
                      localStorage.getItem("lastOrderMergedBack") || "";
                  if (!finalMergedFront || !finalMergedBack) {
                    alert("Final merged images are missing. Please try again.");
                    return;
                  }
                  // POST order data to backend, using requested structure
                  try {
                    const response = await fetch(
                      "http://31.97.41.27:5000/api/orders/pending",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          user: {
                            email: localEmail,
                            phone: localPhone,
                            name: localName,
                            address: localAddress,
                            description: localDescription,
                          },
                          product: {
                            sku: product?.sku || "",
                            name: product?.styleName || "",
                          },
                          quantity: quantity,
                          images: {
                            front: frontScreenshot,
                            back: backScreenshot,
                            providedFront: images[0] || null,
                            providedBack: images[1] || null,
                            finalMergedFront,
                            finalMergedBack,
                          },
                        }),
                      }
                    );
                    if (!response.ok) throw new Error("Failed to submit order");
                    alert("Order submitted successfully!");
                  } catch (err) {
                    alert("Failed to submit order. Please try again.");
                  }
                  setPurchaseStep("sent");
                }}
                disabled={
                  !localName || !localAddress || !localEmail || !localPhone
                }
              >
                Send
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="flex flex-col items-center mb-4">
                <svg
                  className="w-16 h-16 text-[#b3ddf3] mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12l2 2l4-4"
                  />
                </svg>
                <h3 className="text-xl font-bold text-[#b3ddf3] mb-1">
                  Request Sent!
                </h3>
                <p className="text-accent text-center mb-2">
                  Your product information has been sent for review.
                  <br />
                  We will contact you soon.
                </p>
              </div>
              {/* Only show the merged front/back image after purchase, not compositedFront/compositedBack */}
              {mergedFront && (
                <div className="w-full flex flex-col items-center mt-4">
                  <span className="text-xs text-gray-400 mb-1">
                    Final Merged Front Image
                  </span>
                  <img
                    src={mergedFront}
                    alt="Merged Front Preview"
                    className="object-contain border border-gray-700 rounded bg-white"
                    style={{ width: "120px", height: "150px" }}
                  />
                </div>
              )}
              {mergedBack && (
                <div className="w-full flex flex-col items-center mt-4">
                  <span className="text-xs text-gray-400 mb-1">
                    Final Merged Back Image
                  </span>
                  <img
                    src={mergedBack}
                    alt="Merged Back Preview"
                    className="object-contain border border-gray-700 rounded bg-white"
                    style={{ width: "120px", height: "150px" }}
                  />
                </div>
              )}
              <button
                className="mt-6 w-full py-2 bg-[#b3ddf3] text-accent rounded-lg font-bold hover:bg-[#a0cbe8]"
                onClick={() => {
                  setShowPurchaseModal(false);
                  setPurchaseStep("form");
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Utility to scale logo coordinates from preview to canvas
  function scaleLogoToCanvas(
    logo: LogoData,
    previewWidth: number,
    previewHeight: number,
    canvasWidth: number,
    canvasHeight: number
  ) {
    if (!logo) return logo;
    const scaleX = canvasWidth / previewWidth;
    const scaleY = canvasHeight / previewHeight;
    return {
      ...logo,
      x: (logo.x || previewWidth / 2) * scaleX,
      y: (logo.y || previewHeight / 2) * scaleY,
      size: (logo.size || 50) * Math.min(scaleX, scaleY),
    };
  }

  // Update mergeImages to accept preview size and scale logo
  const mergeImages = async (
    baseImgUrl: string,
    logo: LogoData | undefined,
    previewWidth = 350,
    previewHeight = 450,
    canvasWidth = 350,
    canvasHeight = 450
  ) => {
    return new Promise<string>(async (resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve("");
      // Draw base image
      const baseImg = new window.Image();
      baseImg.crossOrigin = "anonymous";
      baseImg.src = baseImgUrl;
      baseImg.onload = () => {
        ctx.drawImage(baseImg, 0, 0, canvasWidth, canvasHeight);
        if (logo && logo.image) {
          const scaledLogo = scaleLogoToCanvas(
            logo,
            previewWidth,
            previewHeight,
            canvasWidth,
            canvasHeight
          );
          const logoImg = new window.Image();
          logoImg.crossOrigin = "anonymous";
          logoImg.src = logo.image;
          logoImg.onload = () => {
            ctx.save();
            ctx.translate(scaledLogo.x, scaledLogo.y);
            ctx.rotate(((scaledLogo.rotation || 0) * Math.PI) / 180);
            ctx.drawImage(
              logoImg,
              -(scaledLogo.size || 50) / 2,
              -(scaledLogo.size || 50) / 2,
              scaledLogo.size || 50,
              scaledLogo.size || 50
            );
            ctx.restore();
            resolve(canvas.toDataURL());
          };
          logoImg.onerror = () => resolve(canvas.toDataURL());
        } else {
          resolve(canvas.toDataURL());
        }
      };
      baseImg.onerror = () => resolve("");
    });
  };

  // Fetch merged images from localStorage when purchase modal opens
  useEffect(() => {
    if (showPurchaseModal && purchaseStep === "sent") {
      const savedFront = localStorage.getItem("lastOrderMergedFront");
      const savedBack = localStorage.getItem("lastOrderMergedBack");
      setCompositedFront(savedFront);
      setCompositedBack(savedBack);
    }
  }, [showPurchaseModal, purchaseStep]);

  if (loading) return <TypewriterLoading />;
  if (!product || !product.sku) {
    console.log("DEBUG: Product fetch result:", product);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-2xl text-red-400">
        Product not found
      </div>
    );
  }

  // Calculate subtotal (ensure product.price and quantity are defined)
  const subtotal = (product.price || 0) * (quantity || 1);

  // --- Locked Logo Area Mapping ---
  // Only these baseCategoryIDs will have locked logo areas and snapping logic
  const LOCKED_BASE_CATEGORY_IDS = [
    "1",
    "2",
    "4",
    "5",
    "6",
    "7",
    "9",
    "10",
    "11",
    "12",
    "16",
    "26",
    "27",
  ];
  const lockedLogoAreaMap: Record<string, [Array<any>, Array<any>]> = {
    "1": [
      [
        { x: 220, y: 90, w: 55, h: 45, label: "Pocket (Right)" },
        { x: 105, y: 200, w: 140, h: 110, label: "Front Center" },
      ],
      [
        { x: 105, y: 60, w: 140, h: 60, label: "Back Top" },
        { x: 105, y: 200, w: 140, h: 110, label: "Back Center" },
      ],
    ],
    "16": [
      [
        { x: 220, y: 90, w: 55, h: 45, label: "Pocket (Right)" },
        { x: 105, y: 200, w: 140, h: 110, label: "Front Center" },
      ],
      [
        { x: 105, y: 60, w: 140, h: 60, label: "Back Top" },
        { x: 105, y: 200, w: 140, h: 110, label: "Back Center" },
      ],
    ],
    "2": [
      [
        { x: 60, y: 260, w: 70, h: 90, label: "Left Leg" },
        { x: 220, y: 260, w: 70, h: 90, label: "Right Leg" },
        { x: 135, y: 180, w: 80, h: 60, label: "Front Center" },
      ],
      [
        { x: 60, y: 260, w: 70, h: 90, label: "Back Left Leg" },
        { x: 220, y: 260, w: 70, h: 90, label: "Back Right Leg" },
        { x: 135, y: 180, w: 80, h: 60, label: "Back Center" },
      ],
    ],
    "4": [
      [{ x: 120, y: 120, w: 110, h: 70, label: "Front Center" }],
      [{ x: 140, y: 220, w: 70, h: 40, label: "Back Center" }],
    ],
    "5": [
      [
        { x: 90, y: 90, w: 90, h: 70, label: "Chest" },
        { x: 60, y: 320, w: 60, h: 60, label: "Left Shorts" },
        { x: 150, y: 320, w: 60, h: 60, label: "Right Shorts" },
      ],
      [
        { x: 90, y: 90, w: 90, h: 70, label: "Back Upper" },
        { x: 60, y: 320, w: 60, h: 60, label: "Back Left Shorts" },
        { x: 150, y: 320, w: 60, h: 60, label: "Back Right Shorts" },
      ],
    ],
    "6": [
      [
        { x: 60, y: 220, w: 70, h: 80, label: "Left Thigh" },
        { x: 170, y: 220, w: 70, h: 80, label: "Right Thigh" },
        { x: 120, y: 140, w: 80, h: 60, label: "Front Center" },
      ],
      [],
    ],
    "7": [
      [
        { x: 110, y: 70, w: 60, h: 60, label: "Left Chest" },
        { x: 170, y: 70, w: 60, h: 60, label: "Center Chest" },
        { x: 220, y: 370, w: 60, h: 40, label: "Bottom Right" },
      ],
      [
        { x: 120, y: 60, w: 80, h: 50, label: "Upper Back" },
        { x: 170, y: 200, w: 60, h: 60, label: "Center Back" },
      ],
    ],
    "9": [
      [
        { x: 80, y: 80, w: 60, h: 60, label: "Left Chest" },
        { x: 210, y: 80, w: 60, h: 60, label: "Right Chest" },
        { x: 145, y: 140, w: 70, h: 60, label: "Center Chest" },
      ],
      [
        { x: 120, y: 60, w: 80, h: 50, label: "Upper Back" },
        { x: 145, y: 180, w: 70, h: 60, label: "Center Back" },
      ],
    ],
    "10": [
      [{ x: 90, y: 200, w: 170, h: 60, label: "Front Center" }],
      [{ x: 90, y: 200, w: 170, h: 60, label: "Back Center" }],
    ],
    "11": [
      [
        { x: 110, y: 240, w: 60, h: 60, label: "Left Sock" },
        { x: 210, y: 240, w: 60, h: 60, label: "Right Sock" },
      ],
      [
        { x: 110, y: 240, w: 60, h: 60, label: "Left Sock Back" },
        { x: 210, y: 240, w: 60, h: 60, label: "Right Sock Back" },
      ],
    ],
    "12": [
      [{ x: 130, y: 90, w: 110, h: 80, label: "Front Center" }],
      [{ x: 130, y: 90, w: 110, h: 80, label: "Back Center" }],
    ],
    "26": [
      [
        // Example: center chest for front
        { x: 120, y: 100, w: 100, h: 80, label: "Front Center" },
      ],
      [
        // Example: upper back for back
        { x: 120, y: 60, w: 100, h: 60, label: "Back Upper" },
      ],
    ],
    "27": [
      [
        // Left chest (front)
        { x: 70, y: 90, w: 60, h: 60, label: "Left Chest" },
        // Center chest (front)
        { x: 160, y: 90, w: 60, h: 60, label: "Center Chest" },
      ],
      [
        // Upper back (back)
        { x: 120, y: 60, w: 100, h: 60, label: "Back Upper" },
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
        const side = selectedLockedArea.side;
        const areaIdx = selectedLockedArea.idx;
        const area = lockedLogoAreas[side][areaIdx];
        setSelectedLockedArea({ side, idx: areaIdx });
        // Auto-size logo to fit inside the box (with margin)
        const margin = 8;
        const logoSize = Math.max(20, Math.min(area.w, area.h) - margin);
        setLogoData((prev) => ({
          ...prev,
          [side]: {
            ...prev[side],
            image: reader.result as string,
            x: area.x + area.w / 2,
            y: area.y + area.h / 2,
            size: logoSize,
            rotation: prev[side]?.rotation || 0,
            _noTransition: false,
          },
        }));
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const SNAP_THRESHOLD = 30; // px, distance from center to trigger snap

  // --- Update logo drag logic to use selectedLockedArea ---
  const handleLogoDragMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && draggedSide !== null && logoData[draggedSide]?.image) {
      const rect = event.currentTarget.getBoundingClientRect();
      let x =
        event.clientX - rect.left - (logoData[draggedSide].size || 50) / 2;
      let y = event.clientY - rect.top - (logoData[draggedSide].size || 50) / 2;
      // Restrict to currently selected box, allow full movement inside the box
      if (
        isLockedLogo &&
        draggedSide === selectedLockedArea.side &&
        lockedLogoAreas[selectedLockedArea.side].length > 0
      ) {
        const area =
          lockedLogoAreas[selectedLockedArea.side][selectedLockedArea.idx];
        // Clamp logo so its center stays inside the box
        x = Math.max(area.x, Math.min(x, area.x + area.w));
        y = Math.max(area.y, Math.min(y, area.y + area.h));
        setLogoData((prev) => ({
          ...prev,
          [draggedSide]: {
            ...prev[draggedSide],
            x,
            y,
            _noTransition: true,
          },
        }));
        return;
      }
      // Otherwise, free placement
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
    // Snap to nearest box center if close (for selected side only)
    if (
      isLockedLogo &&
      draggedSide !== null &&
      draggedSide === selectedLockedArea.side &&
      lockedLogoAreas[selectedLockedArea.side].length > 0
    ) {
      const logo = logoData[draggedSide];
      let snapIdx = selectedLockedArea.idx;
      let minDist = Infinity;
      let snapX = logo.x,
        snapY = logo.y;
      lockedLogoAreas[selectedLockedArea.side].forEach((area, idx) => {
        const centerX = area.x + area.w / 2;
        const centerY = area.y + area.h / 2;
        const dist = Math.sqrt(
          Math.pow((logo.x || 0) - centerX, 2) +
            Math.pow((logo.y || 0) - centerY, 2)
        );
        if (dist < SNAP_THRESHOLD && dist < minDist) {
          minDist = dist;
          snapIdx = idx;
          snapX = centerX;
          snapY = centerY;
        }
      });
      if (minDist < SNAP_THRESHOLD) {
        setSelectedLockedArea({ side: draggedSide, idx: snapIdx });
        setLogoData((prev) => ({
          ...prev,
          [draggedSide]: {
            ...prev[draggedSide],
            x: snapX,
            y: snapY,
            _noTransition: false,
          },
        }));
      } else {
        setLogoData((prev) => ({
          ...prev,
          [draggedSide]: {
            ...prev[draggedSide],
            _noTransition: false,
          },
        }));
      }
    }
    setIsDragging(false);
    setDraggedSide(null);
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

  // --- Helper to render 3D card flip effect with two images ---
  const get3DRotatingImage = () => {
    if (!images[0]) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-900 rounded-xl">
          <span className="text-xl text-gray-400">
            Product preview not available
          </span>
        </div>
      );
    }
    const angle = rotation360 % 360;
    const showFront = angle < 90 || angle > 270;
    const showBack = angle > 90 && angle < 270;
    return (
      <div
        className="relative w-full h-full select-none"
        style={{ perspective: "1200px", cursor: isDragging ? "move" : "grab" }}
        onMouseDown={handleMouseDown360}
        onMouseMove={handleLogoDragMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        <div
          className="absolute w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${angle}deg)`,
            transition: "transform 1s cubic-bezier(0.23, 1, 0.32, 1)",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Front outlines (on front face) */}
          {isLockedLogo &&
            lockedLogoAreas[0].map((area, idx) => (
              <div
                key={"front-outline-" + idx}
                className={`absolute border-2 rounded-lg pointer-events-auto ${
                  selectedLockedArea.side === 0 &&
                  selectedLockedArea.idx === idx
                    ? "border-primary"
                    : "border-red-500"
                } cursor-pointer`}
                style={{
                  left: `${area.x}px`,
                  top: `${area.y}px`,
                  width: `${area.w}px`,
                  height: `${area.h}px`,
                  zIndex: 12,
                  boxShadow:
                    selectedLockedArea.side === 0 &&
                    selectedLockedArea.idx === idx
                      ? "0 0 0 3px rgba(34,197,94,0.5)"
                      : "0 0 0 2px rgba(255,0,0,0.3)",
                  background: "rgba(0,0,0,0.05)",
                  borderStyle: "solid",
                  borderColor:
                    selectedLockedArea.side === 0 &&
                    selectedLockedArea.idx === idx
                      ? "#22c55e"
                      : "#ef4444",
                  borderWidth: "2px",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(0deg)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    selectedLockedArea.side === 0 &&
                    selectedLockedArea.idx === idx
                  )
                    return;
                  // If logo exists, move and resize it to fit this box
                  if (logoData[0]?.image) {
                    const margin = 8;
                    const logoSize = Math.max(
                      20,
                      Math.min(area.w, area.h) - margin
                    );
                    setLogoData((prevLogo) => ({
                      ...prevLogo,
                      0: {
                        ...prevLogo[0],
                        x: area.x + area.w / 2,
                        y: area.y + area.h / 2,
                        size: logoSize,
                        _noTransition: false,
                      },
                    }));
                  }
                  setSelectedLockedArea({ side: 0, idx });
                }}
              />
            ))}
          {/* Back outlines (on back face) */}
          {isLockedLogo &&
            lockedLogoAreas[1].map((area, idx) => (
              <div
                key={"back-outline-" + idx}
                className={`absolute border-2 rounded-lg pointer-events-auto ${
                  selectedLockedArea.side === 1 &&
                  selectedLockedArea.idx === idx
                    ? "border-primary"
                    : "border-red-500"
                } cursor-pointer`}
                style={{
                  left: `${area.x}px`,
                  top: `${area.y}px`,
                  width: `${area.w}px`,
                  height: `${area.h}px`,
                  zIndex: 12,
                  boxShadow:
                    selectedLockedArea.side === 1 &&
                    selectedLockedArea.idx === idx
                      ? "0 0 0 3px rgba(34,197,94,0.5)"
                      : "0 0 0 2px rgba(255,0,0,0.3)",
                  background: "rgba(0,0,0,0.05)",
                  borderStyle: "solid",
                  borderColor:
                    selectedLockedArea.side === 1 &&
                    selectedLockedArea.idx === idx
                      ? "#22c55e"
                      : "#ef4444",
                  borderWidth: "2px",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg) scaleX(-1)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    selectedLockedArea.side === 1 &&
                    selectedLockedArea.idx === idx
                  )
                    return;
                  if (logoData[1]?.image) {
                    const margin = 8;
                    const logoSize = Math.max(
                      20,
                      Math.min(area.w, area.h) - margin
                    );
                    setLogoData((prevLogo) => ({
                      ...prevLogo,
                      1: {
                        ...prevLogo[1],
                        x: area.x + area.w / 2,
                        y: area.y + area.h / 2,
                        size: logoSize,
                        _noTransition: false,
                      },
                    }));
                  }
                  setSelectedLockedArea({ side: 1, idx });
                }}
              />
            ))}
          {/* Front image */}
          <img
            src={images[0]}
            alt="Front"
            className="absolute w-full h-full object-contain rounded-xl"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
              zIndex: 2,
            }}
            draggable={false}
          />
          {/* Back image */}
          <img
            src={images[1] || images[0]}
            alt="Back"
            className="absolute w-full h-full object-contain rounded-xl"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) scaleX(-1)",
              zIndex: 1,
            }}
            draggable={false}
          />
          {/* Front logo */}
          {showFront && logoData[0]?.image && (
            <img
              src={logoData[0].image}
              alt="Logo Front"
              className="absolute z-20 shadow-xl border-2 border-primary rounded-lg cursor-move"
              style={{
                top: logoData[0].y ? `${logoData[0].y}px` : "50%",
                left: logoData[0].x ? `${logoData[0].x}px` : "50%",
                width: `${logoData[0].size || 50}px`,
                height: `${logoData[0].size || 50}px`,
                transform: `translate(-50%, -50%) rotate(${
                  logoData[0].rotation || 0
                }deg)`,
                opacity: 1,
                mixBlendMode: "normal",
                zIndex: 20,
                background: "white",
                transition: logoData[0]._noTransition
                  ? "none"
                  : "all 0.2s ease",
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
                setDraggedSide(0);
              }}
            />
          )}
          {/* Back logo */}
          {showBack && logoData[1]?.image && (
            <img
              src={logoData[1].image}
              alt="Logo Back"
              className="absolute z-20 shadow-xl border-2 border-primary rounded-lg cursor-move"
              style={{
                top: logoData[1].y ? `${logoData[1].y}px` : "50%",
                left: logoData[1].x ? `${logoData[1].x}px` : "50%",
                width: `${logoData[1].size || 50}px`,
                height: `${logoData[1].size || 50}px`,
                transform: `translate(-50%, -50%) rotate(${
                  logoData[1].rotation || 0
                }deg)`,
                opacity: 1,
                mixBlendMode: "normal",
                zIndex: 20,
                background: "white",
                transition: logoData[1]._noTransition
                  ? "none"
                  : "all 0.2s ease",
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
                setDraggedSide(1);
              }}
            />
          )}
        </div>
      </div>
    );
  };

  // --- Add preview modal component ---
  const PreviewModal = ({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
  }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="relative bg-[#b3ddf3] rounded-xl shadow-2xl p-6 flex flex-col items-center">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white text-2xl"
          >
            ×
          </button>
          <div className="w-[350px] h-[450px] relative flex items-center justify-center mb-4">
            {/* Front Preview with ref */}
            {rotation360 < 90 && (
              <div ref={reviewFrontRef} className="absolute w-full h-full">
                <img
                  src={images[0]}
                  alt="Front Preview"
                  className="absolute w-full h-full object-contain rounded-xl"
                />
                {logoData[0]?.image && (
                  <img
                    src={logoData[0].image}
                    alt="Logo Front Preview"
                    className="absolute z-20"
                    style={{
                      top: logoData[0].y ? `${logoData[0].y}px` : "50%",
                      left: logoData[0].x ? `${logoData[0].x}px` : "50%",
                      width: `${logoData[0].size || 50}px`,
                      height: `${logoData[0].size || 50}px`,
                      transform: `translate(-50%, -50%) rotate(${
                        logoData[0].rotation || 0
                      }deg)`,
                      opacity: 1,
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>
            )}
            {/* Back Preview with ref */}
            {rotation360 >= 90 && (
              <div ref={reviewBackRef} className="absolute w-full h-full">
                <img
                  src={images[1] || images[0]}
                  alt="Back Preview"
                  className="absolute w-full h-full object-contain rounded-xl"
                />
                {logoData[1]?.image && (
                  <img
                    src={logoData[1].image}
                    alt="Logo Back Preview"
                    className="absolute z-20"
                    style={{
                      top: logoData[1].y ? `${logoData[1].y}px` : "50%",
                      left: logoData[1].x ? `${logoData[1].x}px` : "50%",
                      width: `${logoData[1].size || 50}px`,
                      height: `${logoData[1].size || 50}px`,
                      transform: `translate(-50%, -50%) rotate(${
                        logoData[1].rotation || 0
                      }deg)`,
                      opacity: 1,
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => setRotation360(0)}
              className="p-2 bg-[#b3ddf3] rounded-full text-accent"
            >
              Front
            </button>
            <input
              type="range"
              min={0}
              max={180}
              value={rotation360}
              onChange={(e) => setRotation360(Number(e.target.value))}
              className="w-40 mx-2"
            />
            <button
              onClick={() => setRotation360(180)}
              className="p-2 bg-[#b3ddf3] rounded-full text-accent"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- UI to select locked logo area for front and back ---
  // Only show if locked and there are areas
  const renderLockedAreaSelectors = () => {
    if (!isLockedLogo) return null;
    return (
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-400">Front Areas:</span>
          {lockedLogoAreas[0].map((area, idx) => (
            <button
              key={idx}
              className={`px-2 py-1 rounded text-xs font-bold border ${
                selectedLockedArea.side === 0 && selectedLockedArea.idx === idx
                  ? "bg-primary text-black border-primary"
                  : "bg-gray-800 text-white border-gray-600"
              }`}
              onClick={() => {
                if (
                  selectedLockedArea.side === 0 &&
                  selectedLockedArea.idx === idx
                )
                  return;
                if (logoData[0]?.image) {
                  const margin = 8;
                  const logoSize = Math.max(
                    20,
                    Math.min(area.w, area.h) - margin
                  );
                  setLogoData((prevLogo) => ({
                    ...prevLogo,
                    0: {
                      ...prevLogo[0],
                      x: area.x + area.w / 2,
                      y: area.y + area.h / 2,
                      size: logoSize,
                      _noTransition: false,
                    },
                  }));
                }
                setSelectedLockedArea({ side: 0, idx });
              }}
            >
              {area.label || `Area ${idx + 1}`}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-400">Back Areas:</span>
          {lockedLogoAreas[1].map((area, idx) => (
            <button
              key={idx}
              className={`px-2 py-1 rounded text-xs font-bold border ${
                selectedLockedArea.side === 1 && selectedLockedArea.idx === idx
                  ? "bg-primary text-black border-primary"
                  : "bg-gray-800 text-white border-gray-600"
              }`}
              onClick={() => {
                if (
                  selectedLockedArea.side === 1 &&
                  selectedLockedArea.idx === idx
                )
                  return;
                if (logoData[1]?.image) {
                  const margin = 8;
                  const logoSize = Math.max(
                    20,
                    Math.min(area.w, area.h) - margin
                  );
                  setLogoData((prevLogo) => ({
                    ...prevLogo,
                    1: {
                      ...prevLogo[1],
                      x: area.x + area.w / 2,
                      y: area.y + area.h / 2,
                      size: logoSize,
                      _noTransition: false,
                    },
                  }));
                }
                setSelectedLockedArea({ side: 1, idx });
              }}
            >
              {area.label || `Area ${idx + 1}`}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-[#222]">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Section */}
          <div className="relative flex flex-col items-center">
            {/* Locked area selectors for front/back */}
            {renderLockedAreaSelectors()}
            {/* 3D Flip Card with slider and arrows */}
            <div className="relative w-[350px] h-[450px] mb-6 flex items-center justify-center">
              {/* Left arrow */}
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-gray-800 bg-opacity-60 rounded-full p-2 hover:bg-primary"
                onClick={handleArrowLeft}
                aria-label="Front"
              >
                <span className="text-2xl">&#8592;</span>
              </button>
              {/* 3D rotating image area */}
              <div
                className="w-full h-full cursor-pointer flex items-center justify-center"
                style={{ perspective: "1200px" }}
              >
                {get3DRotatingImage()}
              </div>
              {/* Right arrow */}
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-gray-800 bg-opacity-60 rounded-full p-2 hover:bg-primary"
                onClick={handleArrowRight}
                aria-label="Back"
              >
                <span className="text-2xl">&#8594;</span>
              </button>
              {/* Preview Button */}
              <button
                className="absolute bottom-2 right-2 z-40 bg-[#b3ddf3] text-accent px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-[#a0cbe8]"
                onClick={() => setShowPreview(true)}
              >
                Preview Final Product
              </button>
            </div>
            {/* Slider below image for 0–180 blending */}
            <input
              type="range"
              min={0}
              max={180}
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-60 my-2"
            />
            {/* Thumbnail Slider (clickable) */}
            <div className="mt-4 flex justify-center space-x-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border-2 rounded-lg ${
                    sliderValue === (index === 0 ? 0 : 180)
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => {
                    setSliderValue(index === 0 ? 0 : 180);
                    setRotation360(index === 0 ? 0 : 180);
                  }}
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
            {/* Preview Modal */}
            <PreviewModal
              open={showPreview}
              onClose={() => setShowPreview(false)}
            />
          </div>

          {/* Product Details Section */}
          <div>
            <h1 className="text-5xl font-extrabold mb-4 text-[#b3ddf3]">
              {product.brandName} {product.styleName}
            </h1>
            <p className="text-lg text-[#b3ddf3] mb-6 italic">
              {product.colorName}
            </p>
            <p className="text-3xl font-bold mb-2 text-[#b3ddf3]">
              ${product.salePrice.toFixed(2)}
            </p>
            <p className="text-lg font-medium mb-6 text-accent">
              Subtotal: <span className="text-[#b3ddf3]">${subtotal}</span>
            </p>

            <div className="mb-6">
              <p className="text-sm text-gray-400">SKU: {product.sku}</p>
              <p className="text-sm text-gray-400">GTIN: {product.gtin}</p>
              <p className="text-sm text-gray-400">
                Country of Origin: {product.countryOfOrigin}
              </p>
              <p className="text-sm text-gray-400">
                Available Quantity:{" "}
                <span className="font-bold">{product.caseQty}</span>
              </p>
              <p className="text-sm text-gray-400">
                Case Quantity (Max): {product.caseQty}
              </p>
              <p className="text-sm text-gray-400">
                Unit Weight: {product.unitWeight} lbs
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select Quantity
              </label>
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
                  className="w-16 text-center px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                  Selected: <span className="font-bold">{quantity}</span> /{" "}
                  {product.caseQty}
                </p>
              </div>
              {quantity > product.caseQty && (
                <p className="text-sm text-red-500 mt-2">
                  Quantity exceeds the maximum case quantity!
                </p>
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
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-400"
              />
            </div>

            {/* Logo controls (show only if logo is present for the current image) */}
            {isLockedLogo && (logoData[0]?.image || logoData[1]?.image) && (
              <div className="flex items-center justify-between mb-4">
                {/* Front controls */}
                {logoData[0]?.image && (
                  <>
                    <button
                      onClick={() =>
                        setLogoData((prev) => ({
                          ...prev,
                          0: {
                            ...prev[0],
                            rotation: (prev[0]?.rotation || 0) + 15,
                          },
                        }))
                      }
                      className="py-1 px-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-transform transform hover:scale-105 shadow-lg"
                    >
                      Rotate Front
                    </button>
                    <button
                      onClick={() =>
                        setLogoData((prev) => ({
                          ...prev,
                          0: { ...prev[0], image: null },
                        }))
                      }
                      className="py-1 px-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-400 transition-transform transform hover:scale-105 shadow-lg"
                    >
                      Delete Front
                    </button>
                  </>
                )}
                {/* Back controls */}
                {logoData[1]?.image && (
                  <>
                    <button
                      onClick={() =>
                        setLogoData((prev) => ({
                          ...prev,
                          1: {
                            ...prev[1],
                            rotation: (prev[1]?.rotation || 0) + 15,
                          },
                        }))
                      }
                      className="py-1 px-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-transform transform hover:scale-105 shadow-lg"
                    >
                      Rotate Back
                    </button>
                    <button
                      onClick={() =>
                        setLogoData((prev) => ({
                          ...prev,
                          1: { ...prev[1], image: null },
                        }))
                      }
                      className="py-1 px-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-400 transition-transform transform hover:scale-105 shadow-lg"
                    >
                      Delete Back
                    </button>
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => setShowPurchaseModal(true)}
              className="w-full py-3 bg-[#b3ddf3] text-accent rounded-lg font-medium hover:bg-[#a0cbe8] transition-transform transform hover:scale-105 shadow-lg"
            >
              Purchase
            </button>
            <PurchaseModal
              visible={showPurchaseModal}
              onClose={() => {
                setShowPurchaseModal(false);
                setPurchaseStep("form");
              }}
              images={images}
              logoData={logoData}
              purchaseStep={purchaseStep}
              setPurchaseStep={setPurchaseStep}
              frontScreenshotRef={frontScreenshotRef}
              backScreenshotRef={backScreenshotRef}
              setCompositedFront={setCompositedFront}
              setCompositedBack={setCompositedBack}
              compositedFront={compositedFront}
              compositedBack={compositedBack}
              product={product}
              quantity={quantity}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDProducts;
