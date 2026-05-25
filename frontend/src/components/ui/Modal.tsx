import type { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
    open: boolean;
    title: string;
    description?: string;
    children?: ReactNode;
    onClose: () => void;
};

export default function Modal({
    open,
    title,
    description,
    children,
    onClose,
}: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0F172A]/45 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg animate-slide-up overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.25)]">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-[#1E3A5F]">
                                {title}
                            </h2>

                            {description && (
                                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                                    {description}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="px-6 py-6">{children}</div>
            </div>
        </div>
    );
}