import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Utility to fetch categories and subcategories from backend (similar to Header)
async function fetchCategories() {
  const res = await fetch("http://localhost:3000/api/styles/base-categories");
  const data = await res.json();
  return data.baseCategories || [];
}

async function fetchSubcategories(category: string) {
  const res = await fetch(
    `http://localhost:3000/api/styles/subcategories?category=${encodeURIComponent(
      category
    )}`
  );
  const data = await res.json();
  return data.subcategories || [];
}

const SiteStructure: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<Record<string, string[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const cats = await fetchCategories();
      setCategories(cats);
      // Fetch subcategories for each top category
      const subcatObj: Record<string, string[]> = {};
      await Promise.all(
        cats.map(async (cat: string) => {
          const subs = await fetchSubcategories(cat);
          subcatObj[cat] = subs.map((s: any) => s.name || s);
        })
      );
      setSubcategories(subcatObj);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="p-8 text-blue-700">Loading site structure...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Site Structure</h1>
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat}>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg text-blue-700">{cat}</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Hybrid Product Listing Page Model
              </span>
              <Link
                to={`/category/${encodeURIComponent(cat)}`}
                className="text-blue-500 underline ml-2"
              >
                View
              </Link>
            </div>
            {subcategories[cat] && subcategories[cat].length > 0 && (
              <ul className="ml-8 mt-2 space-y-1">
                {subcategories[cat].map((sub) => (
                  <li key={sub} className="flex items-center gap-2">
                    <span className="text-gray-700">{sub}</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Product Listing Page Model
                    </span>
                    <Link
                      to={`/category/${encodeURIComponent(
                        cat
                      )}/${encodeURIComponent(sub)}`}
                      className="text-blue-400 underline ml-2"
                    >
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteStructure;
