import { namedSizes } from "@/constants";
import React from "react";
import { CopyCode } from "./CopyCode";

export const Guide = () => {
  const icons = namedSizes.map((size) => {
    return {
      src: size.name + ".png",
      sizes: `${size.value}x${size.value}`,
      type: "image/png",
    };
  });

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-center underline decoration-primary">
        How to use this app
      </h1>

      <div className="flex flex-col mt-5">
        <div className="flex flex-col items-center sm:items-start">
          <ol className="flex flex-col gap-2 list-decimal marker:text-lg marker:font-semibold">
            <li className="text-lg font-semibold">
              Unzip the file and copy the images to your public folder
            </li>
            <li>
              <span className="text-lg font-semibold">
                Below are the icons that will be generated
              </span>
              <div className="w-full p-4 my-5 text-white bg-gray-900 rounded-2xl">
                <ul className="">
                  {icons.map((icon) => (
                    <li className="pl-1 border-l-2" key={icon.src}>
                      <span>--</span> {icon.src}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li>
              <span className="text-lg font-semibold">
                Add the following code to your index.html
              </span>
              <CopyCode>
                {icons.map(
                  (icon) =>
                    `<link rel="icon" type="${icon.type}" sizes="${icon.sizes}" href="${icon.src}"> \n`
                )}
              </CopyCode>
            </li>
            <li>
              <span className="text-lg font-semibold">
                Add the following code to your manifest.json
              </span>
              <CopyCode>{`"icons": ${JSON.stringify(
                icons,
                null,
                4
              )}`}</CopyCode>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
