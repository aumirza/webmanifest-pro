import Link from "next/link";
import React from "react";

export const SuccessMessage = () => {
  return (
    <div className="flex flex-col items-center gap-5">
      <div
        className="border-2 border-blue-200 text-white px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Success!</strong>
        <span className="block sm:inline"> Your image has been generated.</span>
      </div>
      <div className="">
        <a
          href="/"
          className="border-white border-2 text-white  hover:bg-blue-700  font-bold py-2 px-4 rounded"
        >
          Generate another image
        </a>
      </div>
    </div>
  );
};
