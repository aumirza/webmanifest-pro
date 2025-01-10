import Link from "next/link";
import React from "react";

export const Footer = () => {
  return (
    <footer className="flex flex-col h-40 text-lg">
      <div className="w-full h-10">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 43.9999C106.667 43.9999 213.333 7.99994 320 7.99994C426.667 7.99994 533.333 43.9999 640 43.9999C746.667 43.9999 853.333 7.99994 960 7.99994C1066.67 7.99994 1173.33 43.9999 1280 43.9999C1386.67 43.9999 1440 19.0266 1440 9.01329V100H0V43.9999Z"
            className="text-gray-500 fill-current"
          ></path>
        </svg>
      </div>
      <div className="flex flex-col items-center flex-grow text-white bg-gray-500">
        <div className="flex items-end justify-center flex-grow">
          <div className="flex gap-1">
            <span>Made with ❤️ by</span>
            <a href="https://ahmadullah.in" className="underline">
              <span> aumirza </span>
            </a>
          </div>
        </div>
        <div className="flex justify-between w-11/12 pb-5 text-sm max-w-7xl">
          <div className="">
            <span>copyright 2025</span>
          </div>
          <ul className="flex gap-2">
            <li>
              <Link className="underline" href="/tos">
                Terms of service
              </Link>
            </li>
            <Link className="underline" href="/privacy">
              Privacy and policy
            </Link>
            <li></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
