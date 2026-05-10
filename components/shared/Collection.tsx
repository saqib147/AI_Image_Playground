"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { transformationTypes } from "@/constants";
import { IImage } from "@/lib/database/models/image.model";
import { formUrlQuery } from "@/lib/utils";

import { Button } from "../ui/button";

import { Search } from "./Search";

export const Collection = ({
  hasSearch = false,
  images,
  totalPages = 1,
  page,
}: {
  images: IImage[];
  totalPages?: number;
  page: number;
  hasSearch?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // PAGINATION HANDLER
  const onPageChange = (action: string) => {
    const pageValue = action === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      searchParams: searchParams.toString(),
      key: "page",
      value: pageValue,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <>
      {/* Header handled by parent */}

      {images.length > 0 ? (
        <ul className="collection-list">
          {images.map((image, index) => (
            <Card image={image} key={`${image._id}`} index={index} />
          ))}
        </ul>
      ) : (
        <div className="collection-empty">
          <p className="p-20-semibold text-white/60">No operations yet</p>
          <p className="p-14-medium text-white/40 mt-1">
            Initialize a module to begin.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-12">
          <PaginationContent className="flex items-center gap-3">
            <Button
              disabled={Number(page) <= 1}
              className="size-10 p-0 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all rounded-xl disabled:opacity-30"
              onClick={() => onPageChange("prev")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>

            <div className="flex items-center gap-2">
              {[...Array(Math.min(totalPages, 3))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    onClick={() => {
                      const newUrl = formUrlQuery({
                        searchParams: searchParams.toString(),
                        key: "page",
                        value: pageNum,
                      });
                      router.push(newUrl, { scroll: false });
                    }}
                    className={`size-10 p-0 rounded-xl font-bold transition-all ${
                      Number(page) === pageNum
                        ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                        : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {totalPages > 3 && (
                <span className="text-white/20 px-1">...</span>
              )}
              {totalPages > 3 && (
                <Button
                  onClick={() => {
                    const newUrl = formUrlQuery({
                      searchParams: searchParams.toString(),
                      key: "page",
                      value: totalPages,
                    });
                    router.push(newUrl, { scroll: false });
                  }}
                  className={`size-10 p-0 rounded-xl font-bold transition-all ${
                    Number(page) === totalPages
                      ? "bg-purple-500 text-white"
                      : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {totalPages}
                </Button>
              )}
            </div>

            <Button
              className="size-10 p-0 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all rounded-xl disabled:opacity-30"
              onClick={() => onPageChange("next")}
              disabled={Number(page) >= totalPages}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

const Card = ({ image, index }: { image: IImage; index: number }) => {
  const stagger = `stagger-${(index % 6) + 1}`;
  return (
    <li className={`animate-slide-up ${stagger}`}>
      <Link
        href={`/transformations/${image._id}`}
        className="relative block h-80 w-full overflow-hidden rounded-md border border-white/10 bg-[#1A1A24] transition-all hover:border-white/20 group shadow-xl"
      >
        {index === 0 && (
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 text-[10px] font-bold tracking-wider text-white/80 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-blue-400"></span>{" "}
            PROCESSED
          </div>
        )}

        <CldImage
          src={image.publicId}
          alt={image.title}
          width={image.width}
          height={image.height}
          {...image.config}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#111319] via-[#111319]/20 to-transparent opacity-90" />

        <div className="absolute bottom-0 left-0 w-full p-5 flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-white">{image.title}</p>
            <p className="font-mono text-[10px] text-white/50 uppercase tracking-wider">
              Output-092{String.fromCharCode(65 + (index % 26))}
            </p>
          </div>

          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/10 transition-colors group-hover:bg-white/20">
            <Image
              src={`/assets/icons/${transformationTypes[image.transformationType as TransformationTypeKey]?.icon || "image.png"}`}
              alt={image.title}
              width={14}
              height={14}
              className="invert opacity-80"
            />
          </div>
        </div>
      </Link>
    </li>
  );
};
