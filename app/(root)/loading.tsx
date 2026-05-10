const Loading = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-64 rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-4 w-[500px] rounded-full bg-white/5 animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-6 rounded-[24px] border border-white/5 bg-[#0f1115] p-6 shadow-2xl overflow-hidden relative"
          >
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

            {/* Image placeholder */}
            <div className="aspect-[4/3] w-full rounded-2xl bg-white/5 animate-pulse" />

            {/* Content area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-6 w-1/2 rounded-lg bg-white/5 animate-pulse" />
                <div className="h-6 w-6 rounded-full bg-white/5 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded-full bg-white/5 animate-pulse" />
                <div className="h-3 w-2/3 rounded-full bg-white/5 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;

