import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import Signup from "../pages/public/Signup";
// import ProfileSettings from "../pages/settings/ProfileSettings";
// import SecuritySettings from "../pages/settings/SecuritySettings";
import RecruiterDashboard from "../pages/recruiter/Dashboard";
import ResumeUpload from "../pages/recruiter/ResumeUpload";
import CandidateRanking from "../pages/recruiter/CandidateRanking";
import CandidateReport from "../pages/recruiter/CandidateReport";
import AnalysisHistory from "../pages/recruiter/AnalysisHistory";
import JDManager from "../pages/recruiter/JDManager";
import CandidateDecisions from "../pages/recruiter/CandidateDecisions";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                    <Route path="/recruiter/resumes" element={<ResumeUpload />} />
                    <Route path="/recruiter/ranking" element={<CandidateRanking />} />
                    <Route path="/recruiter/decisions" element={<CandidateDecisions />} />
                    <Route path="/recruiter/report/:analysisId" element={<CandidateReport />} />
                    <Route path="/recruiter/history" element={<AnalysisHistory />} />
                    <Route path="/recruiter/jd-manager" element={<JDManager />} />
                    <Route
//     path="/recruiter/settings/profile"
//     element={<ProfileSettings />}
// />

// <Route
//     path="/recruiter/settings/security"
//     element={<SecuritySettings />}
/>
                </Route>
            </Route>

            <Route
                path="/recruiter"
                element={<Navigate to="/recruiter/dashboard" replace />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}