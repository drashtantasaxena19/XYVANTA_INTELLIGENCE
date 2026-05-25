import {
    FileText,
    Paperclip,
    UploadCloud,
    X,
} from "lucide-react";

import GlassCard from "../../ui/GlassCard";

export default function MatchUploadPanel({
    title,
    subtitle,
    files,
    inputMultiple,
    onFiles,
    onRemove,
}: {
    title: string;
    subtitle: string;
    files: File[];
    inputMultiple: boolean;
    onFiles: (files: FileList | null) => void;
    onRemove: (index: number) => void;
}) {
    return (
        <GlassCard className="overflow-hidden">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                        Upload Panel
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-[#1E3A5F]">
                        {title}
                    </h2>

                    <p className="mt-1.5 text-sm font-medium text-slate-500">
                        {subtitle}
                    </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#E6D8C8] bg-[#F7F0E8] text-[#7A5A47]">
                    <Paperclip size={21} />
                </div>
            </div>

            <label className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center transition-all hover:border-sky-300 hover:bg-sky-50">
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-sky-100 blur-3xl transition group-hover:bg-sky-200" />

                <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-sky-100 bg-white text-sky-600 shadow-sm transition group-hover:scale-105">
                    <UploadCloud size={30} />
                </div>

                <span className="relative text-base font-black text-[#1E3A5F]">
                    Click or drag files here
                </span>

                <span className="relative mt-2 text-xs font-semibold text-slate-500">
                    {inputMultiple
                        ? "Upload multiple PDF, DOCX, TXT, or MD files"
                        : "Upload a single PDF, DOCX, TXT, or MD file"}
                </span>

                <span className="relative mt-4 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    {inputMultiple ? "Multiple allowed" : "Single file only"}
                </span>

                <input
                    type="file"
                    multiple={inputMultiple}
                    accept=".pdf,.docx,.txt,.md"
                    className="hidden"
                    onChange={(event) => onFiles(event.target.files)}
                />
            </label>

            {files.length > 0 && (
                <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                            Attached Files
                        </p>

                        <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-sky-600">
                            {files.length} {files.length === 1 ? "File" : "Files"}
                        </span>
                    </div>

                    <div className="custom-scrollbar max-h-[320px] space-y-3 overflow-y-auto pr-1">
                        {files.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="group flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition hover:border-sky-100 hover:bg-slate-50"
                            >
                                <div className="flex min-w-0 items-center gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sky-600 transition group-hover:bg-sky-50">
                                        <FileText size={18} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-black text-slate-800">
                                            {file.name}
                                        </p>

                                        <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={(event) => {
                                        event.preventDefault();
                                        onRemove(index);
                                    }}
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                    title="Remove file"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </GlassCard>
    );
}