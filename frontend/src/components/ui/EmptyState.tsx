import { FileSearch } from "lucide-react";

type EmptyStateProps = {
    title: string;
    description: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <div className="relative flex min-h-[340px] flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-100 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#F7F0E8] blur-3xl" />

            <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-600">
                <FileSearch size={28} />
            </div>

            <h3 className="relative text-2xl font-black text-[#1E3A5F]">
                {title}
            </h3>

            <p className="relative mt-2 max-w-md text-sm font-medium leading-relaxed text-slate-500">
                {description}
            </p>
        </div>
    );
}