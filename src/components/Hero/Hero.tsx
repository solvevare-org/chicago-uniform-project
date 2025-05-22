import React, { useState } from 'react';
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
    title: 'adidas Mens Go-to Utility DWR Full Zip Jacket',
    subtitle: 'Black',
    buttonText: 'Shop Now',
    buttonLink: '/product/B57153503',
    bgColor: 'bg-lime-300'
  },
  {
    id: 2,
    image: 'https://media.futbolmania.com/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/H/G/HG6294_pantalon-corto-color-azul-adidas-entrada-22_1_completa-frontal.jpg',
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

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl my-4 mx-4 md:mx-6 lg:mx-8 z-0">
      <div className="max-w-screen-2xl mx-auto">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'hidden opacity-0'
            }`}
          >
            <div className={`${slide.bgColor} rounded-2xl overflow-hidden`}>
              <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-0">
                <div className="md:w-1/2 w-full">
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="w-full object-cover"
                    style={{ height: '540px', maxHeight: '540px' }}
                  />
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
          </div>
        ))}
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