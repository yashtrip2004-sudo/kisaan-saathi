import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { dashboardCards } from "../../config/dashboardConfig";

export default function Dashboard() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
            <div className="max-w-6xl mx-auto">

                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400">
                        {t("dashboardTitle")}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {t("dashboardSubtitle")}
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardCards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => navigate(card.route)}
                            className="cursor-pointer bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition"
                        >
                            <div className={`h-28 w-full rounded-lg overflow-hidden mb-4 ${card.bgColor} ${card.darkBgColor} flex items-center justify-center`}>
                                <span className={`text-5xl ${card.iconColor} ${card.darkIconColor}`}>
                                    {card.icon}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                {t(card.titleKey as any)}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                {t(card.descKey as any)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer Tip */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-10 text-center">
                    {t("dashboardTip")}
                </p>

            </div>
        </div>
    );
}
