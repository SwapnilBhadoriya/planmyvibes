"use client";

import { useState } from "react";
import ItineraryDetailHero from "@/components/itineraries/detail/ItineraryDetailHero";
import ItineraryLeftSidebar from "@/components/itineraries/detail/ItineraryLeftSidebar";
import DayTimeline from "@/components/itineraries/detail/DayTimeline";
import ActivityDetailPanel from "@/components/itineraries/detail/ActivityDetailPanel";

// ---------------------------------------------------------------------------
// Unsplash helper
// ---------------------------------------------------------------------------
const U = (id: string, w = 400, h = 300) =>
    `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=center&auto=format&q=80`;

const P = {
    // Day covers
    heroSwissAlps:  U("1506905925346-21bda4d32df4", 1400, 600),
    interlaken:     U("1476514525535-07fb3b4ae5f1"),
    jungfrau:       U("1558618666-fcd25c85cd64"),
    lauterbrunnen:  U("1529156069898-49953e39b3ac"),
    grindelwald:    U("1464822759023-fed622ff2c3b"),
    geneva:         U("1530521954074-e0a103ceff5c"),
    genevaAirport:  U("1436491865332-7a61a109cc05"),
    // Activity primaries
    zurichAirport:  U("1436491865332-7a61a109cc05"),
    swissTrain:     U("1474487548417-781cb71495f3"),
    interlakenTown: U("1476514525535-07fb3b4ae5f1"),
    riverDinner:    U("1414235077428-338989a2e8c0"),
    hotelRoom:      U("1631049307264-da0ec9d70304"),
    breakfast:      U("1533089860892-a7c6f0a88666"),
    cogwheelTrain:  U("1474487548417-781cb71495f3"),
    glacier:        U("1464822759023-fed622ff2c3b"),
    mountainLunch:  U("1414235077428-338989a2e8c0"),
    waterfall:      U("1529156069898-49953e39b3ac"),
    cableCar:       U("1464822759023-fed622ff2c3b"),
    murren:         U("1476514525535-07fb3b4ae5f1"),
    cliffWalk:      U("1558618666-fcd25c85cd64"),
    paragliding:    U("1505118380757-91f5f5632de0"),
    fondue:         U("1414235077428-338989a2e8c0"),
    jetdEau:        U("1530521954074-e0a103ceff5c"),
    palaisNations:  U("1519677100203-a0e668c92439"),
    lakeDinner:     U("1414235077428-338989a2e8c0"),
    swissShop:      U("1483985988355-763728e1de1e"),
    departure:      U("1436491865332-7a61a109cc05"),
};

// Gallery helpers — each activity gets 4 varied images
const G = {
    airport:    [P.zurichAirport, P.departure, P.swissTrain, P.genevaAirport],
    train:      [P.swissTrain, P.cogwheelTrain, P.lauterbrunnen, P.interlaken],
    interlaken: [P.interlakenTown, P.interlaken, P.riverDinner, P.jungfrau],
    dinner:     [P.riverDinner, P.fondue, P.mountainLunch, P.breakfast],
    hotel:      [P.hotelRoom, P.interlakenTown, P.interlaken, P.breakfast],
    breakfast:  [P.breakfast, P.fondue, P.mountainLunch, P.riverDinner],
    jungfrau:   [P.jungfrau, P.glacier, P.cliffWalk, P.lauterbrunnen],
    glacier:    [P.glacier, P.jungfrau, P.cliffWalk, P.grindelwald],
    waterfall:  [P.waterfall, P.lauterbrunnen, P.murren, P.cableCar],
    cable:      [P.cableCar, P.murren, P.waterfall, P.grindelwald],
    murren:     [P.murren, P.cliffWalk, P.lauterbrunnen, P.jungfrau],
    cliffWalk:  [P.cliffWalk, P.grindelwald, P.glacier, P.paragliding],
    paraglide:  [P.paragliding, P.cliffWalk, P.grindelwald, P.jungfrau],
    fondue:     [P.fondue, P.riverDinner, P.breakfast, P.mountainLunch],
    jetdEau:    [P.jetdEau, P.palaisNations, P.geneva, P.lakeDinner],
    palais:     [P.palaisNations, P.jetdEau, P.geneva, P.swissShop],
    lakeDinner: [P.lakeDinner, P.jetdEau, P.riverDinner, P.geneva],
    shop:       [P.swissShop, P.interlakenTown, P.palaisNations, P.geneva],
};

