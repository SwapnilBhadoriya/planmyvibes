export default function VibeFinder() {
    return (
        <section className="rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-100 p-5 border border-purple-100">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <h2 className="font-bold text-gray-900 text-base">
                        <span className="text-purple-600">N</span>ot sure where to go?
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        Let our vibe finder help you find the perfect trip!
                    </p>
                </div>
                <span className="text-3xl shrink-0">🪧</span>
            </div>

            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-full py-3 transition-colors flex items-center justify-center gap-2">
                🔍 Find My Vibe
            </button>
        </section>
    );
}
