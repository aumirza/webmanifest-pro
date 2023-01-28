import React from "react";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  return (
    <div className="flex justify-between items-center h-16 bg-black text-white">
      <div className="logo">
        <h1 className="text-2xl">Logo</h1>
      </div>
      <ThemeToggle />
    </div>
  );
};
