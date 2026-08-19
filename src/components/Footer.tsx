import React from 'react';
import { TypeFastLogo } from './TypeFastLogo';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="footer" className="w-full mt-24 border-t border-[#1a1a1a] bg-[#050505] transition-colors pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <button
              onClick={() => onNavigate('test')}
              className="flex items-center text-left focus:outline-none"
            >
              <TypeFastLogo size="md" />
            </button>
            <p className="text-xs text-[#A7A6A6] leading-relaxed max-w-xs">
              Focused typing speed and accuracy practice engineered for developers, professionals, and students worldwide.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FAFAFA] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A7A6A6]">
              <li>
                <button
                  onClick={() => onNavigate('test')}
                  className="hover:text-[#FAFAFA] transition-colors"
                >
                  Test
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('practice')}
                  className="hover:text-[#FAFAFA] transition-colors"
                >
                  Practice
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('leaderboard')}
                  className="hover:text-[#FAFAFA] transition-colors"
                >
                  Leaderboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#FAFAFA] transition-colors"
                >
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FAFAFA] mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A7A6A6]">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#FAFAFA] transition-colors"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#FAFAFA] transition-colors"
                >
                  Terms
                </button>
              </li>
              <li>
                <a
                  href="mailto:connectwithfaishal@gmail.com"
                  className="hover:text-[#FAFAFA] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FAFAFA] mb-4">
              Social
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A7A6A6]">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FAFAFA] transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FAFAFA] transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FAFAFA] transition-colors"
                >
                  X
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#141414] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <p>© 2026 TypeFast. Built to make you faster.</p>
          <div className="flex items-center gap-4 text-[#888888]">
            <span>Founded & Developed by Mr. Faishal Naushad</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
