import { Code2 } from "lucide-react";

function AppLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1120] px-6 text-[#F9FAFB]">
      <div className="w-full max-w-sm rounded-lg border border-[#1F2937] bg-[#111827] p-6 shadow-2xl shadow-black/30">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#1F2937] bg-[#0B1120] text-[#3B82F6]">
            <Code2 size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F9FAFB]">Preparing Nyxel</p>
            <p className="mt-1 text-sm text-[#9CA3AF]">Checking your session securely.</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="h-3 w-full animate-pulse rounded-full bg-[#1F2937]" />
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-[#1F2937]" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-[#1F2937]" />
        </div>
      </div>
    </div>
  );
}

export default AppLoading;

