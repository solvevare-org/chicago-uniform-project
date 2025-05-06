import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ProductGrid from './components/Products/ProductGrid';
import Footer from './components/Footer/Footer';
import { recommendedProducts, trendingProducts } from './data/products';
import LoginScreen from './components/Auth/LoginScreen';
import SignupScreen from './components/Auth/SignupScreen';
import ForgotPasswordScreen from './components/Auth/ForgotPasswordScreen';
import HowItWorks from './components/HowItWorks/HowItWorks';
import ProductPage from './components/Products/ProductPage';
import CategoryPage from './components/Category/CategoryPage';
import WishlistPage from './components/Products/WishlistPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#121212] text-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <ProductGrid 
                  title="Recommended For You" 
                  products={recommendedProducts}
                  infoIcon={true}
                />
                <ProductGrid 
                  title="Trending Products" 
                  products={trendingProducts}
                />
              </>
            } />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;