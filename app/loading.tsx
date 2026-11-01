export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0E14] text-slate-100 flex flex-col justify-between animate-pulse select-none">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between pb-6 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-[6px] bg-[#121824] border border-[#1E293B]" />
            <div className="space-y-1">
              <div className="h-5 w-28 bg-[#1f293d] rounded-[3px]" />
              <div className="h-3 w-44 bg-[#141b29] rounded-[2px]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-20 bg-[#121824] rounded-[4px] border border-[#1E293B]" />
            <div className="h-9 w-24 bg-[#1f293d] rounded-[4px]" />
          </div>
        </div>

        {/* Disposable Income Gauge / Summary Card Skeleton */}
        <div className="p-6 rounded-[8px] bg-[#121824] border border-[#1E293B] space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-32 bg-[#1a2333] rounded-[2px]" />
              <div className="h-9 w-48 bg-[#223047] rounded-[4px]" />
            </div>
            <div className="size-16 rounded-full bg-[#161f30] border-2 border-[#1E293B]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1E293B]">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3.5 rounded-[6px] bg-[#0e131d] border border-[#192233] space-y-2">
                <div className="h-2.5 w-20 bg-[#161f30] rounded-[2px]" />
                <div className="h-6 w-24 bg-[#1f293d] rounded-[3px]" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Add Bar Skeleton */}
        <div className="p-4 rounded-[6px] bg-[#121824] border border-[#1E293B] flex flex-col sm:flex-row items-center gap-3">
          <div className="h-10 flex-1 w-full bg-[#0e131d] rounded-[4px] border border-[#192233]" />
          <div className="h-10 w-full sm:w-36 bg-[#1f293d] rounded-[4px]" />
        </div>

        {/* Transactions List Skeleton */}
        <div className="p-5 rounded-[8px] bg-[#121824] border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div className="h-4 w-36 bg-[#1f293d] rounded-[3px]" />
            <div className="h-3 w-20 bg-[#141b29] rounded-[2px]" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-3 rounded-[6px] bg-[#0e131d] border border-[#192233] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-[4px] bg-[#161f30]" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-32 bg-[#1f293d] rounded-[2px]" />
                    <div className="h-2.5 w-20 bg-[#141b29] rounded-[2px]" />
                  </div>
                </div>
                <div className="h-4 w-20 bg-[#223047] rounded-[3px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
