import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SiteMap: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:3000/api/styles/base-categories"
        );
        const data = await res.json();
        setCategories(data.baseCategories || []);
      } catch {
        setCategories([]);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return <div className="p-8 text-blue-700">Loading site structure...</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Site Structure</h1>
      <ul className="space-y-6">
        {categories.map((cat) => (
          <li key={cat}>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg text-[#2563eb]">
                {cat}
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Hybrid PLP
              </span>
              <Link
                to={`/category/${cat}`}
                className="ml-2 text-blue-500 underline"
              >
                View
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SiteMap;
