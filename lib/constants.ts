export const MONTHS = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(2000, i))
);

export const MONTHS_SHORT = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(2000, i))
);

export const TRIP_TYPES = ["solo", "couple", "family", "group"] as const;
export const DIFFICULTIES = ["easy", "moderate", "hard"] as const;
export const TRAVEL_MODES = ["car", "bike", "train", "flight", "bus", "mixed"] as const;
export const ACTIVITY_TYPES = ["sightseeing", "food", "travel", "adventure", "relaxation", "shopping", "other"] as const;
export const TRANSPORT_MODES = ["walk", "scooter", "bike", "car", "cab", "bus", "metro", "train", "flight","ferry","cruise"] as const;
export const IMAGE_TYPES = ["gallery", "cover", "banner", "thumbnail"] as const;
export const TIP_TYPES = ["general", "food", "transport", "safety", "money", "booking", "weather", "packing"] as const;