// ---------------------------------------------------------------------------
// Mock itinerary — Swiss Alps Adventure
// ---------------------------------------------------------------------------
const MOCK_ITINERARY = {
    title: "Swiss Alps Adventure 🏔️",
    subtitle: "Crystal-clear lakes, charming villages, scenic hikes and unforgettable Alpine views.",
    coverImageUrl: P.heroSwissAlps,
    durationDays: 6,
    stayNights: 5,
    budgetMin: 65000,
    budgetMax: 95000,
    bestTimeLabel: "May – Oct",
    quickTips: [
        "Swiss Travel Pass covers all trains, buses & boats.",
        "Carry CHF cash — many mountain huts don't take cards.",
        "Book Jungfraujoch tickets 2–3 weeks in advance.",
        "Best local food: Raclette, Rösti & Swiss fondue.",
    ],
    itineraryDays: [
        // ── Day 1 ──────────────────────────────────────────────────────────
        {
            dayNumber: 1,
            title: "Zurich – Interlaken",
            subtitle: "Arrive in Switzerland and settle into the stunning Interlaken valley.",
            temperature: "14°C",
            dayNote: "Perfect start — the train journey from Zurich is already breathtaking.",
            coverImageUrl: P.interlaken,
            destination: { name: "Interlaken", country: "Switzerland", bestTimeStartMonth: 5, bestTimeEndMonth: 10, googleMapsLink: null },
            activities: [
                {
                    id: "a1", title: "Arrive at Zurich Airport (ZRH)",
                    activityType: "travel", startTime: "08:30", durationMinutes: 60,
                    notes: "Land in Zurich. Complete immigration and collect your bags.",
                    imageUrl: P.zurichAirport,
                    address: "Zurich Airport, Kloten, 8058 Zürich, Switzerland",
                    gallery: G.airport,
                    description: "Zurich Airport (ZRH) is Switzerland's largest international airport, located 13 km north of the city. The airport is renowned for its efficiency, cleanliness, and excellent connectivity to central Zurich via rail in under 10 minutes.",
                    bestTime: "Morning",
                    duration: "45 min – 1 hr",
                    entryFee: "Free",
                    tips: ["Download the SBB app before landing to buy train tickets.", "Swiss Travel Pass holders ride free from the airport.", "Follow signs to ZRH rail station — it's inside the terminal."],
                    transports: [], activePlaces: [],
                },
                {
                    id: "a2", title: "Scenic Train to Interlaken",
                    activityType: "travel", startTime: "10:00", durationMinutes: 130,
                    notes: "Scenic train ride through the Swiss countryside.",
                    imageUrl: P.swissTrain,
                    address: "Zurich HB → Interlaken Ost",
                    gallery: G.train,
                    description: "One of Europe's most scenic rail routes — glide past rolling meadows, mirror lakes and the first Alpine foothills on this 130-minute journey from Zurich to Interlaken.",
                    bestTime: "Any time",
                    duration: "2h 10m",
                    entryFee: "Included in Swiss Travel Pass",
                    tips: ["Sit on the right side of the train for the best lake views.", "The Brienz lake stretch near the end is the most dramatic.", "There is a restaurant car if you want coffee en route."],
                    transports: [{ id: "t1", mode: "Train", durationMinutes: 130, distanceKm: 132, cost: "Included", fromPlace: "Zurich HB", toPlace: "Interlaken Ost" }],
                    activePlaces: [],
                },
                {
                    id: "a3", title: "Explore Interlaken Town",
                    activityType: "sightseeing", startTime: "12:10", durationMinutes: 180,
                    notes: "Stroll through the charming town between two glacial lakes.",
                    imageUrl: P.interlakenTown,
                    address: "Höhematte, 3800 Interlaken, Switzerland",
                    gallery: G.interlaken,
                    description: "Interlaken sits between Lake Thun and Lake Brienz with the Jungfrau massif as its backdrop. The Höhematte park is the heart of town — a wide meadow offering postcard-perfect views of the Jungfrau peak framed by chalet rooftops.",
                    bestTime: "Afternoon",
                    duration: "2 – 3 hrs",
                    entryFee: "Free",
                    tips: ["Pick up a day-view selfie at the Höhematte park bench facing Jungfrau.", "The main street Höheweg has both luxury watch shops and budget souvenirs.", "Avoid peak summer crowds by exploring early afternoon."],
                    transports: [],
                    activePlaces: [
                        { place: { id: "p1", name: "Höhematte Park", type: "park" } },
                        { place: { id: "p2", name: "Interlaken Church", type: "landmark" } },
                        { place: { id: "p3", name: "Local Shopping", type: "shopping" } },
                    ],
                },
                {
                    id: "a4", title: "Dinner by the Aare River",
                    activityType: "food", startTime: "19:00", durationMinutes: 90,
                    notes: "Riverside dining with views of the glacial turquoise Aare.",
                    imageUrl: P.riverDinner,
                    address: "Restaurant Taverne, Hauptstrasse 19, Unterseen, Interlaken",
                    gallery: G.dinner,
                    description: "Restaurant Taverne in the old village of Unterseen is beloved for its traditional Swiss menu and candlelit terrace overlooking the Aare. The river glows an otherworldly turquoise at dusk, fed by glacial meltwater.",
                    bestTime: "Evening",
                    duration: "1 – 1.5 hrs",
                    entryFee: "₹800 – ₹1,500 per person",
                    tips: ["Book a terrace table in advance in summer — it fills up by 7 PM.", "Try the Zürigschnätzlets (veal strips in cream sauce) — a house specialty.", "Unterseen village is a 10-minute walk from Interlaken West station."],
                    transports: [], activePlaces: [],
                },
                {
                    id: "a5", title: "Check in to Hotel",
                    activityType: "relaxation", startTime: null, durationMinutes: null,
                    notes: "Hotel Weisses Kreuz ★ 3.8 — Check-in: 03:00 PM • Check-out: 11:00 AM",
                    imageUrl: P.hotelRoom,
                    address: "Marktgasse 23, 3800 Interlaken, Switzerland",
                    gallery: G.hotel,
                    description: "Hotel Weisses Kreuz is a classic Swiss chalet-style hotel a short walk from Interlaken West station. Rooms have Alpine-inspired décor and several face the river, offering peaceful morning views over the Aare.",
                    bestTime: "Any time",
                    duration: "—",
                    entryFee: "₹6,500 – ₹9,000 / night",
                    tips: ["Ask for a river-view room at check-in — no extra charge.", "Free bicycle rental available at the front desk.", "Breakfast included; the buffet opens at 7 AM."],
                    transports: [], activePlaces: [],
                },
            ],
        },

        // ── Day 2 ──────────────────────────────────────────────────────────
        {
            dayNumber: 2,
            title: "Jungfraujoch Excursion",
            subtitle: "Ascend to the Top of Europe — the highest railway station on the continent.",
            temperature: "−5°C at summit",
            dayNote: "Start early — cloud cover rolls in by afternoon at this altitude.",
            coverImageUrl: P.jungfrau,
            destination: { name: "Jungfraujoch", country: "Switzerland", bestTimeStartMonth: 6, bestTimeEndMonth: 9, googleMapsLink: null },
            activities: [
                {
                    id: "b1", title: "Early Breakfast",
                    activityType: "food", startTime: "07:00", durationMinutes: 45,
                    notes: "Fuel up before the big ascent.",
                    imageUrl: P.breakfast,
                    address: "Hotel Weisses Kreuz, Interlaken",
                    gallery: G.breakfast,
                    description: "A hearty Swiss breakfast spread — fresh bread, local cheeses, cold cuts, Bircher muesli and hot coffee — is the best preparation for a full day above the snowline.",
                    bestTime: "Morning",
                    duration: "45 min",
                    entryFee: "Included in stay",
                    tips: ["Pack warm layers before heading down — it's below 0 °C at Jungfraujoch.", "Sunglasses are essential — UV intensity doubles above 3,000 m.", "Keep breakfast light to avoid altitude discomfort."],
                    transports: [], activePlaces: [],
                },
                {
                    id: "b2", title: "Cogwheel Train to Jungfraujoch",
                    activityType: "travel", startTime: "08:00", durationMinutes: 120,
                    notes: "The world-famous cogwheel railway climbs to 3,454 m.",
                    imageUrl: P.cogwheelTrain,
                    address: "Interlaken Ost → Jungfraujoch",
                    gallery: G.jungfrau,
                    description: "Completed in 1912 after 16 years of construction, the Jungfrau Railway is an engineering marvel. The final stretch bores 7 km through the Eiger's north face, emerging at the Jungfraujoch — 3,454 m above sea level, the highest railway station in Europe.",
                    bestTime: "Early morning",
                    duration: "2 hrs",
                    entryFee: "CHF 210 (₹19,000)",
                    tips: ["Book the early-bird first train — it's cheaper and the views clearer.", "The Kleine Scheidegg stop offers great Eiger north face photo ops.", "Allow time at intermediate stations — each has its own viewpoint."],
                    transports: [{ id: "t2", mode: "Cogwheel Train", durationMinutes: 120, distanceKm: 36, cost: "CHF 210", fromPlace: "Interlaken Ost", toPlace: "Jungfraujoch" }],
                    activePlaces: [],
                },
                {
                    id: "b3", title: "Sphinx Observatory & Glacier Walk",
                    activityType: "adventure", startTime: "10:30", durationMinutes: 150,
                    notes: "Panoramic Alpine views and a walk on the Aletsch Glacier.",
                    imageUrl: P.glacier,
                    address: "Sphinx Observatory, 3454 Jungfraujoch, Switzerland",
                    gallery: G.glacier,
                    description: "The Sphinx Terrace at 3,571 m delivers a 360° panorama spanning from the Black Forest to Mont Blanc on clear days. Below it stretches the Aletsch Glacier — the longest glacier in the Alps at 23 km — a UNESCO World Heritage site.",
                    bestTime: "Morning",
                    duration: "2 – 2.5 hrs",
                    entryFee: "Included in rail ticket",
                    tips: ["Sunglasses and SPF 50+ sunscreen are non-negotiable at this altitude.", "The Ice Palace tunnel is free and fascinating — don't skip it.", "Altitude sickness can hit without warning; rest if you feel dizzy."],
                    transports: [],
                    activePlaces: [
                        { place: { id: "p4", name: "Sphinx Observatory", type: "landmark" } },
                        { place: { id: "p5", name: "Aletsch Glacier", type: "nature" } },
                        { place: { id: "p6", name: "Ice Palace", type: "attraction" } },
                    ],
                },
                {
                    id: "b4", title: "Lunch at Top of Europe",
                    activityType: "food", startTime: "13:00", durationMinutes: 60,
                    notes: "Dine at 3,454 m with floor-to-ceiling glacier views.",
                    imageUrl: P.mountainLunch,
                    address: "Top of Europe Restaurant, Jungfraujoch",
                    gallery: G.breakfast,
                    description: "The restaurant at Jungfraujoch offers a surprisingly varied menu — from hot soups and rösti to international dishes — all with a spectacular panorama of the Aletsch Glacier through floor-to-ceiling windows.",
                    bestTime: "Early afternoon",
                    duration: "1 hr",
                    entryFee: "₹1,200 – ₹2,200 per person",
                    tips: ["The rösti pancakes here are a Swiss mountain classic — must try.", "Queues form fast between 12–2 PM; arrive before noon.", "Hot chocolate at the summit is mandatory."],
                    transports: [], activePlaces: [],
                },
                {
                    id: "b5", title: "Return to Interlaken",
                    activityType: "travel", startTime: "15:00", durationMinutes: 120,
                    notes: "Descend and enjoy a relaxed evening in town.",
                    imageUrl: P.swissTrain,
                    address: "Jungfraujoch → Interlaken Ost",
                    gallery: G.train,
                    description: "The descent offers fresh perspectives as afternoon light plays across the Bernese Oberland. Stop at Grindelwald or Wengen if you want a spontaneous mountain village wander before heading back.",
                    bestTime: "Afternoon",
                    duration: "2 hrs",
                    entryFee: "Included",
                    tips: ["Hop off at Grindelwald for a quick village stroll if time permits.", "The station café at Kleine Scheidegg has excellent apple strudel."],
                    transports: [{ id: "t3", mode: "Cogwheel Train", durationMinutes: 120, distanceKm: 36, cost: "Included", fromPlace: "Jungfraujoch", toPlace: "Interlaken Ost" }],
                    activePlaces: [],
                },
            ],
        },

        // ── Day 3 ──────────────────────────────────────────────────────────
        {
            dayNumber: 3,
            title: "Lauterbrunnen Valley",
            subtitle: "72 waterfalls, a car-free cliff village, and the world's most dramatic valley.",
            temperature: "11°C",
            dayNote: "The valley is most magical just after rain — waterfalls at full force.",
            coverImageUrl: P.lauterbrunnen,
            destination: { name: "Lauterbrunnen", country: "Switzerland", bestTimeStartMonth: 5, bestTimeEndMonth: 10, googleMapsLink: null },
            activities: [
                {
                    id: "c1", title: "Train to Lauterbrunnen",
                    activityType: "travel", startTime: "09:00", durationMinutes: 30,
                    notes: "Short scenic ride into one of the world's great valleys.",
                    imageUrl: P.swissTrain,
                    address: "Interlaken Ost → Lauterbrunnen",
                    gallery: G.train,
                    description: "The 30-minute train drops you into the Lauterbrunnen Valley — a sheer-walled glacial trough flanked by 300 m cliffs. The valley floor is flanked by streams and spray from over 72 waterfalls.",
                    bestTime: "Morning",
                    duration: "30 min",
                    entryFee: "Included in Swiss Travel Pass",
                    tips: ["Sit on the left side for the first view down into the valley floor.", "Pick up a picnic from the Coop in Interlaken before boarding."],
                    transports: [{ id: "t4", mode: "Train", durationMinutes: 30, distanceKm: 10, cost: "Included", fromPlace: "Interlaken Ost", toPlace: "Lauterbrunnen" }],
                    activePlaces: [],
                },
                {
                    id: "c2", title: "Staubbach Falls Hike",
                    activityType: "adventure", startTime: "09:45", durationMinutes: 90,
                    notes: "Hike to the 297 m waterfall — the path goes inside the spray zone.",
                    imageUrl: P.waterfall,
                    address: "Staubbach Falls, 3822 Lauterbrunnen, Switzerland",
                    gallery: G.waterfall,
                    description: "Staubbach Falls plunges 297 m in a single free-falling sheet — one of the highest in Europe. A walking path (25 min round trip) climbs to a tunnel carved behind the falls, where you stand inside a curtain of spray and look out over the valley.",
                    bestTime: "Morning",
                    duration: "1 – 1.5 hrs",
                    entryFee: "Free",
                    tips: ["Waterproof jacket essential — the spray zone soaks you completely.", "Visit early morning to avoid tour groups and have the cave to yourself.", "The falls are strongest in May–June from snowmelt."],
                    transports: [],
                    activePlaces: [{ place: { id: "p7", name: "Staubbach Falls", type: "nature" } }],
                },
                {
                    id: "c3", title: "Cable Car up to Mürren",
                    activityType: "travel", startTime: "11:30", durationMinutes: 20,
                    notes: "Rise to the car-free village perched 1,650 m on a cliff ledge.",
                    imageUrl: P.cableCar,
                    address: "Grütschalp Cableway → Mürren",
                    gallery: G.cable,
                    description: "The ascent to Mürren is itself an attraction — a gondola followed by a mountain railway that hugs the cliff face. The village of Mürren floats above the valley on a ledge with no road access, and on arrival the panorama of Eiger, Mönch and Jungfrau is jaw-dropping.",
                    bestTime: "Any time",
                    duration: "20 min",
                    entryFee: "CHF 12 (₹1,100)",
                    tips: ["The Birg cable car from Mürren continues to Schilthorn if you want extra elevation.", "Last cable car down is typically 17:30 — don't miss it."],
                    transports: [{ id: "t5", mode: "Cable Car", durationMinutes: 20, distanceKm: 4, cost: "CHF 12", fromPlace: "Grütschalp", toPlace: "Mürren" }],
                    activePlaces: [],
                },
                {
                    id: "c4", title: "Lunch & Explore Mürren",
                    activityType: "food", startTime: "12:00", durationMinutes: 120,
                    notes: "Lunch with direct Eiger–Mönch–Jungfrau views.",
                    imageUrl: P.murren,
                    address: "Mürren Village, 3825 Mürren, Switzerland",
                    gallery: G.murren,
                    description: "Mürren is a car-free village of 400 souls clinging to a cliff with the full Jungfrau massif as a backdrop. Sit on any café terrace and the three giants — Eiger, Mönch and Jungfrau — fill your entire horizon.",
                    bestTime: "Midday",
                    duration: "1.5 – 2 hrs",
                    entryFee: "Free to walk",
                    tips: ["Try the Rösti (Swiss potato cake) at the Tächi restaurant.", "Walk the 45-minute cliff path to Gimmelwald for the best valley views.", "The village is tiny — allow time to simply sit and absorb the panorama."],
                    transports: [],
                    activePlaces: [
                        { place: { id: "p8", name: "Mürren Village", type: "town" } },
                        { place: { id: "p9", name: "Allmendhubel Panorama", type: "viewpoint" } },
                    ],
                },
                {
                    id: "c5", title: "Return & Rest",
                    activityType: "relaxation", startTime: "17:00", durationMinutes: 60,
                    notes: "Hotel Eiger Interlaken ★ 4.2 — Check-in: 03:00 PM • Check-out: 11:00 AM",
                    imageUrl: P.hotelRoom,
                    address: "Hotel Eiger, Harderstrasse 5, 3800 Interlaken",
                    gallery: G.hotel,
                    description: "Hotel Eiger Interlaken is a well-regarded four-star property with mountain-view rooms and a wellness spa — perfect for aching legs after a day of trails and cable cars.",
                    bestTime: "Evening",
                    duration: "—",
                    entryFee: "₹8,000 – ₹12,000 / night",
                    tips: ["Use the hot tub after the day's hike — it overlooks the valley.", "Ask for room 315 for the best Jungfrau sunrise view."],
                    transports: [], activePlaces: [],
                },
            ],
        },

        // ── Day 4 ──────────────────────────────────────────────────────────
        {
            dayNumber: 4,
            title: "Grindelwald Adventure",
            subtitle: "Alpine thrills above the clouds — cliff walks, gondolas and fondue.",
            temperature: "10°C",
            dayNote: "Book paragliding the night before — morning slots sell out by 8 AM.",
            coverImageUrl: P.grindelwald,
            destination: { name: "Grindelwald", country: "Switzerland", bestTimeStartMonth: 6, bestTimeEndMonth: 10, googleMapsLink: null },
            activities: [
                {
                    id: "d1", title: "Train to Grindelwald",
                    activityType: "travel", startTime: "08:30", durationMinutes: 40,
                    notes: "Short ride into the iconic mountain village.",
                    imageUrl: P.swissTrain,
                    address: "Interlaken Ost → Grindelwald",
                    gallery: G.train,
                    description: "Grindelwald is reached in 40 minutes from Interlaken, the track climbing steadily into the Bernese Oberland. Arriving early gives you the best morning light on the Eiger north face.",
                    bestTime: "Morning",
                    duration: "40 min",
                    entryFee: "Included",
                    tips: ["Sit on the right side of the train for the first Eiger views.", "The town bakeries open at 7 AM — grab a gipfeli (Swiss croissant) on arrival."],
                    transports: [{ id: "t6", mode: "Train", durationMinutes: 40, distanceKm: 20, cost: "Included", fromPlace: "Interlaken Ost", toPlace: "Grindelwald" }],
                    activePlaces: [],
                },
                {
                    id: "d2", title: "First Cliff Walk",
                    activityType: "adventure", startTime: "10:00", durationMinutes: 180,
                    notes: "Gondola to Grindelwald First, then walk the famous cliff path.",
                    imageUrl: P.cliffWalk,
                    address: "Grindelwald First, 3818 Grindelwald, Switzerland",
                    gallery: G.cliffWalk,
                    description: "The First Cliff Walk is a steel walkway that juts out from the cliff face at 2,167 m, with transparent floor panels over the void below. The gondola ride up is spectacular in itself — the Eiger towers across the valley. From the top, a 1-hour walk leads to Bachalpsee, a glacial lake that mirrors the Schreckhorn.",
                    bestTime: "Morning",
                    duration: "2.5 – 3 hrs",
                    entryFee: "CHF 32 gondola + Free cliff walk",
                    tips: ["The cliff walk is free once you're at the First station.", "Don't miss the Bachalpsee lake — add 1 hour to the hike.", "Trottibike (mountain scooters) are available to ride down."],
                    transports: [],
                    activePlaces: [
                        { place: { id: "p10", name: "Grindelwald First", type: "viewpoint" } },
                        { place: { id: "p11", name: "First Cliff Walk", type: "trail" } },
                        { place: { id: "p12", name: "Bachalpsee Lake", type: "nature" } },
                    ],
                },
                {
                    id: "d3", title: "Tandem Paragliding",
                    activityType: "adventure", startTime: "14:00", durationMinutes: 30,
                    notes: "Soar over the Alps from Männlichen with a certified guide.",
                    imageUrl: P.paragliding,
                    address: "Männlichen, 3823 Wengen, Switzerland",
                    gallery: G.paraglide,
                    description: "Tandem paragliding from Männlichen (2,343 m) is the ultimate Swiss Alps experience — you and a certified pilot ride thermals above the Lauterbrunnen valley with the Jungfrau, Eiger and Mönch as your backdrop for a 20–30 minute flight.",
                    bestTime: "Early afternoon",
                    duration: "30 min flight",
                    entryFee: "CHF 180 – 210 (₹16,500 – ₹19,500)",
                    tips: ["Book directly with Paragliding Jungfrau — they have the best safety record.", "Wear comfortable layers — it can be cold at altitude even in summer.", "GoPro footage is available for purchase after landing."],
                    transports: [], activePlaces: [],
                },
                {
                    id: "d4", title: "Swiss Fondue Dinner",
                    activityType: "food", startTime: "19:00", durationMinutes: 90,
                    notes: "Traditional Swiss fondue in a cosy mountain chalet.",
                    imageUrl: P.fondue,
                    address: "Chalet Restaurant Grindelwald, Dorfstrasse 14, Grindelwald",
                    gallery: G.fondue,
                    description: "The Chalet Restaurant is one of Grindelwald's most atmospheric dinner spots — exposed timber beams, cowbells on the walls, and a roaring fire in winter. The cheese fondue for two arrives in a traditional caquelon pot, perfectly paired with local white wine.",
                    bestTime: "Evening",
                    duration: "1.5 hrs",
                    entryFee: "₹900 – ₹1,800 per person",
                    tips: ["Cheese fondue for two is the must-order — get the truffle variant if available.", "Pair with a glass of Chasselas (Swiss white wine).", "Reservations recommended — walk-ins often wait 30+ minutes."],
                    transports: [],
                    activePlaces: [{ place: { id: "p13", name: "Chalet Restaurant", type: "restaurant" } }],
                },
            ],
        },

        // ── Day 5 ──────────────────────────────────────────────────────────
        {
            dayNumber: 5,
            title: "Geneva Exploration",
            subtitle: "International diplomacy, lakeside elegance and watchmaker heritage.",
            temperature: "18°C",
            dayNote: "Geneva is very walkable — comfortable shoes go a long way today.",
            coverImageUrl: P.geneva,
            destination: { name: "Geneva", country: "Switzerland", bestTimeStartMonth: 4, bestTimeEndMonth: 10, googleMapsLink: null },
            activities: [
                {
                    id: "e1", title: "Intercity Train to Geneva",
                    activityType: "travel", startTime: "08:00", durationMinutes: 165,
                    notes: "Scenic intercity journey through the Swiss midlands.",
                    imageUrl: P.swissTrain,
                    address: "Interlaken Ost → Geneva Cornavin",
                    gallery: G.train,
                    description: "The 2h 45m InterCity train crosses the full width of Switzerland — flat agricultural plains, then the western Jura foothills before descending into the Lake Geneva basin with the Mont Blanc massif appearing on the horizon.",
                    bestTime: "Morning",
                    duration: "2h 45m",
                    entryFee: "Included in Swiss Travel Pass",
                    tips: ["Grab breakfast at the Interlaken station bakery before boarding.", "Look left for the Mont Blanc view 20 minutes before Geneva.", "Geneva Cornavin station is central — your hotel should be walkable."],
                    transports: [{ id: "t7", mode: "Train", durationMinutes: 165, distanceKm: 190, cost: "Included", fromPlace: "Interlaken Ost", toPlace: "Geneva Cornavin" }],
                    activePlaces: [],
                },
                {
                    id: "e2", title: "Jet d'Eau & Old Town",
                    activityType: "sightseeing", startTime: "11:00", durationMinutes: 180,
                    notes: "Walk from the 140 m water jet to the hilly Old Town.",
                    imageUrl: P.jetdEau,
                    address: "Quai du Général-Guisan, 1204 Geneva, Switzerland",
                    gallery: G.jetdEau,
                    description: "Geneva's Jet d'Eau shoots 140 m into the air at 200 km/h — visible from 10 km away. From there, climb the hilly Vieille Ville to St. Pierre Cathedral, which offers sweeping rooftop views over the lake and Mont Blanc on clear days.",
                    bestTime: "Late morning",
                    duration: "2 – 3 hrs",
                    entryFee: "Free",
                    tips: ["The Old Town is uphill — wear comfortable shoes.", "Climb the St. Pierre Cathedral north tower (CHF 5) for panoramic views.", "The Flower Clock in the Jardin Anglais is a 5-min detour worth taking."],
                    transports: [],
                    activePlaces: [
                        { place: { id: "p14", name: "Jet d'Eau", type: "landmark" } },
                        { place: { id: "p15", name: "St. Pierre Cathedral", type: "landmark" } },
                        { place: { id: "p16", name: "Flower Clock", type: "attraction" } },
                    ],
                },
                {
                    id: "e3", title: "Palais des Nations",
                    activityType: "sightseeing", startTime: "14:30", durationMinutes: 120,
                    notes: "Tour the European headquarters of the United Nations.",
                    imageUrl: P.palaisNations,
                    address: "Av. de la Paix 14, 1202 Geneva, Switzerland",
                    gallery: G.palais,
                    description: "The Palais des Nations is the second-largest UN campus in the world, hosting thousands of meetings and diplomats annually. Guided tours take you through the Assembly Hall, the Human Rights room with its striking Miró ceiling, and the grounds featuring the iconic Broken Chair sculpture.",
                    bestTime: "Afternoon",
                    duration: "1.5 – 2 hrs",
                    entryFee: "CHF 15 (₹1,400)",
                    tips: ["Book guided tour tickets online at least 3 days ahead.", "Bring your passport — required for entry to the UN grounds.", "The Red Cross Museum next door is an equally moving visit (extra CHF 15)."],
                    transports: [],
                    activePlaces: [
                        { place: { id: "p17", name: "Palais des Nations", type: "landmark" } },
                        { place: { id: "p18", name: "Red Cross Museum", type: "museum" } },
                    ],
                },
                {
                    id: "e4", title: "Lakeside Dinner",
                    activityType: "food", startTime: "19:30", durationMinutes: 90,
                    notes: "Upscale lakeside dining with Alps at sunset.",
                    imageUrl: P.lakeDinner,
                    address: "Restaurant de la Perle du Lac, Rue de Lausanne 128, Geneva",
                    gallery: G.lakeDinner,
                    description: "La Perle du Lac is a Genevois institution — set in a 19th-century villa right on the lakeshore, with a terrace that looks out to the jet d'Eau and the Savoy Alps at golden hour. The fish dishes using freshwater perch from Lake Geneva are exceptional.",
                    bestTime: "Sunset",
                    duration: "1.5 hrs",
                    entryFee: "₹2,000 – ₹4,000 per person",
                    tips: ["The terrace tables at sunset are legendary — book 1 week ahead in summer.", "Order the filets de perche (lake perch) — local and outstanding.", "A bottle of local Chasselas goes perfectly with the fish."],
                    transports: [], activePlaces: [],
                },
            ],
        },

        // ── Day 6 ──────────────────────────────────────────────────────────
        {
            dayNumber: 6,
            title: "Departure from Geneva",
            subtitle: "Last Swiss chocolates, a final espresso, and au revoir to the Alps.",
            temperature: "17°C",
            dayNote: "Allow 2.5 hours before your flight — GVA airport security can be slow.",
            coverImageUrl: P.genevaAirport,
            destination: { name: "Geneva Airport", country: "Switzerland", bestTimeStartMonth: null, bestTimeEndMonth: null, googleMapsLink: null },
            activities: [
                {
                    id: "f1", title: "Hotel Breakfast",
                    activityType: "food", startTime: "08:00", durationMinutes: 60,
                    notes: "Enjoy a final Swiss breakfast before heading out.",
                    imageUrl: P.breakfast,
                    address: "Hotel breakfast, Geneva",
                    gallery: G.breakfast,
                    description: "A final Swiss hotel breakfast — freshly baked bread, local honey, Gruyère cheese, and Bircher muesli — sets the perfect tone for your last morning in Switzerland.",
                    bestTime: "Morning",
                    duration: "1 hr",
                    entryFee: "Included",
                    tips: ["Bircher muesli (cold soaked oats with apple) is a Swiss breakfast staple.", "Stock up on single-serve Läderach chocolate from hotel lobby shop."],
                    transports: [], activePlaces: [],
                },
                {
                    id: "f2", title: "Last-minute Shopping",
                    activityType: "shopping", startTime: "09:15", durationMinutes: 75,
                    notes: "Swiss chocolates, watches, and souvenirs at Rue du Rhône.",
                    imageUrl: P.swissShop,
                    address: "Rue du Rhône, 1204 Geneva, Switzerland",
                    gallery: G.shop,
                    description: "Geneva's Rue du Rhône is Switzerland's premier shopping street — global luxury brands sit alongside Swiss watchmakers and chocolate specialists. For gifts, the best options are Läderach (fresh chocolate) and Victorinox (Swiss Army knives).",
                    bestTime: "Morning",
                    duration: "1 – 1.5 hrs",
                    entryFee: "Free to browse",
                    tips: ["Lindt and Läderach are the best chocolate brands for gifts.", "Victorinox pocket knives must go in checked luggage, not carry-on.", "Rue du Rive parallel street has slightly lower prices."],
                    transports: [],
                    activePlaces: [
                        { place: { id: "p19", name: "Rue du Rhône", type: "shopping" } },
                        { place: { id: "p20", name: "Lindt Boutique", type: "shop" } },
                    ],
                },
                {
                    id: "f3", title: "Transfer to Geneva Airport",
                    activityType: "travel", startTime: "11:00", durationMinutes: 20,
                    notes: "Direct train from Geneva Cornavin to GVA terminal.",
                    imageUrl: P.zurichAirport,
                    address: "Geneva Cornavin → Geneva Airport (GVA)",
                    gallery: G.airport,
                    description: "Geneva Airport has its own rail station directly in the terminal building — accessible from Geneva Cornavin in under 8 minutes. It is one of the most convenient city-to-airport connections in Europe.",
                    bestTime: "Any time",
                    duration: "8 min",
                    entryFee: "CHF 3.50 (₹320)",
                    tips: ["The train runs every 6–8 minutes from Cornavin.", "Allow 2.5 hours before departure for check-in and security.", "Duty-free shopping inside GVA terminal is excellent."],
                    transports: [{ id: "t8", mode: "Train", durationMinutes: 8, distanceKm: 6, cost: "CHF 3.50", fromPlace: "Geneva Cornavin", toPlace: "Geneva Airport (GVA)" }],
                    activePlaces: [],
                },
                {
                    id: "f4", title: "Departure",
                    activityType: "sightseeing", startTime: "13:30", durationMinutes: null,
                    notes: "Safe travels! Au revoir, Switzerland.",
                    imageUrl: P.departure,
                    address: "Geneva Airport (GVA), Route de l'Aéroport, 1215 Geneva",
                    gallery: G.airport,
                    description: "Geneva Airport (GVA) is one of Europe's most pleasant departure experiences — spacious terminals, excellent duty-free retail, and a remarkable variety of dining before your flight.",
                    bestTime: "Any time",
                    duration: "—",
                    entryFee: "Free",
                    tips: ["Duty-free at GVA is excellent — pick up Swiss chocolate and wine.", "GVA has a French-side exit (for EU citizens) that is faster.", "The Caran d'Ache shop at GVA sells iconic Swiss pens and art supplies."],
                    transports: [], activePlaces: [],
                },
            ],
        },
    ],
};

