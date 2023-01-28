import React, { useEffect, useRef, useState } from "react";

interface DragAndPasteUploaderProps {
  uploadHandler: (file: File) => void;
}

export const DragAndPasteUploader: React.FC<DragAndPasteUploaderProps> = ({
  uploadHandler,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target !== overlayRef.current) setDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target === overlayRef.current) setDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const files = e.dataTransfer?.files;

    setDragging(false);

    if (files?.length) uploadHandler(files[0]);
  };

  const pasteHandler = (e: ClipboardEvent) => {
    const text = e.clipboardData?.getData("text");
    const clipboardItems = e.clipboardData?.items as DataTransferItemList;

    const image =
      clipboardItems[0].kind === "file" ? clipboardItems[0].getAsFile() : null;

    if (image) {
      uploadHandler(image);
      return;
    }

    const IMAGE_URL_EXP = /^http[^?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim;
    if (text && text.match(IMAGE_URL_EXP)) {
      fetch(text)
        .then((res) => res.blob())
        .then((blob) => new File([blob], "image.png"))
        .then((file) => uploadHandler(file));
    }
  };

  useEffect(() => {
    window.addEventListener("paste", pasteHandler as EventListener);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);

    return () => {
      window.removeEventListener("paste", pasteHandler as EventListener);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  return dragging ? (
    <div className="absolute z-10 h-full w-full p-3">
      <div
        ref={overlayRef}
        className="flex justify-center items-center h-full bg-black bg-opacity-20 border-2 border-dashed"
      >
        <span className="text-white text-4xl">Drop Here</span>
      </div>
    </div>
  ) : null;
};
