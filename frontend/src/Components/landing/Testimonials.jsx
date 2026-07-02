import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { testimonials } from "./landingData";

const MotionArticle = motion.article;

function Testimonials() {
  return (
    <section className="border-y border-[#1F2937] bg-[#111827]/40 px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">Testimonials</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#F9FAFB] sm:text-[42px]">
            Built for people preparing after class, work, and life.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <MotionArticle
              key={testimonial.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-lg border border-[#1F2937] bg-[#111827] p-6"
            >
              <Quote size={24} className="text-[#3B82F6]" />
              <p className="mt-5 text-lg leading-8 text-[#F9FAFB]">"{testimonial.quote}"</p>
              <div className="mt-6 border-t border-[#1F2937] pt-5">
                <p className="font-semibold text-[#F9FAFB]">{testimonial.name}</p>
                <p className="mt-1 text-sm text-[#9CA3AF]">{testimonial.role}</p>
              </div>
            </MotionArticle>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