// ---------------------------------------------------------------------------

type Props = { params: Promise<{ id: string }> };

export default function ItineraryDetailPage(_props: Props) {
    const data = MOCK_ITINERARY;
    const days = data.itineraryDays;

    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
        days[0]?.activities[0]?.id ?? null
    );

    const selectedDay = days[selectedDayIndex];

    const selectedActivity = selectedDay.activities.find(
        (a) => a.id === selectedActivityId
    ) ?? selectedDay.activities[0] ?? null;

    const dayItems = days.map((d) => ({
        dayNumber: d.dayNumber,
        title: d.title,
        coverImageUrl: d.coverImageUrl,
        destinationName: d.destination?.name ?? null,
    }));

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Hero */}
            <ItineraryDetailHero
                title={data.title}
                subtitle={data.subtitle}
                coverImageUrl={data.coverImageUrl}
                durationDays={data.durationDays}
                stayNights={data.stayNights}
                budgetMin={data.budgetMin}
                budgetMax={data.budgetMax}
                bestTimeLabel={data.bestTimeLabel}
            />

            {/* 3-column body — 20% | 50% | 30% */}
            <div className="mx-4 lg:mx-6 mt-5 grid grid-cols-10 gap-4 items-start">

                {/* Left — 20% (2 of 10) */}
                <div className="col-span-2">
                    <ItineraryLeftSidebar
                        days={dayItems}
                        selectedIndex={selectedDayIndex}
                        onSelectDay={(i) => {
                            setSelectedDayIndex(i);
                            setSelectedActivityId(days[i]?.activities[0]?.id ?? null);
                        }}
                        quickTips={data.quickTips}
                    />
                </div>

                {/* Center — 50% (5 of 10) */}
                <div className="col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5">
                    <DayTimeline
                        dayNumber={selectedDay.dayNumber}
                        totalDays={days.length}
                        title={selectedDay.title}
                        subtitle={selectedDay.subtitle}
                        temperature={selectedDay.temperature}
                        dayNote={selectedDay.dayNote}
                        activities={selectedDay.activities}
                        selectedActivityId={selectedActivityId}
                        onSelectActivity={setSelectedActivityId}
                    />
                </div>

                {/* Right — 30% (3 of 10) */}
                <div className="col-span-3">
                    <ActivityDetailPanel activity={selectedActivity} />
                </div>
            </div>
        </div>
    );
}
