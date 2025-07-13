import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import ProductInfo from "@/components/products/ProductInfo";
import ProductReviews from "@/components/reviews/ProductReviews";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/NavBar";
import { getProductById } from "@/services/products.service";
// import { useState } from "react";

export default async function ProductPage({ params }) {
  // const [currentImages, setCurrentImages] = useState();

  // const handleColorChange = (color, images) => {
  //   setCurrentImages(images);
  // };

  const { productId } = await params;

  const product = await getProductById(productId);
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-7 py-8">
        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="order-1">
            <ProductImageGallery images={product.images} />
          </div>

          <div className="order-2">
            <ProductInfo product={product} />
          </div>
        </div>

        <ProductReviews />
      </div>
    </div>
  );
}
