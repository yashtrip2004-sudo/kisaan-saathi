export type User = {
    name: string;
    mobile: string;
    state: string;
    district: string;
    crops: string;
    language: string;
};

export type CropAnalysisResult = {
    crop: string;
    disease: string;
    confidence: number;
    advice: string[];
};

export type ChatMessage = {
    sender: "user" | "ai";
    text: string;
};
