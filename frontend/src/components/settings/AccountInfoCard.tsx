import {
    Building2,
    Mail,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import GlassCard from "../ui/GlassCard";

interface Props {
    name?: string;
    email?: string;
    role?: string;
    company?: string;
}

export default function AccountInfoCard({
    name,
    email,
    role,
    company,
}: Props) {
    return (
        <GlassCard className="h-full">
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300">
                    <UserRound size={28} />
                </div>

                <div>
                    <h2 className="text-2xl font-black text-white">
                        Account Information
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Recruiter profile overview.
                    </p>
                </div>
            </div>

            <div className="mt-8 space-y-4">
                <InfoRow
                    icon={UserRound}
                    label="Full Name"
                    value={name}
                />

                <InfoRow
                    icon={Mail}
                    label="Email"
                    value={email}
                />

                <InfoRow
                    icon={Building2}
                    label="Company"
                    value={company}
                />

                <InfoRow
                    icon={ShieldCheck}
                    label="Role"
                    value={role}
                />
            </div>
        </GlassCard>
    );
}

function InfoRow({
    icon: Icon,
    label,
    value,
}: any) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-700/40 text-sky-300">
                <Icon size={18} />
            </div>

            <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    {label}
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                    {value || "Not Available"}
                </p>
            </div>
        </div>
    );
}