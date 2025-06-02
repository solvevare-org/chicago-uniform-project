import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ProductGrid from './components/Products/ProductGrid';
import Footer from './components/Footer/Footer';
import { getAccessoriesProducts, getHeadwearProducts, getOuterwearProducts,  getBrandsProducts } from './data/products';
import LoginScreen from './components/Auth/LoginScreen';
import SignupScreen from './components/Auth/SignupScreen';
import ForgotPasswordScreen from './components/Auth/ForgotPasswordScreen';
import HowItWorks from './components/HowItWorks/HowItWorks';
import ProductPage from './components/Products/ProductPage';
import Brands from './pages/Categories/Brands';
import WishlistPage from './components/Products/WishlistPage';
import EmbroideryPage from './pages/EmbroideryPage';
import CustomAccessories from './pages/Categories/CustomAccessories';
import CustomBags from './pages/Categories/CustomBags';
import CustomHeadwear from './pages/Categories/CustomHeadwear';
import CustomOutwear from './pages/Categories/CustomOutwear';
import CustomShirts from './pages/Categories/CustomShirts';
import PantsAndShorts from './pages/Categories/PantsAndShorts'; 
import CustomEmbroideredShirts from './pages/Categories/CustomEmbroideredShirts';
import CustomEmbroideredOutwear from './pages/Categories/CustomEmbroideredOutwear';
import DynamicCategoryPage from './pages/DynamicCategoryPage';
import DynamicProductPage from './pages/DynamicProductPage';
import DynamicBrands from './pages/DynamicBrands';
import CategoryPage from './pages/Category';
import AllBrandPage from './pages/all-brand';
import AllCategoriesPage from './pages/all-categories';
import { Product } from './components/Products/ProductCard';
import TestProductPage from './pages/testProductPage';
import ThreeDProducts from './pages/testProductPage';

import SecondTestProductPage from './pages/testProductPagesecond';
import HomeBrandGrid from './components/Products/HomeBrandGrid';
function App() {
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [loadingAccessories, setLoadingAccessories] = useState(true);
  const [outerwear, setOuterwear] = useState<Product[]>([]);
  const [loadingOuterwear, setLoadingOuterwear] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [brand, setBrand] = useState<Product[]>([]);
  const [headwear, setHeadwear] = useState<Product[]>([]);
  const [loadingHeadwear, setLoadingHeadwear] = useState(true);

  useEffect(() => {
    async function fetchAccessories() {
      setLoadingAccessories(true);
      try {
        const data = await getAccessoriesProducts(10);
        setAccessories(Array.isArray(data) ? data : []);
      } catch (e) {
        setAccessories([]);
      } finally {
        setLoadingAccessories(false);
      }
    }
    fetchAccessories();
  }, []);

  useEffect(() => {
    async function fetchOuterwear() {
      setLoadingOuterwear(true);
      try {
        const data = await getOuterwearProducts(10);
        setOuterwear(Array.isArray(data) ? data : []);
      } catch (e) {
        setOuterwear([]);
      } finally {
        setLoadingOuterwear(false);
      }
    }
    fetchOuterwear();
  }, []);

  useEffect(() => {
    async function fetchHeadwear() {
      setLoadingHeadwear(true);
      try {
        const data = await getHeadwearProducts(10);
        setHeadwear(Array.isArray(data) ? data : []);
      } catch (e) {
        setHeadwear([]);
      } finally {
        setLoadingHeadwear(false);
      }
    }
    fetchHeadwear();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[#121212] text-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                
                <HomeBrandGrid />
                
                {loadingOuterwear ? (
                  <div className="text-gray-400 px-4 py-8">Loading outerwear...</div>
                ) : !outerwear || outerwear.length === 0 ? (
                  <div className="text-red-400 px-4 py-8">No outerwear found.</div>
                ) : (
                  <ProductGrid 
                    title="Outerwear Products" 
                    products={outerwear}
                  />
                )}
                {loadingHeadwear ? (
                  <div className="text-gray-400 px-4 py-8">Loading headwear...</div>
                ) : !headwear || headwear.length === 0 ? (
                  <div className="text-red-400 px-4 py-8">No headwear found.</div>
                ) : (
                  <ProductGrid 
                    title="Headwear Products" 
                    products={headwear}
                  />
                )}
                {loadingAccessories ? (
                  <div className="text-gray-400 px-4 py-8">Loading accessories...</div>
                ) : !accessories || accessories.length === 0 ? (
                  <div className="text-red-400 px-4 py-8">No accessories found.</div>
                ) : (
                  <ProductGrid 
                    title="Accessories Products" 
                    products={accessories}
                  />
                )}
                
              </>
            } />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/products/" element={<ProductPage />} />
    
            <Route path="/customaccessories" element={<CustomAccessories />} />
            <Route path="/custombags" element={<CustomBags />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/customheadwear" element={<CustomHeadwear />} />
            <Route path="/customoutwear" element={<CustomOutwear />} />
            <Route path="/embsroidery" element={<EmbroideryPage />} />
            <Route path="/customembroideredshirts" element={<CustomEmbroideredShirts />} />
            <Route path="/customembroideredoutwear" element={<CustomEmbroideredOutwear />} />
            <Route path="/customshirts" element={<CustomShirts />} />
            <Route path="/testproduct" element={<TestProductPage/>} />
            <Route path="/sectestproduct" element={<SecondTestProductPage/>} />
            <Route path="/pantsandshorts" element={<PantsAndShorts />} />
            <Route path="/category/:category" element={<DynamicCategoryPage />} />
            <Route path="/:category" element={<CategoryPage />} />
            <Route path="/product/:sku" element={<DynamicProductPage />} />
            <Route path='/brands/:category' element={<DynamicBrands/>} />
            <Route path="/3dproducts/:sku" element={<ThreeDProducts />} />

             <Route path='/all-brands' element={<AllBrandPage/>} />
             <Route path='/all-categories' element={<AllCategoriesPage/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;