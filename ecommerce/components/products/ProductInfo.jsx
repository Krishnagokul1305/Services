"use client";

import { Star, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TextTrimmer from "../ui/TextTrimmer";
import { format } from "date-fns";

export default function ProductInfo({ product }) {
  const isSoldOut = product.status !== "active";
  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;
  const savings = product.price - discountedPrice;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs font-medium">
              {product.brand}
            </Badge>
            <span className="text-sm text-muted-foreground">
              SKU: {product.sku}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
            {isSoldOut && (
              <Badge variant="destructive" className="text-xs">
                SOLD OUT
              </Badge>
            )}
            {product.featured && (
              <Badge className="text-xs bg-orange-500 hover:bg-orange-600">
                FEATURED
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-4">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discountPercentage > 0 && (
            <>
              <span className="text-xl text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
              <Badge variant="destructive" className="text-sm">
                {product.discountPercentage}% OFF
              </Badge>
            </>
          )}
        </div>
        {product.discountPercentage > 0 && (
          <p className="text-sm text-green-600 font-medium">
            You save ${savings.toFixed(2)}
          </p>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Description</h3>
          <TextTrimmer text={product.description} wordLimit={100} />
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        {/* Category, Status, and Published Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Category
              </span>
            </div>
            <p className="font-semibold text-gray-900">
              {product.category.name}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.status === "active" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Status
              </span>
            </div>
            <p className="font-semibold text-gray-900 capitalize flex items-center gap-2">
              {product.status}
              {product.status === "active" && (
                <span className="text-green-600 text-xs">✓</span>
              )}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Published
              </span>
            </div>
            <p className="font-semibold text-gray-900">
              {format(new Date(product.publishedAt), "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        {/* Enhanced Tags */}
        {product.tags?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            size="lg"
            className="w-full bg-black hover:bg-gray-800 text-white h-12"
            disabled={isSoldOut}
          >
            {isSoldOut ? "Out of Stock" : "Add to Cart"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 bg-transparent"
            disabled={isSoldOut}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
