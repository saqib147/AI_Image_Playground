import { Collection } from "@/components/shared/Collection";
import { Search } from "@/components/shared/Search";
import { navLinks } from "@/constants";
import { getAllImages } from "@/lib/actions/image.actions";
import Image from "next/image";
import Link from "next/link";

const Home = async ({ searchParams }: SearchParamProps) => {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const searchQuery = (resolvedSearchParams?.query as string) || "";

  const images = await getAllImages({ page, searchQuery });

  return (
    <div className="flex flex-col gap-10">
      {/* Hero Panel */}
      <section className="relative flex flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl border border-white/5 bg-[#1A1A24] px-6 py-20 shadow-2xl sm:px-16">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[#0f0f17]" />

        {/* Center flare */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C6CFF]/20 blur-[140px]" />

        {/* Top ambient glow */}
        <div className="pointer-events-none absolute top-0 h-[300px] w-full bg-gradient-to-b from-[#A78BFA]/10 via-[#7C6CFF]/5 to-transparent blur-2xl" />

        {/* Subtle side glows */}
        <div className="pointer-events-none absolute left-0 top-1/2 h-[400px] w-[250px] -translate-y-1/2 bg-[#5B4BFF]/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-[400px] w-[250px] -translate-y-1/2 bg-[#A78BFA]/10 blur-[120px]" />

        {/* Noise / vignette overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_65%)]" />

        <div className="z-10 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
          <span className="size-2 rounded-full bg-[#C4B5FD] shadow-[0_0_10px_#C4B5FD]" />
          Ai Image Engine Online
        </div>

        <h1 className="z-10 text-center text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[64px] lg:leading-[1.1]">
          Unleash Computational <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-[#D8C7FF] via-[#B69CFF] to-[#8B7CFF] bg-clip-text text-transparent">
            Creativity.
          </span>
        </h1>

        <p className="z-10 mx-auto mt-2 max-w-2xl text-center text-[18px] leading-8 text-white/60">
          The next generation AI Image Engine. Restore clarity, expand horizons,
          and generate visual logic with absolute precision and silent
          orchestration.
        </p>

        <div className="z-10 mt-6 w-full max-w-2xl">
          <Search />
        </div>
      </section>

      {/* Compute Modules */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-bold tracking-wider text-white/50 uppercase">
          Compute Modules
        </h3>
        <ul className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:flex lg:gap-5">
          {navLinks.slice(1, 6).map((link, index) => (
            <Link
              key={link.route}
              href={link.route}
              className={`flex flex-1 items-center gap-4 rounded-2xl border border-white/5 bg-[#1A1A24] p-4 transition-all hover:bg-white/5 animate-slide-up stagger-${index + 1}`}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
                <Image
                  src={link.icon}
                  alt={link.label}
                  width={20}
                  height={20}
                  className="opacity-70 invert"
                />
              </div>
              <p className="text-[15px] font-medium text-white/90">
                {link.label
                  .replace("Image ", "")
                  .replace("Generative ", "")
                  .replace("Object ", "")
                  .replace("Background ", "BG ")}
              </p>
            </Link>
          ))}
        </ul>
      </section>

      {/* Recent Syntheses */}
      <section className="flex flex-col gap-6 mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-medium text-white flex items-center gap-3">
            <Image
              src="/assets/images/recent.png"
              width={21}
              height={21}
              alt="Recent"
            />
            Recent Syntheses
          </h3>
        </div>

        <Collection
          hasSearch={false}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </div>
  );
};

export default Home;
