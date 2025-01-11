import React, { MouseEventHandler, useState } from "react";

export interface ITree {
  name: string;
  children?: ITree[];
  type: "file" | "folder";
  subType?: "image" | "text" | "zip" | "zipFolder";
}

const FolderIcon = () => (
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
    className="lucide lucide-folder"
  >
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
);

const FolderIconClosed = () => (
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
    className="lucide lucide-folder-closed"
  >
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    <path d="M2 10h20" />
  </svg>
);

const FileIcon = () => (
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
    className="lucide lucide-file"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </svg>
);

const ImageFileIcon = () => (
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
    className="lucide lucide-file-image"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <circle cx="10" cy="12" r="2" />
    <path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22" />
  </svg>
);

const TextFileIcon = () => (
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
    className="lucide lucide-file-text"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

const ZipFolderIcon = () => (
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
    className="lucide lucide-folder-archive"
  >
    <circle cx="15" cy="19" r="2" />
    <path d="M20.9 19.8A2 2 0 0 0 22 18V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5.1" />
    <path d="M15 11v-1" />
    <path d="M15 17v-2" />
  </svg>
);

const ZipFileIcon = () => (
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
    className="lucide lucide-file-archive"
  >
    <path d="M10 12v-1" />
    <path d="M10 18v-2" />
    <path d="M10 7V6" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M15.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 .274 1.01" />
    <circle cx="10" cy="20" r="2" />
  </svg>
);

const folderTypeIconMap: {
  [key: string]: { open: JSX.Element; closed: JSX.Element };
} = {
  folder: {
    open: <FolderIcon />,
    closed: <FolderIconClosed />,
  },
  zipFolder: {
    open: <ZipFolderIcon />,
    closed: <ZipFolderIcon />,
  },
};

const typeIconMap: { [key: string]: JSX.Element } = {
  file: <FileIcon />,
  image: <ImageFileIcon />,
  text: <TextFileIcon />,
  zip: <ZipFileIcon />,
};

export const FileTree = ({ structure }: { structure: ITree }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen: MouseEventHandler = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex items-center gap-2 p-1 transition-all duration-100 ease-in-out rounded cursor-pointer hover:shadow-md hover:bg-slate-700"
        onClick={toggleOpen}
      >
        <div className="flex items-center justify-center gap-2">
          {structure.type === "folder" ? (
            <span>
              {isOpen
                ? folderTypeIconMap[structure.subType ?? structure.type].open
                : folderTypeIconMap[structure.subType ?? structure.type].closed}
            </span>
          ) : (
            <span>{typeIconMap[structure.subType ?? structure.type]}</span>
          )}
          <span>{structure.name}</span>
        </div>
      </div>
      {structure.type === "folder" && structure.children?.length && (
        <div className="ml-5 border-l-2">
          <div className="flex flex-col gap-2 pl-5">
            {isOpen &&
              structure.children.map((child) => (
                <FileTree key={child.name} structure={child} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
