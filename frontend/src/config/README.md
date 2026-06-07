# Dashboard Cards - Easy Update Guide

## Current Setup

The dashboard cards are now configured in a single file for easy maintenance:

**File:** `src/config/dashboardConfig.ts`

## How to Update Card Images/Icons

### Option 1: Update Emoji Icons (Current)
Simply edit the `icon` property in `dashboardConfig.ts`:

```typescript
{
    id: "upload-crop",
    icon: "🌾", // Change this emoji
    // ...
}
```

### Option 2: Add Real Images (Future)

1. **Add your image files** to `src/assets/images/`:
   - `upload-crop.png`
   - `ai-assistant.png`
   - `profile.png`
   - `reports.png`

2. **Update the config** to use image paths instead of emojis:

```typescript
// At the top of dashboardConfig.ts
import uploadCropImg from "../assets/images/upload-crop.png";
import aiAssistantImg from "../assets/images/ai-assistant.png";
// ... etc

// Then in the config:
{
    id: "upload-crop",
    icon: uploadCropImg, // Use image path instead
    // ...
}
```

3. **Update Dashboard.tsx** to render images:

Change line with icon:
```tsx
// From:
<span className={`text-5xl ${card.iconColor} ${card.darkIconColor}`}>
    {card.icon}
</span>

// To:
<img src={card.icon} alt={card.titleKey} className="h-full w-full object-cover" />
```

## Adding New Cards

Simply add a new object to the `dashboardCards` array in `dashboardConfig.ts`:

```typescript
{
    id: "new-feature",
    icon: "✨",
    bgColor: "bg-indigo-100",
    darkBgColor: "dark:bg-gray-700",
    iconColor: "text-indigo-700",
    darkIconColor: "dark:text-indigo-400",
    titleKey: "yourTranslationKey",
    descKey: "yourDescriptionKey",
    route: "/your-route",
}
```

That's it! The dashboard will automatically pick up the changes.
