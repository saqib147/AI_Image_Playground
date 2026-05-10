"use client";

import { dataUrl, debounce, download, getImageSize } from "@/lib/utils";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React from "react";

// ─── Wand + Sparkles placeholder icon (matches the design) ───────────────────
const WandSparklesIcon = () => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Diagonal wand shaft */}
    <line
      x1="50"
      y1="22"
      x2="24"
      y2="50"
      stroke="#5B6EF5"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Wand tip */}
    <circle cx="50" cy="22" r="3.5" fill="#7B8FFF" />

    {/* Large 4-point star (bottom-left area) */}
    <path
      d="M18 46 L20 40 L22 46 L28 48 L22 50 L20 56 L18 50 L12 48 Z"
      fill="#5B6EF5"
      opacity="0.85"
    />
    {/* Small 4-point star (top-right area) */}
    <path
      d="M52 36 L53.2 33 L54.4 36 L57.4 37.2 L54.4 38.4 L53.2 41.4 L52 38.4 L49 37.2 Z"
      fill="#7B8FFF"
      opacity="0.6"
    />
  </svg>
);

// ─── Download icon ────────────────────────────────────────────────────────────
const DownloadIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────
const TransformedImage = ({
  image,
  type,
  title,
  isTransforming,
  setIsTransforming,
  transformationConfig,
  hasDownload = false,
}: TransformedImageProps) => {
  const downloadHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    download(
      getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image.publicId,
        ...transformationConfig,
      }),
      title,
    );
  };

  const hasResult = image?.publicId && transformationConfig;

  return (
    <div className="flex flex-col flex-1 h-full p-4 gap-3">
      {/* ── Image / placeholder area ────────────────────────────────────── */}
      <div className="flex-1 relative flex items-center justify-center min-h-0">
        {hasResult ? (
          /* Transformed image */
          <>
            <CldImage
              alt={image.title}
              width={getImageSize(type, image, "width")}
              height={getImageSize(type, image, "height")}
              src={image?.publicId}
              sizes="(max-width:767px) 100vw, 50vw"
              placeholder={dataUrl as PlaceholderValue}
              className="w-full h-full object-cover rounded-[12px]"
              onLoad={() => setIsTransforming && setIsTransforming(false)}
              onError={() =>
                debounce(
                  () => setIsTransforming && setIsTransforming(false),
                  8000,
                )()
              }
              {...transformationConfig}
            />

            {/* Transforming overlay */}
            {isTransforming && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center
                            gap-4 rounded-[12px] bg-[#181b26]/90 backdrop-blur-sm"
              >
                <Image
                  src="/assets/icons/spinner.svg"
                  width={40}
                  height={40}
                  alt="transforming"
                />
                {/* Synthesizing badge */}
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full
                              bg-[#23263a] border border-white/10"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  <span className="font-mono text-[13px] text-white/60 tracking-wide">
                    Synthesizing pixels...
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty placeholder */
          <div className="flex flex-col items-center justify-center gap-5 text-center select-none">
            {/* Synthesizing badge */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full
                          bg-[#23263a] border border-white/[0.08]"
            >
              <span className="font-mono text-[13px] text-white/40 tracking-wide">
                Final result will appear here
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom footer: Save Image ───────────────────────────────────── */}
      <div className="flex justify-end pt-3 border-t border-white/[0.06] flex-shrink-0">
        <button
          onClick={hasResult ? downloadHandler : undefined}
          disabled={!hasResult}
          className="flex items-center gap-1.5 text-[13px] font-medium
                     text-white/30 disabled:cursor-default
                     hover:text-white/60 disabled:hover:text-white/30
                     transition-colors duration-200"
        >
          <DownloadIcon />
          Save Image
        </button>
      </div>
    </div>
  );
};

export default TransformedImage;
