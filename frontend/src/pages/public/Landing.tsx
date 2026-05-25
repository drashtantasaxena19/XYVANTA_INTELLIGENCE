import React from "react";
import {
    ArrowRight,
    BarChart3,
    BrainCircuit,
    CheckCircle2,
    ClipboardCheck,
    FileSearch,
    Globe2,
    Layers3,
    MessageSquareText,
    ShieldCheck,
    Sparkles,
    Trophy,
    UploadCloud,
    UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#F3F5F9] font-sans text-slate-900">
            <Navbar />

            <main className="overflow-hidden pt-20">
                <section className="relative bg-[#273142]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(14,165,233,0.24),transparent_32%),radial-gradient(circle_at_85%_70%,rgba(176,137,104,0.28),transparent_34%)]" />

                    <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
                        <div className="flex flex-col justify-center">
                            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-200">
                                <Sparkles size={15} />
                                Recruiter Intelligence Platform
                            </div>

                            <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                                Hire faster with structured AI candidate intelligence.
                            </h1>

                            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-slate-300">
                                Upload job descriptions and resumes, compare candidates
                                with deterministic scoring, review evidence tables, and
                                make recruiter decisions from one professional workspace.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#7A5A47] bg-[#B08968] px-6 py-3.5 text-sm font-black text-white shadow-[0_10px_28px_rgba(176,137,104,0.3)] transition hover:-translate-y-0.5 hover:bg-sky-500"
                                >
                                    Start Hiring
                                    <ArrowRight size={18} />
                                </Link>

                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-6 py-3.5 text-sm font-black text-white transition hover:bg-white hover:text-[#273142]"
                                >
                                    Login to Workspace
                                </Link>
                            </div>

                            <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                <TrustPill text="Deterministic scoring" />
                                <TrustPill text="Comparison table" />
                                <TrustPill text="Recruiter decisions" />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-[2.5rem] border border-white/10 bg-white/10 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur">
                                <div className="rounded-[2rem] bg-white p-5">
                                    <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                                                Live Match Report
                                            </p>

                                            <h3 className="mt-1 text-xl font-black text-[#1E3A5F]">
                                                Electronic Engineer Hiring
                                            </h3>

                                            <p className="mt-1 text-xs font-semibold text-slate-500">
                                                Maintenance · Testing · Industrial Systems
                                            </p>
                                        </div>

                                        <div className="w-fit rounded-2xl bg-[#313C4E] px-4 py-3 text-right text-white">
                                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-300">
                                                Score
                                            </p>
                                            <p className="text-2xl font-black">91%</p>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid gap-3">
                                        <DemoRow
                                            label="Skills"
                                            value="PLC, Circuit Testing, Maintenance"
                                            status="Matched"
                                        />
                                        <DemoRow
                                            label="Experience"
                                            value="2.5 years electronics maintenance"
                                            status="Strong"
                                        />
                                        <DemoRow
                                            label="Tools"
                                            value="Multimeter, Oscilloscope, AutoCAD Electrical"
                                            status="Good"
                                        />
                                    </div>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-[#E6D8C8] bg-[#F7F0E8] p-4">
                                            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7A5A47]">
                                                Recruiter Decision
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                                                    Shortlist
                                                </span>
                                                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#7A5A47]">
                                                    Hold
                                                </span>
                                                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-red-500">
                                                    Reject
                                                </span>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                                            <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-700">
                                                Join Chance
                                            </p>

                                            <div className="mt-3 flex items-end justify-between gap-3">
                                                <p className="text-4xl font-black leading-none text-[#1E3A5F]">
                                                    78%
                                                </p>
                                                <p className="text-xs font-bold leading-relaxed text-slate-500">
                                                    Good alignment with role and location.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        <StatCard label="Resume Files" value="PDF / DOCX" icon={<UploadCloud />} />
                        <StatCard label="Scoring" value="Explainable" icon={<Trophy />} />
                        <StatCard label="Reports" value="Evidence-led" icon={<FileSearch />} />
                        <StatCard label="Scale" value="Any role" icon={<Globe2 />} />
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <PhotoCard
                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=900&auto=format&fit=crop"
                            title="Recruiter Collaboration"
                            text="Teams can review candidates with clear scoring evidence."
                        />
                        <PhotoCard
                            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=900&auto=format&fit=crop"
                            title="Hiring Meetings"
                            text="Use reports to make faster shortlist decisions."
                        />
                        <PhotoCard
                            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=900&auto=format&fit=crop"
                            title="AI Workspace"
                            text="Analyze resumes and JDs from one professional dashboard."
                        />
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                                How to use
                            </p>
                            <h2 className="mt-3 text-3xl font-black text-[#1E3A5F] md:text-4xl">
                                A simple recruiter workflow from upload to decision.
                            </h2>
                        </div>

                        <div className="mt-10 grid gap-5 lg:grid-cols-4">
                            <HowStep
                                step="01"
                                icon={<UploadCloud />}
                                title="Upload files"
                                text="Upload one or multiple JDs and candidate resumes."
                            />
                            <HowStep
                                step="02"
                                icon={<BrainCircuit />}
                                title="AI parsing"
                                text="The system extracts skills, experience, education, location and role data."
                            />
                            <HowStep
                                step="03"
                                icon={<BarChart3 />}
                                title="Review scores"
                                text="Check final score, score breakdown and comparison evidence."
                            />
                            <HowStep
                                step="04"
                                icon={<ClipboardCheck />}
                                title="Take decision"
                                text="Shortlist, hold or reject candidates using recruiter feedback."
                            />
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <FeaturePanel
                            icon={<Layers3 />}
                            title="Full comparison matrix"
                            text="Compare single JD vs many CVs, many JDs vs one CV, or complete JD-CV matrix results."
                        />
                        <FeaturePanel
                            icon={<MessageSquareText />}
                            title="Human-readable evidence"
                            text="Every match includes structured evidence so recruiters can understand why a candidate scored high or low."
                        />
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="rounded-[2.5rem] bg-[#313C4E] p-8 shadow-sm lg:p-12">
                        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                                    Why Xyvanta
                                </p>
                                <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-4xl">
                                    Built for serious recruiter workflows, not random AI output.
                                </h2>
                                <p className="mt-4 text-sm font-medium leading-relaxed text-slate-300">
                                    AI helps with parsing, but ranking remains deterministic,
                                    stable and auditable. This makes the platform safer for
                                    client demos and recruiter decisions.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <ReasonCard title="Stable scoring" text="Same JD and CV produce consistent score." />
                                <ReasonCard title="Evidence table" text="JD requirement and CV evidence are shown side by side." />
                                <ReasonCard title="Decision tracking" text="Recruiter actions can be stored for future learning." />
                                <ReasonCard title="Role flexible" text="Works for IT, operations, technical and non-technical jobs." />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 text-center shadow-sm lg:p-12">
                        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-sky-100 blur-[90px]" />
                        <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#F7F0E8] blur-[80px]" />

                        <div className="relative mx-auto max-w-3xl">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                                Start now
                            </p>
                            <h2 className="mt-3 text-3xl font-black text-[#1E3A5F] md:text-4xl">
                                Ready to analyze your first JD and resume set?
                            </h2>
                            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500">
                                Create a workspace and start building recruiter-ready reports.
                            </p>

                            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#B08968] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-500"
                                >
                                    Get Started
                                    <ArrowRight size={18} />
                                </Link>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3.5 text-sm font-black text-[#1E3A5F] transition hover:bg-white"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function TrustPill({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs font-bold text-slate-200">
            <CheckCircle2 size={15} className="text-sky-300" />
            {text}
        </div>
    );
}

function DemoRow({ label, value, status }: { label: string; value: string; status: string }) {
    return (
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[110px_1fr_88px] sm:items-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
            <p className="min-w-0 text-sm font-bold text-slate-700">{value}</p>
            <p className="rounded-full bg-sky-50 px-3 py-1 text-center text-xs font-black text-sky-700">{status}</p>
        </div>
    );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-600">
                {React.cloneElement(icon as React.ReactElement, { size: 24 })}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-black text-[#1E3A5F]">{value}</p>
        </div>
    );
}

function PhotoCard({ src, title, text }: { src: string; title: string; text: string }) {
    return (
        <div className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="h-56 overflow-hidden">
                <img src={src} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-black text-[#1E3A5F]">{title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">{text}</p>
            </div>
        </div>
    );
}

function HowStep({ step, icon, title, text }: { step: string; icon: React.ReactNode; title: string; text: string }) {
    return (
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#313C4E] text-sky-300">
                    {React.cloneElement(icon as React.ReactElement, { size: 24 })}
                </div>
                <span className="text-4xl font-black text-slate-200">{step}</span>
            </div>
            <h3 className="mt-6 text-xl font-black text-[#1E3A5F]">{title}</h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">{text}</p>
        </div>
    );
}

function FeaturePanel({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
    return (
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-100 blur-3xl" />
            <div className="relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E6D8C8] bg-[#F7F0E8] text-[#7A5A47]">
                    {React.cloneElement(icon as React.ReactElement, { size: 30 })}
                </div>
                <h3 className="text-2xl font-black text-[#1E3A5F]">{title}</h3>
                <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500">{text}</p>
            </div>
        </div>
    );
}

function ReasonCard({ title, text }: { title: string; text: string }) {
    return (
        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
            <h3 className="text-lg font-black text-white">{title}</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-300">{text}</p>
        </div>
    );
}