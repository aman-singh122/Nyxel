import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { navItems } from "./landingData";

const MotionDiv = motion.div;

function Navbar({ startPath }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-[#1F2937] bg-[#0B1120]/85 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-lg font-semibold tracking-[0.18em] text-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
          aria-label="Nyxel home"
        >
          NYXEL
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="rounded-md px-3 py-2 text-sm text-[#9CA3AF] transition hover:bg-[#111827] hover:text-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-[#9CA3AF] transition hover:text-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
          >
            Login
          </Link>
          <Link
            to={startPath}
            className="rounded-md bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-[#F9FAFB] shadow-lg shadow-[#3B82F6]/20 transition hover:-translate-y-0.5 hover:bg-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1120]"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#1F2937] text-[#F9FAFB] transition hover:bg-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <MotionDiv
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-[#1F2937] bg-[#0B1120] px-5 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={closeMenu}
                className="rounded-md px-3 py-2 text-sm text-[#9CA3AF] transition hover:bg-[#111827] hover:text-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#1F2937] pt-4">
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-md border border-[#1F2937] px-4 py-2 text-center text-sm font-medium text-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
              >
                Login
              </Link>
              <Link
                to={startPath}
                onClick={closeMenu}
                className="rounded-md bg-[#3B82F6] px-4 py-2 text-center text-sm font-semibold text-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </MotionDiv>
      )}
    </header>
  );
}

export default Navbar;
