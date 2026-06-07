import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

export default function Header() {
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const { toggleLanguage, language, t } = useLanguage();

    // Load theme from localStorage
    useEffect(() => {
        const isDark = localStorage.getItem("theme") === "dark";
        setDarkMode(isDark);
        document.documentElement.classList.toggle("dark", isDark);
    }, []);

    // Toggle dark mode
    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.documentElement.classList.toggle("dark", newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
    };

    return (
        <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

                {/* Logo */}
                <h1 className="text-xl font-bold text-green-700 dark:text-green-400">
                    Kisaan Saathi
                </h1>

                {/* DESKTOP NAVIGATION */}
                <nav className="hidden md:flex items-center gap-5 text-sm">

                    <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-green-600">
                        {t("navDashboard")}
                    </Link>

                    <Link to="/crop/upload" className="text-gray-700 dark:text-gray-300 hover:text-green-600">
                        {t("uploadCrop")}
                    </Link>

                    <Link to="/chat" className="text-gray-700 dark:text-gray-300 hover:text-green-600">
                        {t("aiHelp")}
                    </Link>

                    <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-green-600">
                        {t("profile")}
                    </Link>

                    {/* LANGUAGE TOGGLE (Desktop) */}
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1 rounded-md border text-xs
              bg-gray-100 dark:bg-gray-800
              text-gray-800 dark:text-gray-200"
                    >
                        {language === "en" ? "हिंदी" : "English"}
                    </button>

                    {/* DARK MODE TOGGLE (Desktop) */}
                    <button
                        onClick={toggleTheme}
                        className="px-3 py-1 rounded-md border text-xs
              bg-gray-100 dark:bg-gray-800
              text-gray-800 dark:text-gray-200"
                    >
                        {darkMode ? "☀" : "🌙"}
                    </button>
                </nav>

                {/* MOBILE HAMBURGER */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-2xl text-gray-700 dark:text-gray-200"
                >
                    ☰
                </button>
            </div>

            {/* MOBILE DROPDOWN MENU */}
            {menuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700 px-4 py-3 space-y-3">

                    <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="block text-gray-700 dark:text-gray-300"
                    >
                        {t("navDashboard")}
                    </Link>

                    <Link
                        to="/crop/upload"
                        onClick={() => setMenuOpen(false)}
                        className="block text-gray-700 dark:text-gray-300"
                    >
                        {t("uploadCrop")}
                    </Link>

                    <Link
                        to="/chat"
                        onClick={() => setMenuOpen(false)}
                        className="block text-gray-700 dark:text-gray-300"
                    >
                        {t("aiHelp")}
                    </Link>

                    <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="block text-gray-700 dark:text-gray-300"
                    >
                        {t("profile")}
                    </Link>

                    {/* LANGUAGE TOGGLE (Mobile) */}
                    <button
                        onClick={toggleLanguage}
                        className="w-full text-left px-3 py-2 rounded-md border
              bg-gray-100 dark:bg-gray-800
              text-gray-800 dark:text-gray-200 text-sm"
                    >
                        {language === "en" ? "हिंदी में देखें" : "View in English"}
                    </button>

                    {/* DARK MODE TOGGLE (Mobile) */}
                    <button
                        onClick={toggleTheme}
                        className="w-full text-left px-3 py-2 rounded-md border
              bg-gray-100 dark:bg-gray-800
              text-gray-800 dark:text-gray-200 text-sm"
                    >
                        {darkMode ? `${t("darkMode")} ☀` : `${t("darkMode")} 🌙`}
                    </button>

                </div>
            )}
        </header>
    );
}
