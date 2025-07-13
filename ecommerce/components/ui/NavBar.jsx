"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./Logo";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartCount = 0;

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="bg-white border-b py-1 border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Logo />

            <div className="hidden md:flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <div className="flex items-center animate-in slide-in-from-right-5 duration-300">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search for products..."
                      className="w-64 pr-10 border-gray-300 rounded-full focus:ring-0 focus:ring-offset-0 focus:border-black outline-none"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-gray-100"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sign In */}
              <Link
                href="#"
                className="flex p-3 items-center gap-2 bg-gray-100 rounded-full"
              >
                <User className="h-4 w-4" />
              </Link>

              {/* Wishlist */}
              <Link
                href="#"
                className="flex p-3 items-center gap-2 bg-gray-100 rounded-full"
              >
                <Heart className="h-4 w-4" />
              </Link>

              {/* Cart */}
              <Link
                href="#"
                className="flex p-3 items-center gap-2 bg-gray-100 rounded-full"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-100 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop with blur - covers remaining area */}
          <div
            className="fixed inset-0 top-16 bg-black/20 backdrop-blur-md z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-white z-50 md:hidden animate-in slide-in-from-top-5 duration-300 shadow-xl">
            <div className="p-4 flex flex-col gap-5">
              {/* Search */}
              <div className="relative mb-3">
                <Input
                  type="search"
                  placeholder="Search for products..."
                  className="w-full pr-10 border-gray-300 py-5 rounded-full focus:ring-0 focus:ring-offset-0 focus:border-black outline-none"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              <hr className="border-gray-200" />

              {/* Navigation Links */}
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base py-3 hover:bg-gray-100 rounded-md"
                >
                  <ChevronDown className="h-5 w-5 mr-3" />
                  Categories
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base py-3 hover:bg-gray-100 rounded-md"
                >
                  <User className="h-5 w-5 mr-3" />
                  Sign in
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base py-3 hover:bg-gray-100 rounded-md"
                >
                  <Heart className="h-5 w-5 mr-3" />
                  Wishlist
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base py-3 hover:bg-gray-100 rounded-md relative"
                >
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
