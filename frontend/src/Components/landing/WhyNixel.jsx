import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { workflow } from "./landingData";

const MotionDiv = motion.div;

function WhyNixel() {
  return (
    <section className="px-5 py-20 sm:px-6 lg:px-8" id="why-nixel">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">Why Nixel</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#F9FAFB] sm:text-[42px]">
            A calmer path from signup to interview day.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-6">
          {workflow.map((step, index) => (
            <MotionDiv
              key={step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="relative rounded-lg border border-[#1F2937] bg-[#111827] p-5"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1120] text-[#22C55E]">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-sm text-[#9CA3AF]">Step {index + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-[#F9FAFB]">{step}</h3>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyNixel;
