import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilter";
import Pagination from "../ui/Pagination";
import { getProducts } from "@/services/products.service";
import ReusableModal from "../ui/ReusableModal";
import UrlSearchInput from "../ui/UrlSearchInput";

export default async function ProductListing() {
  const { products } = await getProducts();
  if (!products) return null;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
        {/* Search Input */}
        <UrlSearchInput placeholder="Search products..." />

        {/* Filters Button */}
        <div className="w-full lg:w-auto">
          <ReusableModal
            Trigger={
              <Button
                variant="outline"
                className="w-full lg:w-auto flex items-center py-5 gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            }
          >
            <ProductFilters />
          </ReusableModal>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Showing {products.length} products</p>
          </div>

          <div
            className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 }`}
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12">
            {/* <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
              /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
