import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import ReactMarkdown from "react-markdown";

export default function Result() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    const result = location.state?.result;
    const error = location.state?.error;

    if (!result && !error) {
        return <Navigate to="/crop/upload" />;
    }

    if (error || !result) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold text-lg mb-2">⚠️ Diagnosis Failed</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{error || "The AI server could not process your image. Please try again."}</p>
                    <button onClick={() => navigate("/crop/upload")} className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">

            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">

                <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 text-center">
                    {t("cropHealthReport")}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-1">
                    {t("aiAnalysisResult")}
                </p>

                {/* Summary */}
                <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{t("crop")}</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{result.crop}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{t("detectedIssue")}</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                            {result.disease}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{t("confidence")}</span>
                        <span className="font-medium text-green-700 dark:text-green-400">
                            {result.confidence}%
                        </span>
                    </div>
                </div>

                {/* Advice */}
                <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        {t("recommendedActions")}
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-3">
                        {result.advice?.map((item: string, index: number) => (
                            <li key={index} className="pl-1">
                                <div className="inline-block space-y-1 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4">
                                    <ReactMarkdown>
                                        {item}
                                    </ReactMarkdown>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                    {t("disclaimer")}
                </p>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                    <button
                        onClick={() => navigate("/chat")}
                        className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition"
                    >
                        {t("askAiAssistant")}
                    </button>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full border dark:border-gray-600 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        {t("backToDashboard2")}
                    </button>
                </div>

            </div>
        </div>
    );
}

