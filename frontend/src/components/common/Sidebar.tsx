import {
    FileSearch,
    History,
    LayoutDashboard,
    ShieldCheck,
    Trophy,
    UploadCloud,
    UserCheck
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
    {
        title: "Dashboard",
        subtitle: "Workspace overview",
        icon: LayoutDashboard,
        path: "/recruiter/dashboard",
    },
    {
        title: "Match Studio",
        subtitle: "Upload JD & CV",
        icon: UploadCloud,
        path: "/recruiter/resumes",
    },
    {
        title: "Ranking",
        subtitle: "Candidate decisions",
        icon: Trophy,
        path: "/recruiter/ranking",
    },
    {
        title: "Decisions",
        subtitle: "Shortlist / Hold / Reject",
        icon: UserCheck,
        path: "/recruiter/decisions",
    },
    {
        title: "History",
        subtitle: "Saved reports",
        icon: History,
        path: "/recruiter/history",
    },
    {
        title: "JD Manager",
        subtitle: "Parsed JD library",
        icon: FileSearch,
        path: "/recruiter/jd-manager",
    },
    // {
    //     title: "Profile Settings",
    //     path: "/recruiter/settings/profile",
    // },
    // {
    //     title: "Security",
    //     path: "/recruiter/settings/security",
    // }
];

export default function Sidebar() {
    return (
        <>
            <aside className="fixed left-0 top-20 z-40 hidden h-[calc(100vh-80px)] w-[280px] border-r border-white/10 bg-[#313C4E] px-4 py-6 shadow-[10px_0_30px_rgba(15,23,42,0.12)] xl:block">
                <div className="flex h-full flex-col justify-between">
                    <div>
                        <div className="mb-5 rounded-[1.7rem] border border-white/10 bg-[#3B475B] p-4 shadow-sm">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                                Recruiter Suite
                            </p>

                            <h2 className="mt-2 text-xl font-black text-white">
                                Hiring Console
                            </h2>

                            <p className="mt-1 text-xs font-medium text-slate-300">
                                AI parsing, scoring and decisions.
                            </p>
                        </div>

                        <nav className="space-y-2">
                            {links.map((link) => {
                                const Icon = link.icon;

                                return (
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        className={({ isActive }) =>
                                            `group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all ${isActive
                                                ? "bg-white/10 text-white shadow-sm ring-1 ring-sky-300/20"
                                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <div
                                                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${isActive
                                                        ? "border-sky-300/40 bg-sky-400/15 text-sky-300"
                                                        : "border-white/10 bg-white/5 text-slate-400 group-hover:border-sky-300/30 group-hover:text-sky-300"
                                                        }`}
                                                >
                                                    <Icon size={19} />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-black">
                                                        {link.title}
                                                    </p>

                                                    <p className="text-[11px] font-medium text-slate-400">
                                                        {link.subtitle}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="relative overflow-hidden rounded-[2rem] border border-[#5B4639] bg-[#43352D] p-5 shadow-sm">
                        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-300/20 blur-2xl" />

                        <div className="relative">

                            <h3 className="text-base font-black text-[#F7E7D8]">
                                System Healthy
                            </h3>

                            <p className="mt-2 text-xs font-medium leading-relaxed text-[#D9C4B5]">
                                Deterministic scoring and multilingual parsing are active.
                            </p>

                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-300">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                Live engine
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#313C4E]/95 px-2 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.16)] backdrop-blur-xl xl:hidden">
                <div className="flex justify-around">
                    {links.map((link) => {
                        const Icon = link.icon;

                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className="flex w-16 flex-col items-center gap-1 rounded-2xl px-2 py-2"
                            >
                                {({ isActive }) => (
                                    <>
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isActive
                                                ? "bg-sky-400/15 text-sky-300"
                                                : "text-slate-400"
                                                }`}
                                        >
                                            <Icon size={18} />
                                        </div>

                                        <span
                                            className={`text-[9px] font-black uppercase ${isActive
                                                ? "text-white"
                                                : "text-slate-400"
                                                }`}
                                        >
                                            {link.title.split(" ")[0]}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}