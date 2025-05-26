import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://i5.walmartimages.com/seo/adidas-mens-Go-To-Utility-Jacket-l-Black_39a68ff4-3e86-4992-ad8a-58883e10356a.127d0d78b0d9158110626c62524d22a2.jpeg',
    title: 'Adidas Men Full Zip Jacket',
    subtitle: 'Black',
    buttonText: 'Shop Now',
    buttonLink: '/product/B57153503',
    bgColor: 'bg-green-500'
  },
  {
    id: 2,
    image: 'https://m.media-amazon.com/images/I/61JPGGQZfbL.jpg',
    title: 'A4 N5283',
    subtitle: 'Blue',
    buttonText: 'View Details',
    buttonLink: '/product/B00674753',
    bgColor: 'bg-amber-400'
  },
  {
    id: 3,
    image: 'https://m.media-amazon.com/images/I/51K068ankEL._AC_SX569_.jpg',
    title: 'Adidas A450',
    subtitle: 'Collegiate Royal',
    buttonText: 'Buy Now',
    buttonLink: '/product/B00153753',
    bgColor: 'bg-sky-400'
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToPrevSlide = () => {
    if (animating) return;
    setAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // Reset timer
  };

  const goToNextSlide = () => {
    if (animating) return;
    setAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // Reset timer
  };

  // Auto-advance every 2 seconds, always runs
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAnimating(true);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlide]);

  // End animation after 1.5s
  useEffect(() => {
    if (animating) {
      const timer = setTimeout(() => setAnimating(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [animating]);

  return (
    <div className="relative overflow-hidden rounded-2xl my-4 mx-4 md:mx-6 lg:mx-8 z-0">
      <div className="max-w-screen-2xl mx-auto">
        <div className="relative h-[540px] w-full overflow-hidden">
          {slides.map((slide, index) => {
            let position = 'translate-x-full';
            if (index === currentSlide) position = 'translate-x-0';
            else if (
              (index === currentSlide - 1) ||
              (currentSlide === 0 && index === slides.length - 1)
            ) position = '-translate-x-full';
            return (
              <div
                key={slide.id}
                className={`absolute top-0 left-0 w-[98%] h-[92%] transition-transform duration-[1500ms] ease-in-out ${position} ${index === currentSlide ? 'z-10' : 'z-0'} ${animating ? '' : ''}`}
                style={{ pointerEvents: index === currentSlide ? 'auto' : 'none', margin: '1% 1%' }}
              >
                <div className={`${slide.bgColor} rounded-2xl overflow-hidden h-full w-full flex flex-col md:flex-row items-center justify-between p-0`}>
                  <div className="md:w-1/2 w-full h-full flex items-center justify-center">
                    {slide.image ? (
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-full h-full object-cover"
                        style={{ minHeight: '540px', height: '100%', maxHeight: '100%', minWidth: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-2xl">No Image</div>
                    )}
                  </div>
                  <div className="md:w-1/2 w-full p-4 md:p-8 flex flex-col items-center md:items-end text-center md:text-right">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
                      {slide.title}
                    </h2>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mt-2">
                      {slide.subtitle}
                    </h3>
                    <a
                      href={slide.buttonLink}
                      className="mt-6 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-opacity-80 transition"
                    >
                      {slide.buttonText}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Hero;