"use client";

import { useState } from "react";
import { Star, ThumbsUp, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reviews = [
  {
    id: 1,
    author: "Darnell Steward",
    avatar: "/placeholder.svg?height=32&width=32",
    rating: 5,
    date: "July 2, 2020 03:29 PM",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi exercitationem eum vero doloremque molestias dicta animi nesciunt asperiores labore facere modi quas, illum quis alias odit iusto quisquam voluptatem unde voluptatum nemo earum quibusdam! Minima blanditiis nulla quibusdam libero perferendis?",
    helpful: 128,
  },
  {
    id: 2,
    author: "Darlene Robertson",
    avatar: "/placeholder.svg?height=32&width=32",
    rating: 5,
    date: "July 2, 2020 1:04 PM",
    content: "This is amazing product I have.",
    helpful: 62,
  },
  {
    id: 3,
    author: "Kathryn Murphy",
    avatar: "/placeholder.svg?height=32&width=32",
    rating: 5,
    date: "June 28, 2020 10:03 PM",
    content: "This is amazing product I have.",
    helpful: 9,
  },
  {
    id: 4,
    author: "Ronald Richards",
    avatar: "/placeholder.svg?height=32&width=32",
    rating: 5,
    date: "July 7, 2020 1:04 AM",
    content: "This is amazing product I have.",
    helpful: 124,
  },
];

const ratingBreakdown = [
  { stars: 5, count: 2823, percentage: 85 },
  { stars: 4, count: 38, percentage: 12 },
  { stars: 3, count: 4, percentage: 2 },
  { stars: 2, count: 0, percentage: 0 },
  { stars: 1, count: 0, percentage: 0 },
];

export default function ProductReviews() {
  const [activeFilter, setActiveFilter] = useState("All Reviews");

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>

      <div className="grid lg:grid-cols-4 gap-8 relative">
        {/* Rating Summary - Back to Old Design */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Overall Rating */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">4.5</div>
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 fill-orange-400 text-orange-400"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">from 1.25k reviews</p>
            </div>

            {/* Rating Breakdown - Old Vertical Design */}
            <div className="space-y-2">
              {ratingBreakdown.map((rating) => (
                <div
                  key={rating.stars}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="w-3">{rating.stars}</span>
                  <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full"
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right">{rating.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {["All Reviews", "Recent"].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full transition-all ${
                    activeFilter === filter
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  {filter}
                </Button>
              ))}
            </div>

            <Select defaultValue="newest">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
                <SelectItem value="rating-high">Highest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Simple Review Cards - Match Image Design */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border border-gray-100 p-5 bg-white space-y-4"
              >
                {/* Stars & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-orange-400 text-orange-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>

                {/* Review Content */}
                <p className="text-sm text-gray-800 leading-relaxed">
                  {review.content}
                </p>

                {/* User Info & Actions */}
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-3 mt-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {review.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900">
                      {review.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.helpful}</span>
                    </button>
                    <button className="text-xs text-gray-500 hover:text-red-500 transition-colors">
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 rounded-full border-gray-300 hover:border-gray-400 bg-transparent"
            >
              Load More Reviews
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
