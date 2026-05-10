"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

export const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        if (searchParams.get("query") === query) return;

        const newUrl = formUrlQuery({
          searchParams: searchParams.toString(),
          key: "query",
          value: query,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (!searchParams.has("query")) return;

        const newUrl = removeKeysFromQuery({
          searchParams: searchParams.toString(),
          keysToRemove: ["query"],
        });

        router.push(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [router, searchParams, query]);

  return (
    <div className="flex w-full items-center rounded-xl border border-white/10 bg-[#1A1A24] px-4 shadow-md transition-all focus-within:border-[#868CFF]/50 focus-within:ring-1 focus-within:ring-[#868CFF]/50">
      <Image
        src="/assets/icons/search.svg"
        alt="search"
        width={20}
        height={20}
        className="opacity-50 invert"
      />

      <Input
        className="border-0 bg-transparent text-white w-full placeholder:text-white/40 h-12 font-medium text-sm p-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Search operations, assets, or prompt history..."
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};
