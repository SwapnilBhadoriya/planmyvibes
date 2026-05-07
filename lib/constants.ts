export const MONTHS = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(2000, i))
);

export const MONTHS_SHORT = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(2000, i))
);
