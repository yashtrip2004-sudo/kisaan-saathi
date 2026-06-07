import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../utils/api";

export default function Register() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const validateName = (name: string): string => {
        if (!name) return t("fieldRequired");
        if (name.length < 2) return "Name must be at least 2 characters";
        return "";
    };

    const validateMobile = (mobile: string): string => {
        if (!mobile) return t("fieldRequired");
        if (!/^\d{10}$/.test(mobile)) return t("invalidMobile");
        return "";
    };

    const validatePassword = (password: string): string => {
        if (!password) return t("fieldRequired");
        if (password.length < 6) return t("passwordTooShort");
        return "";
    };

    const validateConfirmPassword = (confirmPassword: string, password: string): string => {
        if (!confirmPassword) return t("fieldRequired");
        if (confirmPassword !== password) return t("passwordsDoNotMatch");
        return "";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Real-time validation
        let error = "";
        if (name === "name") {
            error = validateName(value);
            setErrors({ ...errors, name: error });
        } else if (name === "mobile") {
            error = validateMobile(value);
            setErrors({ ...errors, mobile: error });
        } else if (name === "password") {
            error = validatePassword(value);
            setErrors({ ...errors, password: error });
        } else if (name === "confirmPassword") {
            error = validateConfirmPassword(value, form.password);
            setErrors({ ...errors, confirmPassword: error });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const nameError = validateName(form.name);
        const mobileError = validateMobile(form.mobile);
        const passwordError = validatePassword(form.password);
        const confirmPasswordError = validateConfirmPassword(form.confirmPassword, form.password);

        if (nameError || mobileError || passwordError || confirmPasswordError) {
            setErrors({
                name: nameError,
                mobile: mobileError,
                password: passwordError,
                confirmPassword: confirmPasswordError,
            });
            return;
        }

        setIsLoading(true);
        try {
            await api.register({
                name: form.name,
                mobile: form.mobile,
                password: form.password,
            });
            alert(t("registrationSuccessful"));
            navigate("/");
        } catch (err) {
            alert(t("errorOccurred"));
            console.error("Registration failed", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-200">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 shadow-sm">

                <h1 className="text-3xl font-bold text-center text-green-700 dark:text-green-400">
                    Kisaan Saathi
                </h1>
                <p className="text-center text-gray-600 dark:text-gray-300 mt-1">
                    {t("register")}
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <input
                            name="name"
                            type="text"
                            placeholder={t("fullName")}
                            value={form.name}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 dark:text-white ${errors.name
                                    ? "border-red-500 focus:ring-red-500"
                                    : "dark:border-gray-600 focus:ring-green-600"
                                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <input
                            name="mobile"
                            type="text"
                            placeholder={t("mobileNumber")}
                            value={form.mobile}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 dark:text-white ${errors.mobile
                                    ? "border-red-500 focus:ring-red-500"
                                    : "dark:border-gray-600 focus:ring-green-600"
                                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                        {errors.mobile && (
                            <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                        )}
                    </div>

                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder={t("password")}
                            value={form.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 dark:text-white ${errors.password
                                    ? "border-red-500 focus:ring-red-500"
                                    : "dark:border-gray-600 focus:ring-green-600"
                                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder={t("confirmPassword")}
                            value={form.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 dark:text-white ${errors.confirmPassword
                                    ? "border-red-500 focus:ring-red-500"
                                    : "dark:border-gray-600 focus:ring-green-600"
                                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

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
                                {t("registering")}
                            </>
                        ) : (
                            t("register")
                        )}
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
                    {t("haveAccount")}{" "}
                    <Link to="/" className="text-green-700 dark:text-green-400 font-medium hover:underline">
                        {t("login")}
                    </Link>
                </p>
            </div>
        </div>
    );
}
