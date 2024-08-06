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
      className="relative border rounded-md bg-gray-900 p-4 text-white overflow-auto"
    >
      <button
        onClick={copyHandler}
        className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre>
        <code className="whitespace-pre-wrap">{children}</code>
      </pre>
    </div>
  );
};
