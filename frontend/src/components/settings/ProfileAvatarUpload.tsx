import {
    Camera,
    UserRound,
} from "lucide-react";

import { useState } from "react";

import GlassCard from "../ui/GlassCard";

export default function ProfileAvatarUpload() {
    const [preview, setPreview] =
        useState<string | null>(null);

    const handleFile = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) return;

        const imageUrl =
            URL.createObjectURL(file);

        setPreview(imageUrl);
    };

    return (
        <GlassCard>
            <div className="flex flex-col items-center">
                <div className="relative">
                    <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-slate-600 bg-gradient-to-br from-slate-700 to-slate-800">
                        {preview ? (
                            <img
                                src={preview}
                                alt="avatar"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <UserRound
                                size={64}
                                className="text-slate-400"
                            />
                        )}
                    </div>

                    <label className="absolute bottom-2 right-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-sky-500 text-white shadow-lg transition hover:bg-sky-400">
                        <Camera size={18} />

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFile}
                        />
                    </label>
                </div>

                <h2 className="mt-6 text-2xl font-black text-white">
                    Recruiter Avatar
                </h2>

                <p className="mt-2 text-center text-sm leading-6 text-slate-400">
                    Upload a professional recruiter profile image.
                </p>
            </div>
        </GlassCard>
    );
}