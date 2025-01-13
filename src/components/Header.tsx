import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import webmanifestLogo from "@/assets/images/webmanifest-pro-logo.png";

export const Header = () => {
  return (
    <header className="h-20 dark:text-white">
      <div className="flex items-center justify-between w-11/12 h-full max-w-6xl mx-auto ">
        <div className="flex gap-2">
          <Image src={webmanifestLogo} alt="logo" width={40} height={40} />
          <Link href="/">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white md:text-4xl ">
              Webmanifest&nbsp;
              <span className="pb-1 border-b-[.4rem] border-primary">pro</span>
            </h1>
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};
