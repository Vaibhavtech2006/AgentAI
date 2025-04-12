import { cn } from "@/utils/cn";
import React from "react";
import { BackgroundGradientAnimation } from "./GradientBg";


import {GridGlobe} from "../Grid";
// BentoGrid Component
export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl group/bento hover:shadow-xl transition   mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

// BentoGridItem Component
export const BentoGridItem = ({
  className,
  title,
  description,
  img,
  spareImg,
  imgClassName,
  titleClassName, // ✅ Added here
  id,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  id?: number;
  img?: string;
  spareImg?: string;
  imgClassName?: string;
  titleClassName?: string; // ✅ Added here
}) => {
  return (
    <div
      className={cn(
        "group/bento relative shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-3xl border border-neutral-200 bg-white p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        className
      )}
      style={{
        background: "rgb(2,0,36)",
        backgroundImage:
          "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(100,99,126,1) 20%, rgba(123,139,144,1) 100%)",
      }}
    >
      <div className={id === 6 ? "flex justify-center h-full" : ""}>
        <div className="w-full h-full absolute">
          {img && (
            <img
              src={img}
              alt="Main visual"
              className={cn(imgClassName, "object-cover object-center")}
            />
          )}
          <div className={`absolute right-0 -bottom-5 ${id === 5 ? "w-full opacity-80" : ""}`}>
            {spareImg && (
              <img
                src={spareImg}
                alt="Spare visual"
                className={cn(imgClassName, "object-cover object-center")}
              />
            )}
          </div>

          {id === 6 && (
            <BackgroundGradientAnimation>
              <div className="absolute z-50 flex items-center justify-center text-white font-bold" />
            </BackgroundGradientAnimation>
          )}

          <div
            className={cn(
              titleClassName,
              "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
            )}
          >
            <div className="font-sans font-extralight text-[#c1c2d3] text-sm md:text-xs lg-text-base z-10 dark:text-neutral-300">
              {description}
            </div>
            <div className="font-sans font-bold text-lg lg:text-3xl max-w-96 z-10">
              {title}
            </div>
          </div>
          {id ===2 }
        </div>
      </div>

      <div className="transition duration-200 group-hover/bento:translate-x-2">
        <div className="mt-2 mb-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
          {title}
        </div>
        <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );
};
