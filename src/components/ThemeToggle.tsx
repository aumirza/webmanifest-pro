import React from "react";

export const ThemeToggle = () => {
  const toggleTheme = () => {
    const body = document.querySelector("body");
    body.classList.toggle("dark");
  };

  return (
    <div>
      <button
        onClick={toggleTheme}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      >
        Toggle Theme
      </button>
    </div>
  );
};
