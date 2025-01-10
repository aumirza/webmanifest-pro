import React from "react";

interface CopyCodeProps {
  width?: string;
  height?: string;
  children: React.ReactNode;
}

export const CopyCode: React.FC<CopyCodeProps> = ({
  width,
  height,
  children,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyHandler = () => {
    if (!children) return;
    navigator.clipboard.writeText(children.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div
      style={{ width, height }}
      className="relative w-full p-4 overflow-auto text-white bg-gray-900 border dark:border-gray-400 rounded-2xl group"
    >
      <button
        onClick={copyHandler}
        className="absolute p-2 text-white transition-all duration-200 ease-in-out bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 top-2 right-2"
      >
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        )}
      </button>
      <pre>
        <code className="whitespace-pre-wrap">{children}</code>
      </pre>
    </div>
  );
};
