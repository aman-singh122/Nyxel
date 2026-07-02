import { motion } from "framer-motion";
import { languages } from "./landingData";

const MotionSpan = motion.span;

function Languages() {
  return (
    <section className="px-5 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-lg border border-[#1F2937] bg-[#111827] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">Languages</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#F9FAFB] sm:text-[42px]">
              Solve in the language you trust.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 lg:max-w-2xl lg:justify-end">
            {languages.map((language) => (
              <MotionSpan
                key={language}
                whileHover={{ y: -3, scale: 1.03 }}
                className="rounded-full border border-[#1F2937] bg-[#0B1120] px-4 py-2 text-sm font-semibold text-[#F9FAFB]"
              >
                {language}
              </MotionSpan>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Languages;
