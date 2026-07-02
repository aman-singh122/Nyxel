import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

const tracks = [
  { name: "Arrays", width: "w-1/2" },
  { name: "Graphs", width: "w-[57%]" },
  { name: "Dynamic Programming", width: "w-[64%]" },
  { name: "System Design", width: "w-[71%]" },
  { name: "SQL", width: "w-[78%]" },
  { name: "Frontend", width: "w-[85%]" },
];

function CompanyPrep() {
  return (
    <section className="border-y border-[#1F2937] bg-[#111827]/40 px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">Company Prep</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#F9FAFB] sm:text-[42px]">
            Practice by patterns, not panic.
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#9CA3AF]">
            Build repeatable interview instincts with topic-focused tracks, company-inspired sets, and performance signals that tell you where to spend the next hour.
          </p>
          <Link
            to="/problems"
            className="mt-7 inline-flex items-center gap-2 rounded-md border border-[#1F2937] bg-[#111827] px-5 py-3 text-sm font-semibold text-[#F9FAFB] transition hover:-translate-y-0.5 hover:border-[#3B82F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
          >
            Browse problem sets
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {tracks.map((track, index) => (
            <MotionDiv
              key={track.name}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="rounded-lg border border-[#1F2937] bg-[#111827] p-5"
            >
              <p className="text-sm text-[#9CA3AF]">Track {String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-xl font-semibold text-[#F9FAFB]">{track.name}</h3>
              <div className="mt-4 h-2 rounded-full bg-[#0B1120]">
                <div className={`h-2 rounded-full bg-[#3B82F6] ${track.width}`} />
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CompanyPrep;
