import { createElement } from "react";
import { motion } from "framer-motion";
import { features } from "./landingData";

const MotionArticle = motion.article;

function Features() {
  return (
    <section className="px-5 py-20 sm:px-6 lg:px-8" id="features">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">Platform</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#F9FAFB] sm:text-[42px]">
            Everything you need to practice with intent.
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#9CA3AF]">
            A clean preparation system for solving, reviewing, competing, and improving without switching tools.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: FeatureIcon, title, description }, index) => (
            <MotionArticle
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -4 }}
              className="rounded-lg border border-[#1F2937] bg-[#111827] p-6 shadow-lg shadow-black/10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#1F2937] bg-[#0B1120] text-[#3B82F6]">
                {createElement(FeatureIcon, { size: 22 })}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[#F9FAFB]">{title}</h3>
              <p className="mt-3 text-base leading-7 text-[#9CA3AF]">{description}</p>
            </MotionArticle>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
