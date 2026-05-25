export default function Loader({
    text = "Loading Xyvanta Intelligence...",
}: {
    text?: string;
}) {
    return (
        <div className="flex min-h-[360px] flex-col items-center justify-center gap-5 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-sky-500" />
                <div className="absolute inset-4 rounded-full bg-sky-50" />
            </div>

            <div>
                <p className="text-sm font-black tracking-wide text-[#1E3A5F]">
                    {text}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                    Please wait while the workspace prepares your data.
                </p>
            </div>
        </div>
    );
}