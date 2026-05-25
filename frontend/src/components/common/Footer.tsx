import React from 'react';

export default function Footer() {
    return (
        <footer className="border-t border-[#E1EFFF] bg-[#FAFAFF] pt-16 pb-8 px-6 lg:px-12 font-sans">
            {/* Main Footer Grid */}
            <div className="mx-auto max-w-7xl grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8 mb-16">
                
                {/* Column 1: Brand & Description */}
                <div className="col-span-1 md:col-span-1">
                    <h2 className="text-2xl font-black text-[#000080] tracking-widest mb-4">
                        XYVANTA
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6">
                        AI Powered Recruitment Intelligence. Smarter hiring, better matches, and stronger teams through deterministic scoring and machine learning.
                    </p>
                    {/* Social Icons Placeholder */}
                    <div className="flex gap-4 text-slate-400">
                        <a href="#" className="hover:text-[#00BCD4] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                        </a>
                        <a href="#" className="hover:text-[#00BCD4] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                        </a>
                    </div>
                </div>

                {/* Column 2: Platform Features */}
                <div>
                    <h3 className="text-[#1C1C1C] font-bold mb-5 tracking-wide text-sm uppercase">Platform</h3>
                    <ul className="flex flex-col gap-3 text-sm text-slate-500">
                        <li><a href="#" className="hover:text-[#00BCD4] transition-colors">Smart JD Analysis</a></li>
                        <li><a href="#" className="hover:text-[#00BCD4] transition-colors">Resume Intelligence</a></li>
                        <li><a href="#" className="hover:text-[#00BCD4] transition-colors">AI + ML Matching</a></li>
                        <li><a href="#" className="hover:text-[#00BCD4] transition-colors">Hiring Analytics</a></li>
                    </ul>
                </div>

                {/* Column 3: Resources */}
                <div>
                    <h3 className="text-[#1C1C1C] font-bold mb-5 tracking-wide text-sm uppercase">Resources</h3>
                    <ul className="flex flex-col gap-3 text-sm text-slate-500">
                        <li><a href="#" className="hover:text-[#00BCD4] transition-colors">API Documentation</a></li>
                        <li><a href="#" className="hover:text-[#00BCD4] transition-colors">Enterprise Security</a></li>
                        <li><a href="#" className="hover:text-[#00BCD4] transition-colors">Case Studies</a></li>
                        <li><a href="#" className="hover:text-[#00BCD4] transition-colors">Help Center</a></li>
                    </ul>
                </div>

                {/* Column 4: Company */}
                <div>
                    <h3 className="text-[#1C1C1C] font-bold mb-5 tracking-wide text-sm uppercase">Company</h3>
                    <ul className="flex flex-col gap-3 text-sm text-slate-500">
                        <li><a href="#" className="hover:text-[#00BCD4] transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-[#00BCD4] transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-[#00BCD4] transition-colors">Contact Sales</a></li>
                        <li><a href="#" className="hover:text-[#00BCD4] transition-colors">Partners</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar: Copyright & Legal */}
            <div className="mx-auto max-w-7xl pt-8 border-t border-[#E1EFFF] flex flex-col items-center justify-between gap-4 md:flex-row text-xs text-slate-400">
                <p>© 2026 Xyvanta Intelligence. All rights reserved.</p>
                
                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-[#1C1C1C] transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-[#1C1C1C] transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-[#1C1C1C] transition-colors">Cookie Settings</a>
                </div>
            </div>
        </footer>
    );
}