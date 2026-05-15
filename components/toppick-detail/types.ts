export interface PlaceItem {
    id: number;
    name: string;
    category: string;
    description: string;
    image: string;
    gallery: string[];
    rating: number;
    reviewCount: string;
    bestTime: string;
    timeToVisit: string;
    entryFee: string;
    idealFor: string;
    tags: string[];
    lat: number;
    lng: number;
    // detail fields
    about: string;
    type: string;
    builtIn: string;
    height: string;
    material: string;
    location: string;
    travelTips: string[];
    nearbyPlaces: { name: string; distance: string; rating: number; image: string }[];
    relatedCollections: { title: string; count: number; image: string }[];
    suggestedBlogs: { title: string; category: string; readTime: string; image: string }[];
}

export interface TopPickCollection {
    id: string;
    badge: string;
    title: string;
    description: string;
    coverImage: string;
    authors: { name: string; avatar: string }[];
    teamLabel: string;
    updatedDate: string;
    placeCount: number;
    suggestedDuration: string;
    rating: string;
    reviewCount: string;
    savedCount: string;
    // Filter categories
    categories: string[];
    // Places list
    places: PlaceItem[];
    // Sidebar info
    aboutText: string;
    bestTimeToVisit: string;
    language: string;
    currency: string;
    localTransport: string;
    travelTips: string[];
    mapCenter: { lat: number; lng: number };
    mapZoom: number;
}
