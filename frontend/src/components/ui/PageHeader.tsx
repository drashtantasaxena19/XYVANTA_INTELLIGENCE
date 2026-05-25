type PageHeaderProps = {
    title: string;
    subtitle?: string;
    badge?: string;
};

export default function PageHeader({
    title,
    subtitle,
    badge,
}: PageHeaderProps) {
    return (
        <section className="relative mb-8 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-100 blur-[90px]" />
            <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[#F7F0E8] blur-[80px]" />

            <div className="relative z-10">
                {badge && (
                    <div className="mb-5 inline-flex rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                        {badge}
                    </div>
                )}

                <h1 className="max-w-4xl text-4xl font-black leading-tight text-[#1E3A5F] md:text-5xl">
                    {title}
                </h1>

                {subtitle && (
                    <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}