interface UploaderProps {
  uploadHandler: (file: File) => void;
}

export const Uploader: React.FC<UploaderProps> = ({ uploadHandler }) => {
  const handleChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) uploadHandler(files[0]);
  };

  return (
    <div className="flex flex-col max-w-full rounded-2xl overflow-hidden shadow-3xl  h-44 w-80 md:w-[28rem] md:h-[18rem] ">
      <div className="flex items-center justify-center flex-grow p-5">
        <div className="w-full h-full border border-gray-100 border-dashed rounded dark:border-gray-500 bg-gray-50 dark:bg-gray-800">
          <label
            className="flex flex-col items-center justify-center h-full hover:cursor-pointer "
            htmlFor="image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">Browse or drop</span>
            <input
              onChange={handleChooseFile}
              id="image"
              className="h-0 opacity-0"
              type="file"
              alt=""
            />
          </label>
        </div>
      </div>

      <div className="flex items-center justify-center h-10 text-gray-700 bg-opacity-50 md:h-14 bg-slate-200">
        <span className="text-sm md:text-base">Paste image or URL</span>

        <span className="mx-1 font-mono text-xs md:text-sm">
          <span className="border p-0.5 bg-white rounded-sm">ctrl</span>
          <span> + </span>
          <span className="border p-0.5 bg-white rounded-sm">v</span>
        </span>
      </div>
    </div>
  );
};
