"use client";

import { useState } from "react";
import { Facebook, Instagram, Twitter, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

const footerLinks = {
  Shop: ["My account", "Login", "Wishlist", "Cart"],
  Information: [
    "Shipping Policy",
    "Returns & Refunds",
    "Cookies Policy",
    "Frequently asked",
  ],
  Company: ["About us", "Privacy Policy", "Terms & Conditions", "Contact Us"],
};

export default function Footer() {
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("USD");

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto md:px-0 px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 px-4">
          {/* Logo and Socials */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <Logo />
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 rounded-full"
              >
                <Facebook className="h-5 w-5 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 rounded-full"
              >
                <Instagram className="h-5 w-5 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 rounded-full"
              >
                <Twitter className="h-5 w-5 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 rounded-full"
              >
                <Mail className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4 text-center md:text-left">
              <h3 className="text-lg  font-semibold text-gray-900">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-black transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © John Lewis plc 2001 - 2024
            </p>

            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-4 bg-red-500 relative">
                  <div
                    className="absolute inset-0 bg-blue-600"
                    style={{
                      clipPath: "polygon(0 0, 60% 0, 40% 100%, 0% 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-white"
                    style={{
                      clipPath: "polygon(20% 0, 80% 0, 60% 100%, 40% 100%)",
                    }}
                  ></div>
                </div>
                <Button
                  variant="ghost"
                  className="text-sm p-0 h-auto font-normal hover:bg-transparent"
                >
                  {language} <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </div>

              {/* Currency Selector */}
              <Button
                variant="ghost"
                className="text-sm p-0 h-auto font-normal hover:bg-transparent"
              >
                {currency} <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
