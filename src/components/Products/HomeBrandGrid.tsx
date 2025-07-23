import React, { useEffect, useState } from "react";
import BrandGrid from "./BrandGrid";

const HomeBrandGrid: React.FC = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      setLoading(true);
      try {
        const res = await fetch("http://31.97.41.27:5000/api/brands/");
        const data = await res.json();
        setBrands(Array.isArray(data.brands) ? data.brands.slice(0, 8) : []);
      } catch (e) {
        setBrands([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  if (loading)
    return <div className="text-gray-400 px-4 py-8">Loading brands...</div>;
  if (!brands || brands.length === 0)
    return <div className="text-red-400 px-4 py-8">No brands found.</div>;

  return <BrandGrid title="Popular Brands" brands={brands} />;
};

export default HomeBrandGrid;
