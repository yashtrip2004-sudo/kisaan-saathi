import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../utils/api";

export default function UploadCrop() {
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [crop, setCrop] = useState("");
    const [customCrop, setCustomCrop] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);

        // Create preview
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const selectedCrop = crop === "other" ? customCrop : crop;
            
            if (!image) {
                alert("Please select an image");
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("file", image);
            formData.append("crop", selectedCrop);
            formData.append("language", language);

            const result = await api.uploadCrop(formData);
            navigate("/crop/result", { state: { result } });
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
            navigate("/crop/result", { state: { error: errorMsg } });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">

            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">

                <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 text-center">
                    {t("uploadCropTitle")}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-1">
                    {t("uploadCropSubtitle")}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                    {/* Crop Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t("selectCrop")}
                        </label>
                        <select
                            value={crop}
                            onChange={(e) => setCrop(e.target.value)}
                            disabled={isLoading}
                            className="mt-1 w-full border dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 bg-white dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                        >
                            <option value="">{t("selectCropPlaceholder")}</option>
                            <option value="wheat">{t("wheat")}</option>
                            <option value="rice">{t("rice")}</option>
                            <option value="tomato">{t("tomato")}</option>
                            <option value="potato">{t("potato")}</option>
                            <option value="other">{t("other")}</option>
                        </select>
                    </div>

                    {/* Custom Crop Input */}
                    {crop === "other" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("enterCropName")}
                            </label>
                            <input
                                type="text"
                                value={customCrop}
                                onChange={(e) => setCustomCrop(e.target.value)}
                                placeholder={t("enterCropName")}
                                disabled={isLoading}
                                className="mt-1 w-full border dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 bg-white dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                            />
                        </div>
                    )}

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t("uploadImage")}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isLoading}
                            className="mt-1 w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-gray-700 dark:file:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t("uploadTip")}
                        </p>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Preview:
                            </p>
                            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t("analyzing")}
                            </>
                        ) : (
                            t("analyzeCrop")
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
}
