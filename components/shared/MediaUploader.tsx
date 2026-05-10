"use client";

import { toast } from "sonner";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { dataUrl, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  image: any;
  publicId: string;
  type: string;
};

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type,
}: MediaUploaderProps) => {
  const onUploadSuccessHandler = (result: any) => {
    setImage((prevState: any) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url,
    }));
    onValueChange(result?.info?.public_id);
    toast.success("Image uploaded successfully", {
      description: "1 credit was deducted from your account",
      duration: 5000,
      className: "success-toast",
    });
  };

  const onUploadErrorHandler = () => {
    toast.error("Error uploading image", {
      description: "Please try again",
      duration: 5000,
      className: "error-toast",
    });
  };

  return (
    <CldUploadWidget
      uploadPreset="ai_imaginify"
      options={{ multiple: false, resourceType: "image" }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => (
        <div className="flex flex-col w-full h-full min-h-[400px]">
          {publicId ? (
            /* ── Uploaded image ──────────────────────────────── */
            <div
              className="flex-1 cursor-pointer overflow-hidden rounded-[16px]"
              onClick={() => open()}
            >
              <CldImage
                width={getImageSize(type, image, "width")}
                height={getImageSize(type, image, "height")}
                src={publicId}
                alt="Uploaded image"
                sizes="(max-width: 767px) 100vw, 50vw"
                placeholder={dataUrl as PlaceholderValue}
                className="w-full h-full object-contain rounded-[16px]"
              />
            </div>
          ) : (
            /* ── Empty state / upload CTA ────────────────────── */
            <button
              type="button"
              onClick={() => open()}
              className="group flex-1 flex flex-col items-center justify-center gap-4
                         w-full cursor-pointer rounded-[16px]
                         hover:bg-white/[0.02] transition-all duration-200"
            >
              {/* Cloud icon box */}
              <div
                className="flex items-center justify-center w-[60px] h-[60px]
                            rounded-2xl bg-[#23263a] border border-white/10
                            shadow-inner shadow-black/30
                            group-hover:bg-[#2a2e47] group-hover:border-purple-500/40
                            transition-all duration-200"
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/60 group-hover:text-white/80 transition-colors duration-200"
                >
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              </div>

              {/* Text */}
              <div className="flex flex-col items-center gap-1 text-center px-4">
                <p
                  className="text-[14px] font-medium text-white/60
                              group-hover:text-white/80 transition-colors duration-200"
                >
                  Click or drag image to upload
                </p>
                <p className="text-[12px] text-white/30">
                  SVG, PNG, JPG or GIF (max. 800×400px)
                </p>
              </div>
            </button>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
