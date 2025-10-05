import React from "react";

export function AppBar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0099A8] via-[#00B4D8] to-[#48CAE4] shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img src="/favicon.ico" alt="Logo" className="h-8 w-8 rounded" />
          <span className="text-xl font-bold text-white tracking-wide drop-shadow-sm">UW Workbench Portal</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Placeholder for navigation links */}
          <span className="text-white/80 font-medium hover:text-white transition-colors cursor-pointer">Dashboard</span>
          <span className="text-white/80 font-medium hover:text-white transition-colors cursor-pointer">Work Items</span>
          <span className="text-white/80 font-medium hover:text-white transition-colors cursor-pointer">Reports</span>
          {/* User avatar/profile */}
          <div className="ml-4 flex items-center gap-2">
            <img src="https://ui-avatars.com/api/?name=User&background=0099A8&color=fff" alt="User" className="h-9 w-9 rounded-full border-2 border-white shadow" />
            <span className="text-white font-medium">Alex</span>
          </div>
        </div>
      </div>
    </header>
  );
}
