"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

const categories = [
  { id: "all", name: "All Products", count: 1250 },
  { id: "shirts", name: "Shirts", count: 320 },
  { id: "dresses", name: "Dresses", count: 180 },
  { id: "coats", name: "Coats", count: 95 },
  { id: "jackets", name: "Jackets", count: 150 },
  { id: "hoodies", name: "Hoodies", count: 85 },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Gray", value: "#6B7280" },
  { name: "Brown", value: "#92400E" },
  { name: "Blue", value: "#1E40AF" },
  { name: "Green", value: "#059669" },
];

export default function ProductFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Local state initialized from URL
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("min") || 0),
    Number(searchParams.get("max") || 500),
  ]);
  const [selectedSize, setSelectedSize] = useState(
    searchParams.get("size") || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    searchParams.get("color") || ""
  );

  // Sync state to URL
  const updateURL = (newParams = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    // Merge new params
    Object.entries(newParams).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`);
  };

  const onCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    updateURL({ category: categoryId === "all" ? "" : categoryId });
  };

  const onPriceRangeChange = (range) => {
    setPriceRange(range);
    updateURL({ min: range[0], max: range[1] });
  };

  const onSizeChange = (size) => {
    const newSize = selectedSize === size ? "" : size;
    setSelectedSize(newSize);
    updateURL({ size: newSize });
  };

  const onColorChange = (color) => {
    const newColor = selectedColor === color ? "" : color;
    setSelectedColor(newColor);
    updateURL({ color: newColor });
  };

  const onClearFilters = () => {
    setSelectedCategory("all");
    setPriceRange([0, 500]);
    setSelectedSize("");
    setSelectedColor("");
    router.push("?");
  };

  return (
    <div className="space-y-6 max-h-[calc(100vh-100px)] overflow-y-auto pr-2">
      {/* Categories */}
      <div>
        <h4 className="font-medium text-sm text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedCategory === category.id
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{category.name}</span>
                <span className="text-xs opacity-60">({category.count})</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-sm text-gray-900 mb-3">Price Range</h4>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            max={500}
            min={0}
            step={10}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Sizes */}
      <div>
        <h4 className="font-medium text-sm text-gray-900 mb-3">Sizes</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0 text-xs"
              onClick={() => onSizeChange(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div>
        <h4 className="font-medium text-sm text-gray-900 mb-3">Colors</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              className={`w-8 h-8 rounded-full border-2 transition-colors ${
                selectedColor === color.name
                  ? "border-black"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
              onClick={() => onColorChange(color.name)}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Clear Filters */}
      <Button variant="outline" className="w-full" onClick={onClearFilters}>
        Clear All Filters
      </Button>
    </div>
  );
}
