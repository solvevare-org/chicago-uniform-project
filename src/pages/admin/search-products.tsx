import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { authenticatedApiRequest } from "@/lib/auth";

export default function SearchProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data;
        if (search.trim() !== "") {
          // Use the new search endpoint
          const res = await fetch(
            `http://localhost:3000/api/products/search?q=${encodeURIComponent(
              search
            )}`
          );
          data = await res.json();
        } else {
          const res = await authenticatedApiRequest("GET", "/api/products");
          data = await res.json();
        }
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await authenticatedApiRequest("GET", "/api/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary">Search Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:w-1/2"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <div className="text-center py-8 text-[#2563eb]">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-[#2563eb]">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-accent transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-foreground">
                          {product.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.color} - Size {product.size}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {product.category}
                      </td>
                      <td className="px-6 py-4">
                        <Badge>
                          {product.quantityInStock > 0
                            ? `In Stock (${product.quantityInStock})`
                            : "Out of Stock"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        ${product.sellingPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
