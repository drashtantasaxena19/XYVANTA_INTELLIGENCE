import { formatValue } from "../report/reportFormatters";

export default function MatchMiniStat({
    label,
    value,
}: {
    label: string;
    value: any;
}) {
    return (
        <div className="group rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                {label}
            </p>

            <p className="mt-2 break-words text-2xl font-black text-[#1E3A5F]">
                {formatValue(value)}
            </p>
        </div>
    );
}