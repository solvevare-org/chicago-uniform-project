import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ProductGrid from './components/Products/ProductGrid';
import Footer from './components/Footer/Footer';
import { getAccessoriesProducts, getHeadwearProducts, getOuterwearProducts } from './data/products';
import LoginScreen from './components/Auth/LoginScreen';
import SignupScreen from './components/Auth/SignupScreen';
import ForgotPasswordScreen from './components/Auth/ForgotPasswordScreen';
import HowItWorks from './components/HowItWorks/HowItWorks';
import ProductPage from './components/Products/ProductPage';
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

import Dashboard from "./pages/admin/dashboard";
import SearchProducts from "./pages/admin/search-products";
import UpdateProducts from "./pages/admin/update-products";

import SecondTestProductPage from './pages/testProductPagesecond';
import HomeBrandGrid from './components/Products/HomeBrandGrid';
import ProtectedRoute from './components/ProtectedRoute';
import EmbroideredDynamicPage from './pages/EmbroideredDynamicPage';
import SiteMap from './pages/SiteMap';
import FAQSection from './components/FAQSection';
import Breadcrumbs from './components/ui/Breadcrumbs';

// Custom Apparel Category Pages
import EmbroideredApparelPage from './pages/CustomApparel/EmbroideredApparelPage';
import PrintedApparelPage from './pages/CustomApparel/PrintedApparelPage';
import CustomHeadwearPage from './pages/CustomApparel/CustomHeadwearPage';
import CustomBagsPage from './pages/CustomApparel/CustomBagsPage';
import AccessoriesPage from './pages/CustomApparel/AccessoriesPage';
import BrandsPage from './pages/CustomApparel/BrandsPage';

