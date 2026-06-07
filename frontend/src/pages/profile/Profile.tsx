import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../utils/api";

export default function Profile() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        state: "",
        district: "",
        crops: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const user = await api.getProfile();
                setForm({
                    name: user.name || "",
                    mobile: user.phone || "",
                    state: user.state || "",
                    district: user.district || "",
                    crops: user.cropTypes?.join(", ") || "",
                });
            } catch (err) {
                console.error("Could not load profile", err);
            }
        };
        loadProfile();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.saveProfile(form as any);
            alert(t("profileSaved"));
        } catch (err) {
            alert(t("errorOccurred") || "Error saving profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">

            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">

                <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 text-center">
                    {t("myProfile")}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-1">
                    {t("farmerDetails")}
                </p>

                <form onSubmit={handleSave} className="mt-6 space-y-4">

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder={t("fullName")}
                        className="w-full border dark:border-gray-600 px-4 py-2 rounded-md bg-white dark:bg-gray-700 dark:text-white"
                    />

                    <input
                        name="mobile"
                        value={form.mobile}
                        disabled
                        placeholder={t("mobileNumber")}
                        className="w-full border dark:border-gray-600 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-600 dark:text-gray-300 cursor-not-allowed"
                    />

                    <input
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder={t("state")}
                        className="w-full border dark:border-gray-600 px-4 py-2 rounded-md bg-white dark:bg-gray-700 dark:text-white"
                    />

                    <input
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        placeholder={t("district")}
                        className="w-full border dark:border-gray-600 px-4 py-2 rounded-md bg-white dark:bg-gray-700 dark:text-white"
                    />

                    <input
                        name="crops"
                        value={form.crops}
                        onChange={handleChange}
                        placeholder={t("cropsGrown")}
                        className="w-full border dark:border-gray-600 px-4 py-2 rounded-md bg-white dark:bg-gray-700 dark:text-white"
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition disabled:opacity-50"
                    >
                        {isLoading ? "..." : t("saveProfile")}
                    </button>
                </form>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-sm text-green-700 dark:text-green-400 mt-4 w-full hover:underline"
                >
                    {t("backToDashboard")}
                </button>

            </div>
        </div>
    );
}
