"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function UrlSearchInput({ placeholder = "Search..." }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    const params = new URLSearchParams(searchParams.toString());
    if (newQuery.trim()) {
      params.set("search", newQuery.trim());
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative w-full lg:flex-1 md:max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        className="pl-10 py-5"
      />
    </div>
  );
}
