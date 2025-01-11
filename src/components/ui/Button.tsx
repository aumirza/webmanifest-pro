import { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    PropsWithChildren {}

export const Button: FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`p-3 px-5 font-bold transition duration-200 ease-in-out bg-gray-300 border-2 border-gray-400 rounded-full shadow-lg dark:border-gray-700 hover:bg-gray-400 dark:text-gray-300 dark:bg-gray-500 dark:hover:bg-gray-400 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
