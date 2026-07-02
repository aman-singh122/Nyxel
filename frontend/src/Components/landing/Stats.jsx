import { motion } from "framer-motion";
import { companies } from "./landingData";

const MotionSpan = motion.span;

function Stats() {
  return (
    <section className="border-y border-[#1F2937] bg-[#111827]/40 px-5 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-[#9CA3AF]">
          Practice questions inspired by
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {companies.map((company, index) => (
            <MotionSpan
              key={company}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="rounded-full border border-[#1F2937] bg-[#111827] px-5 py-2 text-sm font-semibold text-[#F9FAFB]"
            >
              {company}
            </MotionSpan>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
