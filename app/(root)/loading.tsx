const Loading = () => {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-9 w-64 rounded-xl bg-purple-100" />
        <div className="h-4 w-96 rounded-lg bg-purple-100/60" />
      </div>
      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl border-2 border-purple-200/15 bg-white p-4 shadow-xl shadow-purple-200/10"
          >
            <div className="h-52 w-full rounded-xl bg-purple-100" />
            <div className="flex items-center justify-between">
              <div className="h-5 w-3/4 rounded-lg bg-purple-100" />
              <div className="h-6 w-6 rounded-full bg-purple-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
