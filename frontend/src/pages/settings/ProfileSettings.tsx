// import {
//     Building2,
//     Globe2,
//     Link,
//     Phone,
//     Save,
//     UserRound,
//     type LucideIcon,
// } from "lucide-react";

// import {
//     type ChangeEvent,
//     type FormEvent,
//     useEffect,
//     useState,
// } from "react";

// import GlassCard from "../../components/ui/GlassCard";
// import Button from "../../components/ui/Button";
// import Alert from "../../components/ui/Alert";
// import { useAuth } from "../../context/AuthContext";

// interface ProfileFormData {
//     name: string;
//     phone: string;
//     company: string;
//     designation: string;
//     linkedin: string;
//     country: string;
//     timezone: string;
//     bio: string;
// }

// interface InputProps {
//     icon: LucideIcon;
//     label: string;
//     name: keyof ProfileFormData;
//     value: string;
//     onChange: (
//         event: ChangeEvent<HTMLInputElement>,
//     ) => void;
// }

// export default function ProfileSettings() {
//     const { backendUser } = useAuth();

//     const [success, setSuccess] = useState("");
//     const [loading, setLoading] = useState(false);

//     const [formData, setFormData] = useState<ProfileFormData>({
//         name: "",
//         phone: "",
//         company: "",
//         designation: "",
//         linkedin: "",
//         country: "",
//         timezone: "",
//         bio: "",
//     });

//     useEffect(() => {
//         if (!backendUser) return;

//         setFormData({
//             name: backendUser?.user?.name || "",
//             phone: backendUser?.user?.phone || "",
//             company:
//                 backendUser?.user?.company ||
//                 backendUser?.user?.company_name ||
//                 "",
//             designation: backendUser?.user?.designation || "",
//             linkedin: backendUser?.user?.linkedin || "",
//             country: backendUser?.user?.country || "",
//             timezone: backendUser?.user?.timezone || "",
//             bio: backendUser?.user?.bio || "",
//         });
//     }, [backendUser]);

//     const handleChange = (
//         event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//     ) => {
//         const { name, value } = event.target;

//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (
//         event: FormEvent<HTMLFormElement>,
//     ) => {
//         event.preventDefault();

//         setLoading(true);
//         setSuccess("");

//         try {
//             await new Promise((resolve) =>
//                 setTimeout(resolve, 800),
//             );

//             setSuccess(
//                 "Profile updated locally. Backend update API can be connected next.",
//             );
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="space-y-8">
//             <section className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-cyan-500/15 via-sky-500/10 to-violet-500/15 p-8">
//                 <h1 className="text-4xl font-black text-white">
//                     Profile Settings
//                 </h1>

//                 <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
//                     Manage recruiter identity, organization details and
//                     professional information.
//                 </p>
//             </section>

//             {success && (
//                 <Alert
//                     type="success"
//                     message={success}
//                 />
//             )}

//             <form
//                 onSubmit={handleSubmit}
//                 className="grid gap-6 xl:grid-cols-2"
//             >
//                 <GlassCard className="space-y-5">
//                     <h2 className="text-2xl font-black text-white">
//                         Basic Information
//                     </h2>

//                     <Input
//                         icon={UserRound}
//                         label="Full Name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                     />

//                     <Input
//                         icon={Phone}
//                         label="Phone Number"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                     />

//                     <Input
//                         icon={Building2}
//                         label="Company"
//                         name="company"
//                         value={formData.company}
//                         onChange={handleChange}
//                     />

//                     <Input
//                         icon={UserRound}
//                         label="Designation"
//                         name="designation"
//                         value={formData.designation}
//                         onChange={handleChange}
//                     />
//                 </GlassCard>

//                 <GlassCard className="space-y-5">
//                     <h2 className="text-2xl font-black text-white">
//                         Professional Details
//                     </h2>

//                     <Input
//                         icon={Link}
//                         label="LinkedIn"
//                         name="linkedin"
//                         value={formData.linkedin}
//                         onChange={handleChange}
//                     />

//                     <Input
//                         icon={Globe2}
//                         label="Country"
//                         name="country"
//                         value={formData.country}
//                         onChange={handleChange}
//                     />

//                     <Input
//                         icon={Globe2}
//                         label="Timezone"
//                         name="timezone"
//                         value={formData.timezone}
//                         onChange={handleChange}
//                     />

//                     <div>
//                         <label className="mb-2 block text-sm font-bold text-slate-300">
//                             Recruiter Bio
//                         </label>

//                         <textarea
//                             rows={6}
//                             name="bio"
//                             value={formData.bio}
//                             onChange={handleChange}
//                             placeholder="Tell candidates and recruiters about yourself..."
//                             className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white outline-none transition focus:border-cyan-400"
//                         />
//                     </div>
//                 </GlassCard>

//                 <GlassCard className="xl:col-span-2">
//                     <div className="flex flex-wrap items-center justify-between gap-4">
//                         <div>
//                             <h2 className="text-xl font-black text-white">
//                                 Account Information
//                             </h2>

//                             <p className="mt-2 text-sm text-slate-400">
//                                 Email and role are managed through Firebase
//                                 authentication.
//                             </p>
//                         </div>

//                         <div className="space-y-2 text-right text-sm">
//                             <p className="text-slate-400">Email</p>

//                             <p className="font-bold text-white">
//                                 {backendUser?.email || "Not available"}
//                             </p>

//                             <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-xs font-black uppercase tracking-wide text-cyan-200">
//                                 {backendUser?.role || "Recruiter"}
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mt-8 flex justify-end">
//                         <Button
//                             type="submit"
//                             disabled={loading}
//                         >
//                             <Save
//                                 size={16}
//                                 className="mr-2"
//                             />

//                             {loading ? "Saving..." : "Save Changes"}
//                         </Button>
//                     </div>
//                 </GlassCard>
//             </form>
//         </div>
//     );
// }

// function Input({
//     icon: Icon,
//     label,
//     ...props
// }: InputProps) {
//     return (
//         <div>
//             <label className="mb-2 block text-sm font-bold text-slate-300">
//                 {label}
//             </label>

//             <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4">
//                 <Icon
//                     size={18}
//                     className="text-cyan-300"
//                 />

//                 <input
//                     {...props}
//                     className="w-full bg-transparent py-4 text-sm text-white outline-none"
//                 />
//             </div>
//         </div>
//     );
// }