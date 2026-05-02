import { HugeiconsIcon } from "@hugeicons/react";
import {
    CheckmarkCircle01Icon,
    Luggage01Icon,
    Money01Icon,
    UserGroupIcon,
} from "@hugeicons/core-free-icons";

const FEATURES = [
    { icon: CheckmarkCircle01Icon, label: "Handpicked Itineraries" },
    { icon: Luggage01Icon, label: "Useful Travel Tips" },
    { icon: Money01Icon, label: "Budget Friendly Options" },
    { icon: UserGroupIcon, label: "Real Experiences" },
];

// const AVATAR_COLORS = [
//     "from-purple-400 to-pink-400",
//     "from-blue-400 to-cyan-400",
//     "from-orange-400 to-yellow-400",
//     "from-green-400 to-teal-400",
// ];

export default function HeroVibeCard() {
    return (
        <div className="rounded-2xl bg-gray-900/80 backdrop-blur-md p-6 text-white flex flex-col gap-5 h-fit">

            <div>
                <h3 className="text-lg font-semibold">Good vibes, great trips <span className="text-red-400">♥</span></h3>
            </div>

            <ul className="flex flex-col gap-3">
                {FEATURES.map((f) => (
                    <li key={f.label} className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 shrink-0">
                            <HugeiconsIcon icon={f.icon} size={16} strokeWidth={1.8}  />
                        </span>
                        <span className="text-sm text-gray-200">{f.label}</span>
                    </li>
                ))}
            </ul>

            {/* <div className="flex items-center gap-3 pt-1 border-t border-white/10">
                <div className="flex -space-x-2">
                    {AVATAR_COLORS.map((gradient, i) => (
                        <div
                            key={i}
                            className={`h-8 w-8 rounded-full bg-gradient-to-br ${gradient} border-2 border-gray-900`}
                        />
                    ))}
                </div>
                <p className="text-sm text-gray-300">Join <span className="text-white font-semibold">50K+</span> travelers</p>
            </div> */}

        </div>
    );
}
