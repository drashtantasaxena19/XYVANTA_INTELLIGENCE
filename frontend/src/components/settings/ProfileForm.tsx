import {
    Building2,
    Globe2,
    Link,
    Phone,
    UserRound,
    type LucideIcon,
} from "lucide-react";

interface Props {
    formData: any;
    handleChange: (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>,
    ) => void;
}

export default function ProfileForm({
    formData,
    handleChange,
}: Props) {
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <div className="space-y-5">
                <Input
                    icon={UserRound}
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <Input
                    icon={Phone}
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <Input
                    icon={Building2}
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                />

                <Input
                    icon={UserRound}
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-5">
                <Input
                    icon={Link}
                    label="LinkedIn"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                />

                <Input
                    icon={Globe2}
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                />

                <Input
                    icon={Globe2}
                    label="Timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                />

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-300">
                        Recruiter Bio
                    </label>

                    <textarea
                        rows={6}
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white outline-none transition focus:border-sky-400"
                    />
                </div>
            </div>
        </div>
    );
}

interface InputProps {
    icon: LucideIcon;
    label: string;
    name: string;
    value: string;
    onChange: (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
}

function Input({
    icon: Icon,
    label,
    ...props
}: InputProps) {
    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
                {label}
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4">
                <Icon
                    size={18}
                    className="text-sky-300"
                />

                <input
                    {...props}
                    className="w-full bg-transparent py-4 text-sm text-white outline-none"
                />
            </div>
        </div>
    );
}