function AppContent() {
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [loadingAccessories, setLoadingAccessories] = useState(true);
  const [outerwear, setOuterwear] = useState<Product[]>([]);
  const [loadingOuterwear, setLoadingOuterwear] = useState(true);
  const [headwear, setHeadwear] = useState<Product[]>([]);
  const [loadingHeadwear, setLoadingHeadwear] = useState(true);
  const location = useLocation();
  const isHome = location.pathname === '/';

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
    <div className="min-h-screen bg-white text-[#222]">
      <Header />
      {!isHome && <Breadcrumbs />}
      <main>
        <Routes>
          <Route path="/" element={
            <>
              {/* SEO-Optimized Static Hero Section - First for Search Engines */}
              <Hero />
              
              {/* Top Categories Mesh - Above the fold per Figma requirement */}
              <TopCategoriesMesh />
              
              {/* SEO Content Above The Fold */}
              <SEOContentSection />
              
              {/* Interactive Content & Sliders Below The Fold */}
              <div className="space-y-12">
                {/* Brand Grid (Previously at top, now moved below hero) */}
                <HomeBrandGrid />
                
                {/* Trust Signals Section */}
                <TrustSignalsSection />
                
                {/* Product Sections (moved below static content for SEO) */}
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
                
                {/* Internal Categories Mesh - Additional mesh section */}
                <InternalCategoriesMesh />
                
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
                
                {/* FAQ Section added to home page */}
                <FAQSection />
              </div>
            </>
          } />
          {/* Add static embroidered routes first */}
          <Route path="/custom-embroidered-polo" element={<EmbroideredDynamicPage />} />
          <Route path="/custom-embroidered-hoodie" element={<EmbroideredDynamicPage />} />
          <Route path="/custom-embroidered-t-shirt" element={<EmbroideredDynamicPage />} />
          <Route path="/custom-embroidered-sweatshirt" element={<EmbroideredDynamicPage />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/custom-embroidered-:type" element={<EmbroideredDynamicPage />} />
          <Route path="/custom/custom-embroidered-:type" element={<EmbroideredDynamicPage />} />
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
          <Route path="/category/:category" element={
            <>
              <DynamicCategoryPage />
              <FAQSection />
            </>
          } />
          <Route path="/:category" element={<CategoryPage />} />
          <Route path="/product/:sku" element={<DynamicProductPage />} />
          <Route path='/brands/:category' element={<DynamicBrands/>} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          } />
          <Route path="/search" element={<SearchProducts/>} />
          <Route path="/update" element={<UpdateProducts/>} />
          <Route path="/3dproducts/:sku" element={<ThreeDProducts />} />
          <Route path='/all-brands' element={<AllBrandPage/>} />
          <Route path='/all-categories' element={<AllCategoriesPage/>} />
          <Route path="/sitemap" element={<SiteMap />} />
          {/* Custom Apparel Category Pages */}
          <Route path="/custom-apparel/embroidered-apparel" element={<EmbroideredApparelPage />} />
          <Route path="/custom-apparel/printed-apparel" element={<PrintedApparelPage />} />
          <Route path="/custom-apparel/custom-headwear" element={<CustomHeadwearPage />} />
          <Route path="/custom-apparel/custom-bags" element={<CustomBagsPage />} />
          <Route path="/custom-apparel/accessories" element={<AccessoriesPage />} />
          <Route path="/custom-apparel/brands" element={<BrandsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;

// ---
// TopCategoriesMesh component - Above the fold as per Figma requirement
function TopCategoriesMesh() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('http://31.97.41.27:5000/api/styles/base-categories');
        const data = await res.json();
        setCategories(data.baseCategories || []);
      } catch {
        setCategories([]);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="text-center text-blue-700">Loading top categories...</div>
    </div>
  );

  return (
    <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
        <p className="text-gray-600">Find exactly what you're looking for</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {categories.slice(0, 12).map((cat) => (
          <div
            key={cat}
            className="group flex items-center justify-center h-20 rounded-xl border-2 border-blue-100 bg-white text-center font-semibold text-gray-900 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer hover:border-[#4DB8E7] hover:bg-gradient-to-r hover:from-[#4DB8E7] hover:to-[#3ab7ea] hover:text-white transform hover:-translate-y-1 px-3"
            style={{ boxShadow: '0 2px 8px 0 rgba(77,184,231,0.04)' }}
            tabIndex={0}
            role="button"
            aria-label={`Browse ${cat} category`}
          >
            <span className="text-sm lg:text-base font-medium leading-tight">{cat}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---
// InternalCategoriesMesh component - Additional mesh section for homepage
function InternalCategoriesMesh() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('http://31.97.41.27:5000/api/styles/base-categories');
        const data = await res.json();
        setCategories(data.baseCategories || []);
      } catch {
        setCategories([]);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="text-center text-blue-700">Loading categories...</div>
    </div>
  );

  const specialCategories = [
    { name: 'Custom Embroidered Apparel', description: 'Professional embroidery for businesses and teams', color: 'from-blue-500 to-purple-600' },
    { name: 'Custom Printed Apparel', description: 'High-quality screen printing and digital prints', color: 'from-green-500 to-teal-600' },
    { name: 'Custom Headwear', description: 'Hats, caps, and beanies with your logo', color: 'from-orange-500 to-red-600' },
    { name: 'Custom Outerwear', description: 'Jackets, hoodies, and vests for all seasons', color: 'from-indigo-500 to-blue-600' },
    { name: 'Custom Bags', description: 'Backpacks, totes, and promotional bags', color: 'from-pink-500 to-purple-600' },
    { name: 'Accessories', description: 'Complete your look with custom accessories', color: 'from-yellow-500 to-orange-600' }
  ];

  return (
    <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Explore Our Custom Categories</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">From corporate apparel to team uniforms, we've got everything you need to make your brand stand out</p>
      </div>
      
      {/* Special Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {specialCategories.map((category) => (
          <div
            key={category.name}
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <div className="relative p-8 text-white">
              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              <p className="text-white/90 text-sm leading-relaxed">{category.description}</p>
              <div className="mt-4 inline-flex items-center text-sm font-medium">
                Shop Now 
                <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Categories Mesh */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">More Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.slice(6, 18).map((cat) => (
            <div
              key={cat}
              className="flex items-center justify-center h-14 rounded-lg border border-gray-200 bg-white text-center font-medium text-gray-700 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer hover:border-blue-300 hover:text-blue-600 transform hover:-translate-y-0.5 px-2"
              tabIndex={0}
              role="button"
              aria-label={`Browse ${cat} category`}
            >
              <span className="text-xs lg:text-sm leading-tight">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---
// SEOContentSection component - Static content for better SEO
function SEOContentSection() {
  return (
    <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-16 bg-gradient-to-r from-blue-50 to-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Why Choose Our Custom Embroidered Apparel?
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              We specialize in high-quality custom embroidered apparel perfect for businesses, teams, 
              and organizations. Our state-of-the-art embroidery equipment ensures crisp, professional 
              results on every garment.
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>No minimum order requirements - order as few as one piece</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Free setup on all embroidery orders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Fast turnaround - most orders completed within 7-10 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Professional digitizing service for complex logos</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">24hr</div>
            <div className="text-gray-600">Logo Review</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-gray-600">Quality Guarantee</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">Free</div>
            <div className="text-gray-600">Shipping $200+</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---
// TrustSignalsSection component (add above App or in a separate file and import it)
function TrustSignalsSection() {
  return (
    <section className="w-full max-w-6xl mx-auto my-8 px-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow flex flex-col md:flex-row items-center justify-between py-6 px-4 md:px-12 gap-6">
        <div className="flex-1 flex flex-col items-center text-center">
          <img src="/trust/76ers.png" alt="76ers Partner" className="h-12 mb-2 object-contain" />
          <span className="text-xs text-gray-600">Official Partner of the Philadelphia 76ers</span>
        </div>
        <div className="flex-1 flex flex-col items-center text-center">
          <img src="/trust/inc5000.png" alt="Inc 5000" className="h-12 mb-2 object-contain" />
          <span className="text-xs text-gray-600">One of the Fastest Growing Private Companies in America</span>
        </div>
        <div className="flex-1 flex flex-col items-center text-center">
          <img src="/trust/nyt.png" alt="NY Times" className="h-12 mb-2 object-contain" />
          <span className="text-xs text-gray-600">Featured in the New York Times Business Section</span>
        </div>
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <img src="/trust/bbb.png" alt="BBB Accredited" className="h-8 object-contain" />
            <img src="/trust/a-plus.png" alt="A+ Rating" className="h-8 object-contain" />
          </div>
          <span className="text-xs text-gray-600">BBB Accredited Business</span>
        </div>
      </div>
    </section>
  );
}