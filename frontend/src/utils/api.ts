// Central API handler

import type { User } from "./types";

const NODE_API = import.meta.env.VITE_NODE_API_URL || "http://localhost:5000/api";
const PYTHON_API = import.meta.env.VITE_PYTHON_API_URL || "http://localhost:8000";

const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
    login: async (data: { mobile: string; password: string }) => {
        const response = await fetch(`${NODE_API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: data.mobile, password: data.password }),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Login failed");
        }
        if (result.token) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
        }
        return result;
    },

    register: async (data: { name: string; mobile: string; password: string }) => {
        const response = await fetch(`${NODE_API}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: data.name, phone: data.mobile, password: data.password }),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Registration failed");
        }
        if (result.token) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
        }
        return result;
    },

    uploadCrop: async (data: FormData) => {
        const response = await fetch(`${PYTHON_API}/diagnose`, {
            method: "POST",
            body: data,
        });
        const json = await response.json();

        if (!response.ok) {
            throw new Error(json?.detail || "Diagnosis failed");
        }

        const result = json?.result;
        if (!result) {
            throw new Error("No diagnosis result returned from server.");
        }

        // Confidence from AI might be e.g. 0.92 — multiply by 100 if <= 1
        const rawConf = result.diseases?.[0]?.confidence ?? 0;
        const confidence = rawConf > 0 && rawConf <= 1 ? Math.round(rawConf * 100) : Math.round(rawConf);

        // Safety helper to ensure we always have strings (prevents React crashes)
        const ensureString = (val: any) => {
            if (typeof val === "string") return val;
            if (Array.isArray(val)) return val.join(", ");
            if (typeof val === "object" && val !== null) return JSON.stringify(val);
            return String(val || "");
        };

        return {
            crop: "Detected Plant",
            disease: ensureString(result.diseases?.[0]?.name || result.description || "Unknown"),
            confidence,
            advice: [
                ensureString(result.treatment),
                ensureString(result.prevention),
                ensureString(result.timeline)
            ].filter(val => val && val !== "N/A"),
        };
    },

    chat: async (message: string, lang: string) => {
        try {
            const response = await fetch(`${NODE_API}/advisor/ask`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    ...getAuthHeaders()
                },
                body: JSON.stringify({ prompt: message, language: lang }),
            });
            
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                return { reply: errData.message || errData.error || `Error ${response.status}: Please make sure you are logged in.` };
            }
            
            const result = await response.json();
            return {
                reply: result.answer || "Sorry, I could not get a response.",
            };
        } catch (error) {
            return { reply: "Network error fetching response." };
        }
    },

    getProfile: async () => {
        const response = await fetch(`${NODE_API}/auth/me`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Failed to fetch profile");
        }
        return result.user;
    },

    saveProfile: async (profile: User) => {
        const payload = {
            name: profile.name,
            state: profile.state,
            district: profile.district,
            cropTypes: profile.crops ? profile.crops.split(',').map(c => c.trim()).filter(Boolean) : []
        };
        const response = await fetch(`${NODE_API}/auth/me`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        return { success: response.ok };
    },
};
