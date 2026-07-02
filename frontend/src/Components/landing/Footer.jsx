import { createElement } from "react";
import { Link } from "react-router";
import { Github, Linkedin, Twitter } from "lucide-react";

const columns = [
  { title: "Platform", links: ["Problems", "Contests", "AI Chat", "Dashboard"] },
  { title: "Resources", links: ["Tutorials", "Discussions", "Learning Paths", "Company Prep"] },
  { title: "Company", links: ["About", "Careers", "Contact", "Status"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies", "Security"] },
];

function Footer() {
  return (
    <footer className="border-t border-[#1F2937] bg-[#0B1120] px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link to="/" className="text-lg font-semibold tracking-[0.18em] text-[#F9FAFB]">
              
              
            </Link>
            <p className="mt-4 max-w-sm text-base leading-7 text-[#9CA3AF]">
              A focused coding platform for problem solving, contests, discussions, and interview preparation.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { label: "GitHub", icon: Github },
                { label: "LinkedIn", icon: Linkedin },
                { label: "Twitter", icon: Twitter },
              ].map(({ label, icon: SocialIcon }) => (
                <a
                  key={label}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-[#1F2937] text-[#9CA3AF] transition hover:text-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
                  aria-label={label}
                >
                  {createElement(SocialIcon, { size: 18 })}
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold text-[#F9FAFB]">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-[#9CA3AF] transition hover:text-[#F9FAFB]">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-[#1F2937] pt-6 text-sm text-[#9CA3AF]">
          Copyright 2026 Nyxel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
