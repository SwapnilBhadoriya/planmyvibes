import Image from "next/image";

const TEAM = [
    { name: "Ananya Sharma", role: "Founder & Travel Planner",     avatar: "https://i.pravatar.cc/120?img=47" },
    { name: "Rohit Verma",   role: "Content & Research Lead",      avatar: "https://i.pravatar.cc/120?img=12" },
    { name: "Meera Iyer",    role: "Experience Curator",           avatar: "https://i.pravatar.cc/120?img=32" },
    { name: "Karan Malhotra",role: "Design & Visual Storyteller",  avatar: "https://i.pravatar.cc/120?img=68" },
];

const SIGNS = [
    { label: "EXPLORE",  bg: "bg-red-500",     arrow: "border-l-red-500" },
    { label: "DREAM",    bg: "bg-purple-500",   arrow: "border-l-purple-500" },
    { label: "DISCOVER", bg: "bg-emerald-500",  arrow: "border-l-emerald-500" },
];

function InstagramIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4l16 16" /><path d="M4 20 20 4" />
        </svg>
    );
}

export default function TeamSection() {
    return (
        <section className="relative overflow-hidden mx-3 sm:mx-4 xl:mx-6 bg-purple-50 border border-purple-100 rounded-2xl mt-4 p-5 sm:p-8">

            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-8 xl:gap-12">

                {/* Left text */}
                <div className="xl:w-60 flex-shrink-0">
                    <p className="text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-2">Meet the Team</p>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3">
                        The explorers behind{" "}
                        <span className="text-gray-900">Trip</span>
                        <span className="text-purple-600">Vibee</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" className="inline ml-1 align-middle">
                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </h2>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        We're a team of travel lovers, storytellers and planners who believe in meaningful journeys and good vibes.
                    </p>
                </div>

                {/* Team cards */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-5 xl:gap-7">
                    {TEAM.map((member) => (
                        <div key={member.name} className="flex flex-col items-center gap-2 text-center">
                            <Image
                                src={member.avatar}
                                alt={member.name}
                                width={120}
                                height={120}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-3 border-white shadow-md"
                            />
                            <p className="text-sm font-bold text-gray-900 leading-tight">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                            <div className="flex items-center gap-1.5">
                                {[InstagramIcon, XIcon].map((Icon, i) => (
                                    <button key={i} className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-purple-50 transition-colors">
                                        <Icon />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Signpost — desktop only */}
                <div className="hidden xl:flex flex-col items-center flex-shrink-0 relative">
                    {/* Dashed arc */}
                    <svg className="absolute -left-16 -top-4 opacity-20" width="120" height="120" viewBox="0 0 120 120" fill="none">
                        <path d="M10 110 Q60 10 110 60" stroke="#7C3AED" strokeWidth="2" strokeDasharray="5 4" fill="none" />
                    </svg>

                    <div className="flex flex-col gap-1.5 mb-1">
                        {SIGNS.map((sign) => (
                            <div key={sign.label} className="relative">
                                <span className={`${sign.bg} text-white text-[11px] font-extrabold tracking-wide px-3 py-1.5 rounded-sm block`}>
                                    {sign.label}
                                </span>
                                <span className={`absolute -right-[9px] top-1/2 -translate-y-1/2 border-[9px] border-transparent ${sign.arrow}`} />
                            </div>
                        ))}
                    </div>
                    <div className="w-1.5 h-16 bg-gray-400 rounded-full" />
                    <span className="text-2xl -mt-1">🌿</span>
                </div>

            </div>
        </section>
    );
}
