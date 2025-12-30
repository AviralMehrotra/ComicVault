import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="h-screen bg-background flex p-4 md:p-8 gap-4 md:gap-8 overflow-hidden">
      {/* Left side - Comic background (60%) - Hidden on tablet and below */}
      <div className="hidden lg:flex flex-[3] min-w-0 relative overflow-hidden rounded-2xl shadow-xl border border-border">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("/assets/comic-background.jpg")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      {/* Right side - Auth form area (40% on desktop, 100% on mobile) */}
      <div className="flex-1 lg:flex-[2] min-w-[350px] bg-card rounded-2xl flex items-center justify-center p-6 md:p-8 shadow-xl border border-border">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
