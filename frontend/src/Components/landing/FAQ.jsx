import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "./landingData";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">FAQ</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#F9FAFB] sm:text-[42px]">
            Questions before you start?
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="rounded-lg border border-[#1F2937] bg-[#111827]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-lg font-semibold text-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
                  aria-expanded={isOpen}
                >
                  {item.question}
                  <ChevronDown className={`shrink-0 transition ${isOpen ? "rotate-180" : ""}`} size={20} />
                </button>
                {isOpen && <p className="px-5 pb-5 text-base leading-7 text-[#9CA3AF]">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;

