import type { LucideIcon } from "lucide-react";

export default function RecruiterStatCard({
    title,
    value,
    icon: Icon,
    tone = "sky",
}: {
    title: string;
    value: string | number;
    icon: LucideIcon;
    tone?: "sky" | "violet" | "emerald" | "brown";
}) {
    const tones = {
        sky: "bg-sky-50 text-sky-600 border-sky-100",
        violet: "bg-violet-50 text-violet-600 border-violet-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        brown: "bg-[#F7F0E8] text-[#7A5A47] border-[#E6D8C8]",
    };

    return (
        <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-sky-100 hover:shadow-lg">
            <Icon
                size={130}
                className="absolute -right-8 -top-8 text-slate-900 opacity-[0.025] transition group-hover:scale-110"
            />

            <div className="relative">
                <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border ${tones[tone]}`}
                >
                    <Icon size={24} />
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {title}
                </p>

                <p className="mt-2 text-4xl font-black text-[#1E3A5F]">
                    {value}
                </p>
            </div>
        </div>
    );
}