import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Collection } from "@/components/shared/Collection";
import Header from "@/components/shared/Header";
import { getUserImageCounts, getUserImages } from "@/lib/actions/image.actions";
import { getUserById } from "@/lib/actions/user.actions";

const Profile = async ({ searchParams }: SearchParamProps) => {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const type = (params?.type as string) || "";
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const images = await getUserImages({ page, userId: user._id, type });
  const counts = await getUserImageCounts(user._id);

  return (
    <>
      <Header
        title="Profile Dashboard"
        subtitle="Monitor your generative usage, manage credits, and review your personal AI creation history."
        breadcrumb="USER OVERVIEW"
      />

      <section className="profile">
        <div className="profile-balance relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 rounded-md bg-white/5 px-2 py-1 border border-white/10">
              <Image
                src="/assets/images/credits-icon.png"
                alt="credits"
                width={12}
                height={12}
              />
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                Credits Available
              </p>
            </div>
            <Link
              href="/credits"
              className="text-[12px] font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 group/link"
            >
              Top Up{" "}
              <span className="transition-transform group-hover/link:translate-x-0.5">
                →
              </span>
            </Link>
          </div>

          <div className="mt-8 flex items-baseline gap-2">
            <h2 className="text-[48px] font-bold tracking-tight text-white">
              {user.creditBalance}
            </h2>
            <p className="text-sm font-medium text-white/40 uppercase tracking-widest mb-2">
              tokens
            </p>
          </div>

          {/* Subtle background decoration */}
          <div className="absolute -right-4 -bottom-4 size-24 bg-purple-500/10 blur-3xl rounded-full" />
        </div>

        <div className="profile-image-manipulation relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 rounded-md bg-white/5 px-2 py-1 border border-white/10">
              <Image
                src="/assets/images/images.png"
                alt="images"
                width={12}
                height={12}
              />
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                Image Manipulations Done
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-baseline gap-2">
            <h2 className="text-[48px] font-bold tracking-tight text-white">
              {counts?.totalImages}
            </h2>
            <p className="text-sm font-medium text-white/40 uppercase tracking-widest mb-2">
              images processed
            </p>
          </div>

          {/* Subtle background decoration */}
          <div className="absolute -right-4 -bottom-4 size-24 bg-blue-500/10 blur-3xl rounded-full" />
        </div>
      </section>

      <section className="mt-12 md:mt-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center  ">
              <Image
                src="/assets/images/personal-image.png"
                alt="collection"
                width={21}
                height={21}
                className="opacity-60 invert"
              />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Personal Collection
            </h3>
          </div>
        </div>

        <Collection
          images={images?.data}
          totalPages={images?.totalPages}
          page={page}
        />
      </section>
    </>
  );
};

export default Profile;
