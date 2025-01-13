import React, { useCallback, useEffect, useRef, useState } from "react";

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

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();

      const files = e.dataTransfer?.files;

      setDragging(false);

      if (files?.length) uploadHandler(files[0]);
    },
    [uploadHandler]
  );

  const pasteHandler = useCallback(
    (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text");
      const clipboardItems = e.clipboardData?.items as DataTransferItemList;

      const image =
        clipboardItems[0].kind === "file"
          ? clipboardItems[0].getAsFile()
          : null;

      if (image) {
        uploadHandler(image);
        return;
      }

      const IMAGE_URL_EXP =
        /^http[^?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim;
      if (text && text.match(IMAGE_URL_EXP)) {
        fetch(text)
          .then((res) => res.blob())
          .then((blob) => new File([blob], "image.png"))
          .then((file) => uploadHandler(file));
      }
    },
    [uploadHandler]
  );

  useEffect(() => {
    const onDragOver = (e: DragEvent) => handleDragOver(e);
    const onDragEnter = (e: DragEvent) => handleDragEnter(e);
    const onDragLeave = (e: DragEvent) => handleDragLeave(e);
    const onDrop = (e: DragEvent) => handleDrop(e);
    const onPaste = (e: ClipboardEvent) => pasteHandler(e);

    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    window.addEventListener("paste", onPaste as EventListener);

    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("paste", onPaste as EventListener);
    };
  }, [handleDrop, pasteHandler]);

  return dragging ? (
    <div className="fixed top-0 left-0 z-10 w-full h-full p-3">
      <div
        ref={overlayRef}
        className="flex items-center justify-center h-full bg-black border-2 border-dashed bg-opacity-20"
        onDragLeave={(e) => handleDragLeave(e as unknown as DragEvent)}
      >
        <span className="text-4xl text-white select-none">Drop Here</span>
      </div>
    </div>
  ) : null;
};
