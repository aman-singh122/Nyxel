import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

function CTA({ startPath }) {
  return (
    <section className="px-5 pb-20 sm:px-6 lg:px-8">
      <MotionDiv
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-7xl rounded-lg border border-[#1F2937] bg-[#111827] px-6 py-12 text-center sm:px-10"
      >
        <h2 className="text-4xl font-semibold leading-tight text-[#F9FAFB] sm:text-[42px]">
          Ready to become interview ready?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#9CA3AF]">
          Start solving today and turn scattered preparation into a clear daily system.
        </p>
        <Link
          to={startPath}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-[#F9FAFB] shadow-xl shadow-[#3B82F6]/20 transition hover:-translate-y-0.5 hover:bg-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
        >
          Get Started
          <ArrowRight size={17} />
        </Link>
      </MotionDiv>
    </section>
  );
}

export default CTA;
