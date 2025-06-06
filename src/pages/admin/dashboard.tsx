import { useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";
import SearchProducts from "./search-products";
import UpdateProducts from "./update-products";

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const [tab, setTab] = useState<'search' | 'orders'>('search');

  const getPageTitle = () => {
    switch (tab) {
      case "search":
        return "Product Search";
      case "orders":
        return "Orders Management";
      default:
        return "Dashboard";
    }
  };

  const getPageDescription = () => {
    switch (tab) {
      case "search":
        return "Search and view your uniform inventory.";
      case "orders":
        return "View and update pending orders.";
      default:
        return "Manage your uniform inventory.";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <Header 
          title={getPageTitle()} 
          description={getPageDescription()} 
        />
        <main className="p-6">
          <div className="flex gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded ${tab === 'search' ? 'bg-primary text-white' : 'bg-muted text-primary'}`}
              onClick={() => setTab('search')}
            >
              Search Products
            </button>
            <button
              className={`px-4 py-2 rounded ${tab === 'orders' ? 'bg-primary text-white' : 'bg-muted text-primary'}`}
              onClick={() => setTab('orders')}
            >
              Orders Management
            </button>
          </div>
          {tab === 'search' && <SearchProducts />}
          {tab === 'orders' && <UpdateProducts />}
        </main>
      </div>
    </div>
  );
}
