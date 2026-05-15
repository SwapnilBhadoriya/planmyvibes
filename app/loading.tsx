export default function Loading() {
    return (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-white">

            {/* Logo */}
            <div className="flex items-center mb-8 select-none">
                <span className="text-[1.6rem] font-extrabold text-gray-900 tracking-tight">TripVibee</span>
                <span className="text-[1.6rem] font-extrabold text-purple-600">+</span>
                <span className="ml-2 text-2xl">✈️</span>
            </div>

            {/* Plane on track */}
            <div className="relative w-56 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-200 to-purple-100" />
                <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-lg animate-plane"
                    style={{ animation: "plane-slide 1.6s ease-in-out infinite" }}
                >
                    ✈️
                </div>
                {/* Progress fill */}
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-purple-500"
                    style={{ animation: "track-fill 1.6s ease-in-out infinite" }}
                />
            </div>

            <p className="mt-5 text-xs text-gray-400 tracking-widest uppercase font-medium"
               style={{ animation: "pulse-text 1.6s ease-in-out infinite" }}>
                Planning your vibe…
            </p>

            <style>{`
                @keyframes plane-slide {
                    0%   { left: 0%;   opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { left: 100%; opacity: 0; }
                }
                @keyframes track-fill {
                    0%   { width: 0%; }
                    100% { width: 100%; }
                }
                @keyframes pulse-text {
                    0%, 100% { opacity: 0.4; }
                    50%       { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
