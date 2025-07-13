import ProductListing from "@/components/products/ProductList";
async function page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Millions of Products
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover the latest fashion trends and timeless classics from top
            brands around the world
          </p>
        </div>
      </div>
      <ProductListing />
    </div>
  );
}

export default page;
