"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const isActive = product.status === "active";

  const CardContent = () => (
    <div
      className={`group relative bg-white rounded-lg overflow-hidden transition-all duration-300 ${
        isActive ? "cursor-pointer" : "cursor-not-allowed"
      } ${!isActive ? "opacity-50" : ""}`}
    >
      <div className="relative h-72 bg-gray-100 overflow-hidden">
        <Image
          src={
            product?.images.length > 0
              ? product?.images[0]
              : "/No_Image_Available.jpg"
          }
          alt={product?.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* {isActive && isHovered && (
          <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center gap-2 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white hover:bg-gray-100"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white hover:bg-gray-100"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        )} */}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 text-sm leading-tight">
            {product?.name}
          </h3>
          <div className="text-right">
            <p className="font-bold text-gray-900">${product?.price}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isActive) {
    return <CardContent />;
  }

  return (
    <Link href={`/products/${product._id}`}>
      <CardContent />
    </Link>
  );
}
