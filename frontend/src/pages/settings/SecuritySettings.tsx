// import {
//     KeyRound,
//     LockKeyhole,
//     ShieldCheck,
// } from "lucide-react";

// import { useState } from "react";

// import {
//     EmailAuthProvider,
//     reauthenticateWithCredential,
//     updatePassword,
// } from "firebase/auth";

// import GlassCard from "../../components/ui/GlassCard";
// import Button from "../../components/ui/Button";
// import Alert from "../../components/ui/Alert";

// import { useAuth } from "../../context/AuthContext";

// interface SecurityFormData {
//     currentPassword: string;
//     newPassword: string;
//     confirmPassword: string;
// }

// export default function SecuritySettings() {
//     const { firebaseUser, backendUser } = useAuth();

//     const [formData, setFormData] = useState<SecurityFormData>({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//     });

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const handleChange = (
//         event: React.ChangeEvent<HTMLInputElement>,
//     ) => {
//         const { name, value } = event.target;

//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handlePasswordChange = async (
//         event: React.FormEvent<HTMLFormElement>,
//     ) => {
//         event.preventDefault();

//         setError("");
//         setSuccess("");

//         if (!formData.currentPassword) {
//             setError("Please enter your current password.");
//             return;
//         }

//         if (formData.newPassword.length < 6) {
//             setError("Password must contain at least 6 characters.");
//             return;
//         }

//         if (formData.newPassword !== formData.confirmPassword) {
//             setError("Passwords do not match.");
//             return;
//         }

//         if (!firebaseUser?.email) {
//             setError("Unable to verify user.");
//             return;
//         }

//         setLoading(true);

//         try {
//             const credential = EmailAuthProvider.credential(
//                 firebaseUser.email,
//                 formData.currentPassword,
//             );

//             await reauthenticateWithCredential(firebaseUser, credential);
//             await updatePassword(firebaseUser, formData.newPassword);

//             setSuccess("Password updated successfully.");
//             setFormData({
//                 currentPassword: "",
//                 newPassword: "",
//                 confirmPassword: "",
//             });
//         } catch (error) {
//             console.error(error);
//             setError(
//                 "Failed to update password. Please verify your current password.",
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="space-y-8">
//             <section className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-cyan-500/15 p-8">
//                 <h1 className="text-4xl font-black text-white">
//                     Security Settings
//                 </h1>

//                 <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
//                     Protect your recruiter account with secure password and
//                     authentication settings.
//                 </p>
//             </section>

//             {error && <Alert type="error" message={error} />}
//             {success && <Alert type="success" message={success} />}

//             <form
//                 onSubmit={handlePasswordChange}
//                 className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
//             >
//                 <GlassCard className="space-y-5">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
//                             <LockKeyhole size={24} />
//                         </div>

//                         <div>
//                             <h2 className="text-2xl font-black text-white">
//                                 Change Password
//                             </h2>

//                             <p className="mt-1 text-sm text-slate-400">
//                                 Update your account password securely.
//                             </p>
//                         </div>
//                     </div>

//                     <PasswordInput
//                         label="Current Password"
//                         name="currentPassword"
//                         value={formData.currentPassword}
//                         onChange={handleChange}
//                     />

//                     <PasswordInput
//                         label="New Password"
//                         name="newPassword"
//                         value={formData.newPassword}
//                         onChange={handleChange}
//                     />

//                     <PasswordInput
//                         label="Confirm Password"
//                         name="confirmPassword"
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                     />

//                     <div className="flex justify-end pt-4">
//                         <Button type="submit" disabled={loading}>
//                             <KeyRound size={16} className="mr-2" />
//                             {loading ? "Updating..." : "Update Password"}
//                         </Button>
//                     </div>
//                 </GlassCard>

//                 <GlassCard>
//                     <div className="flex h-full flex-col">
//                         <div className="flex items-center gap-3">
//                             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
//                                 <ShieldCheck size={24} />
//                             </div>

//                             <div>
//                                 <h2 className="text-2xl font-black text-white">
//                                     Security Status
//                                 </h2>

//                                 <p className="mt-1 text-sm text-slate-400">
//                                     Current recruiter account protection.
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="mt-8 space-y-4">
//                             <StatusCard
//                                 label="Authentication"
//                                 value="Firebase Secure Auth"
//                             />

//                             <StatusCard
//                                 label="Role"
//                                 value={backendUser?.role || "Recruiter"}
//                             />

//                             <StatusCard
//                                 label="Password Security"
//                                 value="Protected"
//                             />

//                             <StatusCard
//                                 label="Session"
//                                 value="Active"
//                             />
//                         </div>

//                         <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
//                             <p className="text-sm font-bold text-amber-200">
//                                 Security Tip
//                             </p>

//                             <p className="mt-2 text-xs leading-6 text-amber-100/80">
//                                 Use a strong password with numbers, symbols and
//                                 uppercase/lowercase letters.
//                             </p>
//                         </div>
//                     </div>
//                 </GlassCard>
//             </form>
//         </div>
//     );
// }

// interface PasswordInputProps {
//     label: string;
//     name: keyof SecurityFormData;
//     value: string;
//     onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
// }

// function PasswordInput({
//     label,
//     ...props
// }: PasswordInputProps) {
//     return (
//         <div>
//             <label className="mb-2 block text-sm font-bold text-slate-300">
//                 {label}
//             </label>

//             <input
//                 type="password"
//                 {...props}
//                 className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-sm text-white outline-none transition focus:border-violet-400"
//             />
//         </div>
//     );
// }

// interface StatusCardProps {
//     label: string;
//     value: string;
// }

// function StatusCard({ label, value }: StatusCardProps) {
//     return (
//         <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
//             <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
//                 {label}
//             </p>

//             <p className="mt-2 text-sm font-bold text-white">{value}</p>
//         </div>
//     );
// }