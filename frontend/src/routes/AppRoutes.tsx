import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import UploadCrop from "../pages/crop/UploadCrop";
import Result from "../pages/crop/Result";
import Profile from "../pages/profile/Profile";
import Chatbot from "../pages/chat/Chatbot";
import NotFound from "../pages/NotFound";
import Layout from "../components/layout/Layout";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* App Layout */}
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/crop/upload" element={<UploadCrop />} />
                    <Route path="/crop/result" element={<Result />} />
                    <Route path="/chat" element={<Chatbot />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
