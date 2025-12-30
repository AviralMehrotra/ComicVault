import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const Rating = ({
  initialRating = 0,
  maxRating = 5,
  onRate,
  readOnly = false,
  size = "md",
  className,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = (newRating) => {
    if (readOnly) return;
    setRating(newRating);
    if (onRate) onRate(newRating);
  };

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = (hoverRating || rating) >= starValue;

        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              "transition-colors duration-200",
              readOnly ? "cursor-default" : "cursor-pointer",
              isFilled
                ? "fill-chart-4 text-chart-4"
                : "fill-transparent text-muted-foreground/30",
              !readOnly && "hover:text-chart-4"
            )}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            onClick={() => handleRate(starValue)}
          />
        );
      })}
    </div>
  );
};

export default Rating;
