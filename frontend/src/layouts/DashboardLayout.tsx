import { Outlet } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-[#F3F5F9] text-slate-900">
            <Navbar />
            <Sidebar />

            <main className="min-h-screen px-4 pb-24 pt-24 sm:px-6 lg:px-8 xl:ml-[280px] xl:pb-12">
                <div className="mx-auto w-full max-w-[1500px] animate-slide-up">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}