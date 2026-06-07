// Dashboard card configuration
// To update images: Simply modify the icon emoji or add image paths here

export interface DashboardCard {
    id: string;
    icon: string; // Emoji or icon for now, can be replaced with image path
    bgColor: string;
    darkBgColor: string;
    iconColor: string;
    darkIconColor: string;
    titleKey: string;
    descKey: string;
    route: string;
}

export const dashboardCards: DashboardCard[] = [
    {
        id: "upload-crop",
        icon: "🌱",
        bgColor: "bg-green-100",
        darkBgColor: "dark:bg-gray-700",
        iconColor: "text-green-700",
        darkIconColor: "dark:text-green-400",
        titleKey: "uploadCrop",
        descKey: "uploadCropDesc",
        route: "/crop/upload",
    },
    {
        id: "ai-help",
        icon: "🤖",
        bgColor: "bg-blue-100",
        darkBgColor: "dark:bg-gray-700",
        iconColor: "text-blue-700",
        darkIconColor: "dark:text-blue-400",
        titleKey: "aiHelp",
        descKey: "aiHelpDesc",
        route: "/chat",
    },
    {
        id: "profile",
        icon: "👤",
        bgColor: "bg-yellow-100",
        darkBgColor: "dark:bg-gray-700",
        iconColor: "text-yellow-700",
        darkIconColor: "dark:text-yellow-400",
        titleKey: "profile",
        descKey: "profileDesc",
        route: "/profile",
    },
    {
        id: "reports",
        icon: "📊",
        bgColor: "bg-purple-100",
        darkBgColor: "dark:bg-gray-700",
        iconColor: "text-purple-700",
        darkIconColor: "dark:text-purple-400",
        titleKey: "previousReports",
        descKey: "previousReportsDesc",
        route: "/crop/result",
    },
];
