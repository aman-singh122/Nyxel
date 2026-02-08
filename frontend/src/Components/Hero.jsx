// src/pages/HeroPage.jsx
import { useState, useEffect } from "react";
import Animate from "../animate";

const HeroPage = () => {
  const features = [
    "Real-time coding challenges",
    "Performance-based rankings",
    "Detailed solution feedback",
  ];

  const stats = [
    { label: "Developers Active", value: "10K+" },
    { label: "Code Submissions", value: "1M+" },
    { label: "Curated Problems", value: "500+" },
  ];

  const images = [
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://plus.unsplash.com/premium_photo-1661877737564-3dfd7282efcb?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">

      {/* Background animation (dark only) */}
      <div className="hidden dark:block">
        <Animate />
      </div>

      {/* HERO */}
      <div className="relative z-10 px-6 sm:px-12 pt-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
            Build Strong <br />
            <span className="text-[#021510] dark:text-emerald-400">
              Problem-Solving Skills
            </span>
          </h1>

          <p className="text-black/70 dark:text-white/70 max-w-xl mb-8">
            A focused platform to practice data structures, algorithms, and
            competitive programming through structured challenges and contests.
          </p>

          <div className="flex gap-4 mb-10 flex-wrap">
            <button
              className="
                px-6 py-3 rounded-lg font-semibold transition
                bg-[#021510] text-white hover:bg-[#03261d]
                dark:bg-emerald-900 dark:hover:bg-emerald-950
              "
            >
              Start Practicing
            </button>

            <button
              className="
                px-6 py-3 rounded-lg transition
                border border-black/20 hover:bg-black/5
                dark:border-white/30 dark:hover:bg-white/10
              "
            >
              Explore Problems
            </button>
          </div>

          {/* STATS */}
          <div className="flex gap-8 flex-wrap text-sm text-black/70 dark:text-white/70">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CARD */}
        <div
          className="
            bg-white/5 dark:bg-white/5
            border border-black/10 dark:border-white/10
            rounded-2xl overflow-hidden backdrop-blur
            transition-all hover:scale-[1.02] hover:shadow-xl
          "
        >
          <img
            src={images[currentImage]}
            alt="platform preview"
            className="w-full h-52 sm:h-64 object-cover transition-all duration-1000 ease-in-out"
          />

          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-[#021510] dark:text-white">
              Designed for Consistent Growth
            </h3>

            <p className="text-sm text-black/70 dark:text-white/70 mb-4">
              Practice regularly, analyze your performance, and improve through
              structured feedback and rankings.
            </p>

            <div className="flex flex-wrap gap-2">
              {features.map((item) => (
                <span
                  key={item}
                  className="
                    px-3 py-1 text-xs rounded-full
                    bg-black/5 border border-black/10
                    dark:bg-white/10 dark:border-white/20
                  "
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 px-6 sm:px-12 mt-24 mb-20">
        <div
          className="
            rounded-2xl p-10 text-center
            bg-[#021510] text-white
            dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-950
            relative overflow-hidden shadow-xl
          "
        >
          <div className="absolute inset-0 bg-emerald-500/10 blur-3xl pointer-events-none" />

          <h2 className="text-3xl font-extrabold mb-4">
            Start Building Skills That Matter
          </h2>

          <p className="mb-6 max-w-2xl mx-auto text-white/90">
            Solve meaningful problems, track your progress, and prepare for
            real-world technical interviews.
          </p>

          <button
            className="
              px-8 py-3 rounded-lg
              bg-white text-[#021510]
              font-semibold
              hover:bg-emerald-100 transition
            "
          >
            Create Your Free Account
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
