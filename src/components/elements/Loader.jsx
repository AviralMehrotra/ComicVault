import React from "react";

const Loader = ({ className = "" }) => {
  return (
    <div className={`fixed inset-0 flex justify-center items-center bg-background/80 backdrop-blur-sm z-50 ${className}`}>
      <div className="w-32 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(oklch(0.95_0.03_85)_0deg,oklch(0.95_0.03_85)_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(oklch(0.95_0.03_85)_0deg,oklch(0.95_0.03_85)_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(oklch(0.6_0.15_250)_0deg,oklch(0.6_0.15_250)_180deg,transparent_180deg,transparent_360deg)]">
        <span className="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(oklch(0.6_0.15_20)_0deg,oklch(0.6_0.15_20)_180deg,transparent_180deg,transparent_360deg)]"></span>
      </div>
    </div>
  );
};

// Higher-order component to add fade-in effect to content
export const WithFadeIn = ({ children, isLoading, className = "" }) => {
  return (
    <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}>
      {children}
    </div>
  );
};

export default Loader;
