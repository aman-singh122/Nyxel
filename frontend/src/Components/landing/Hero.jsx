import { Link } from "react-router";
import { CheckCircle2, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { heroStats } from "./landingData";

const MotionDiv = motion.div;

const lines = [
  "vector<int> twoSum(vector<int>& nums, int target) {",
  "  unordered_map<int, int> seen;",
  "  for (int i = 0; i < nums.size(); i++) {",
  "    int need = target - nums[i];",
  "    if (seen.count(need)) return {seen[need], i};",
  "    seen[nums[i]] = i;",
  "  }",
  "  return {};",
  "}",
];

function Hero({ startPath }) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
      <MotionDiv
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-sm text-[#9CA3AF]">
          <Sparkles size={16} className="text-[#22C55E]" />
          AI-assisted practice for serious interview prep
        </div>
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.04] text-[#F9FAFB] sm:text-6xl lg:text-[64px]">
          Become Interview Ready.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#9CA3AF]">
          Nixel brings problems, contests, discussions, progress tracking, and AI guidance into one polished coding environment so you can build consistency and confidence before the interview.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to={startPath}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-[#F9FAFB] shadow-xl shadow-[#3B82F6]/20 transition hover:-translate-y-0.5 hover:bg-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1120]"
          >
            <Play size={17} />
            Start Coding
          </Link>
          <Link
            to="/problems"
            className="inline-flex items-center justify-center rounded-md border border-[#1F2937] bg-[#111827] px-5 py-3 text-sm font-semibold text-[#F9FAFB] transition hover:-translate-y-0.5 hover:border-[#3B82F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
          >
            Explore Problems
          </Link>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {heroStats.map((stat) => (
            <div key={stat} className="rounded-md border border-[#1F2937] bg-[#111827] px-4 py-3">
              <dt className="text-sm font-medium text-[#F9FAFB]">{stat}</dt>
            </div>
          ))}
        </dl>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
        transition={{ opacity: { duration: 0.5, delay: 0.15 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
        className="rounded-lg border border-[#1F2937] bg-[#111827] shadow-2xl shadow-black/40"
      >
        <div className="flex items-center justify-between border-b border-[#1F2937] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#3B82F6]" />
            <span className="h-3 w-3 rounded-full bg-[#9CA3AF]" />
            <span className="h-3 w-3 rounded-full bg-[#22C55E]" />
          </div>
          <span className="text-sm text-[#9CA3AF]">main.cpp</span>
        </div>
        <div className="grid gap-0 lg:grid-cols-[1fr_180px]">
          <pre className="overflow-hidden p-5 text-sm leading-7 text-[#9CA3AF]">
            <code>
              {lines.map((line, index) => (
                <span key={`${line}-${index}`} className="block">
                  <span className="mr-4 inline-block w-5 text-right text-[#9CA3AF]">{index + 1}</span>
                  <span className={line.includes("return") ? "text-[#22C55E]" : "text-[#F9FAFB]"}>{line}</span>
                </span>
              ))}
            </code>
          </pre>
          <div className="border-t border-[#1F2937] p-4 lg:border-l lg:border-t-0">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#22C55E]">
              <CheckCircle2 size={17} />
              Accepted
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-md border border-[#1F2937] p-3">
                <p className="text-[#9CA3AF]">Runtime</p>
                <p className="mt-1 font-semibold text-[#F9FAFB]">3 ms</p>
              </div>
              <div className="rounded-md border border-[#1F2937] p-3">
                <p className="text-[#9CA3AF]">Memory</p>
                <p className="mt-1 font-semibold text-[#F9FAFB]">12.8 MB</p>
              </div>
              <div className="rounded-md border border-[#1F2937] p-3">
                <p className="text-[#9CA3AF]">Console</p>
                <p className="mt-1 text-[#F9FAFB]">Input: [2,7,11,15]</p>
                <p className="text-[#22C55E]">Output: [0,1]</p>
              </div>
            </div>
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}

export default Hero;
