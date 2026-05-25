import {
    AlertTriangle,
    LogOut,
} from "lucide-react";

import Button from "../ui/Button";
import GlassCard from "../ui/GlassCard";

interface Props {
    onLogout: () => Promise<void>;
}

export default function DangerZone({
    onLogout,
}: Props) {
    return (
        <GlassCard className="border border-red-500/20">
            <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
                    <AlertTriangle size={24} />
                </div>

                <div className="flex-1">
                    <h2 className="text-2xl font-black text-white">
                        Danger Zone
                    </h2>

                    <p className="mt-2 text-sm leading-7 text-slate-400">
                        Be careful with account actions.
                        Logging out will end your recruiter session.
                    </p>

                    <div className="mt-6">
                        <Button
                            onClick={onLogout}
                            className="bg-red-500 hover:bg-red-400"
                        >
                            <LogOut
                                size={16}
                                className="mr-2"
                            />

                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}