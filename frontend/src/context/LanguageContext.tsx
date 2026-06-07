import { createContext, useContext, useState } from "react";
import { translations } from "../i18n/translations";

type Language = "en" | "hi";

type LanguageContextType = {
    language: Language;
    t: (key: keyof typeof translations.en) => string;
    toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "hi" : "en"));
    };

    const t = (key: keyof typeof translations.en) => {
        return translations[language][key];
    };

    return (
        <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within LanguageProvider");
    return context;
}
