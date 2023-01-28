import { namedSizes } from "@/constants";
import React from "react";

export const Guide = () => {
  const icons = namedSizes.map((size) => {
    return {
      src: size.name + ".png",
      sizes: `${size.value}x${size.value}`,
      type: "image/png",
    };
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="">
        <h1 className="text-3xl  font-bold my-10 text-center">
          How to use this app
        </h1>

        <div className="flex gap-5">
          <div className="">
            <p className="mb-5">
              The zip will be automatically downloaded to your computer withing
              a few seconds.
            </p>

            <h2 className="text-2xl font-bold">
              Steps to add the icons to your webApp :
            </h2>

            <h3 className="text-xl">
              1. Unzip the file and copy the images to your public folder
            </h3>

            <h3 className="text-xl">
              2. Below are the icons that will be generated
            </h3>

            <ul className="my-5 bg-gray-800 p-4 rounded ">
              {icons.map((icon) => (
                <li className="border-l-2 pl-1" key={icon.src}>
                  <span>--</span> {icon.src}
                </li>
              ))}
            </ul>

            <h3 className="text-xl">
              3. Add the following code to your index.html
            </h3>
            <pre className="my-5 bg-gray-800 p-4 rounded ">
              <code>
                {icons.map(
                  (icon) =>
                    `<link rel="icon" type="${icon.type}" sizes="${icon.sizes}" href="${icon.src}"> \n`
                )}
              </code>
            </pre>
          </div>

          <div className="">
            <h3 className="text-xl">
              4. Add the following code to your manifest.json
            </h3>
            <pre className="bg-gray-800 p-4 rounded">
              <code>{`"icons": ${JSON.stringify(icons, null, 4)}`}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="">
        <button
          onClick={() => window.location.reload()}
          className="border-white border-2   hover:bg-blue-700  font-bold py-2 px-4 rounded"
        >
          Generate another image
        </button>
      </div>
    </div>
  );
};
