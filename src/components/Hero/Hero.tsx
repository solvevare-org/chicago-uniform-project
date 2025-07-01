import React from 'react';
import { Helmet } from "react-helmet";

const Hero: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Custom Embroidered and Printed Apparel | Professional Custom Uniforms</title>
        <meta name="description" content="Get high-quality custom apparel embroidered or printed with your logo or design. Perfect for businesses, teams & events. Professional custom uniforms and branded merchandise." />
        <meta name="keywords" content="custom apparel, custom apparel printing, custom embroidered apparel, custom uniforms, branded merchandise" />
      </Helmet>
      
      {/* Main Static Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 lg:py-24">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Custom Embroidered
                  <span className="block text-blue-600">Apparel</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    SHOP PRODUCTS
                  </button>
                  <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105">
                    START DESIGNING
                  </button>
                </div>
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">Fast Logo Embroidery</div>
                  <div className="text-sm text-gray-600">All orders come with free setup</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Free Shipping</div>
                  <div className="text-sm text-gray-600">Orders over $200 ship free</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">Quick Turnaround</div>
                  <div className="text-sm text-gray-600">Get logo reviewed in 24 hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">No Minimums</div>
                  <div className="text-sm text-gray-600">Order any quantity you need</div>
                </div>
              </div>
            </div>
            
            {/* Right Visual */}
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://i5.walmartimages.com/seo/adidas-mens-Go-To-Utility-Jacket-l-Black_39a68ff4-3e86-4992-ad8a-58883e10356a.127d0d78b0d9158110626c62524d22a2.jpeg" 
                  alt="Custom Embroidered Apparel - Professional Uniforms" 
                  className="w-full h-auto max-w-lg mx-auto rounded-2xl shadow-2xl"
                />
              </div>
              
              {/* Background decorative elements */}
              <div className="absolute top-4 right-4 w-24 h-24 bg-blue-200 rounded-full opacity-20 -z-10"></div>
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-purple-200 rounded-full opacity-20 -z-10"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-10 -z-20"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;