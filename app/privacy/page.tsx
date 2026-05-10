import { Pacifico } from "next/font/google";
import Link from "next/link";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

export const metadata = { title: "Privacy Policy — TripVibee" };

const SECTIONS = [
    {
        id: "information",
        emoji: "📋",
        title: "Information We Collect",
        content: [
            {
                subtitle: "Information you provide",
                body: "When you use TripVibee, you may provide us with your name, email address, travel preferences, saved itineraries, and any messages you send us. We only collect what's necessary to give you a great experience.",
            },
            {
                subtitle: "Information collected automatically",
                body: "We may collect certain data automatically when you visit our platform — such as your browser type, device, pages visited, and general location (country/region). This helps us understand how people use TripVibee so we can keep improving it.",
            },
        ],
    },
    {
        id: "usage",
        emoji: "🗺️",
        title: "How We Use Your Information",
        content: [
            {
                subtitle: null,
                body: "We use the information we collect to personalise your travel experience, recommend destinations and itineraries that match your vibe, send you updates or travel inspiration (only if you opt in), improve our platform and fix any bugs, and respond to your messages and support requests.",
            },
        ],
    },
    {
        id: "sharing",
        emoji: "🤝",
        title: "Sharing Your Information",
        content: [
            {
                subtitle: null,
                body: "We do not sell, rent or trade your personal information to any third party. We may share anonymised, aggregated data (e.g. 'most searched destinations') with partners for research purposes. We may share information only when required by law or to protect the safety of our users.",
            },
        ],
    },
    {
        id: "cookies",
        emoji: "🍪",
        title: "Cookies",
        content: [
            {
                subtitle: null,
                body: "TripVibee uses cookies to remember your preferences, keep you logged in, and understand how you use the site. You can control or disable cookies through your browser settings. Disabling cookies may affect some features of the platform.",
            },
        ],
    },
    {
        id: "security",
        emoji: "🔒",
        title: "Data Security",
        content: [
            {
                subtitle: null,
                body: "We take the security of your data seriously. We use industry-standard encryption and security practices to protect your information. While no system is 100% secure, we constantly work to keep your data safe and review our practices regularly.",
            },
        ],
    },
    {
        id: "rights",
        emoji: "✅",
        title: "Your Rights",
        content: [
            {
                subtitle: null,
                body: "You have the right to access the personal data we hold about you, request corrections to inaccurate data, request deletion of your data (right to be forgotten), opt out of marketing communications at any time, and lodge a complaint with your local data protection authority. To exercise any of these rights, reach out to us at hello@tripvibee.com.",
            },
        ],
    },
    {
        id: "children",
        emoji: "👶",
        title: "Children's Privacy",
        content: [
            {
                subtitle: null,
                body: "TripVibee is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately and we will delete it.",
            },
        ],
    },
    {
        id: "changes",
        emoji: "📝",
        title: "Changes to This Policy",
        content: [
            {
                subtitle: null,
                body: "We may update this Privacy Policy from time to time. When we do, we'll update the date at the top of this page. We encourage you to review this policy periodically to stay informed about how we protect your information.",
            },
        ],
    },
    {
        id: "contact",
        emoji: "✉️",
        title: "Contact Us",
        content: [
            {
                subtitle: null,
                body: "If you have any questions about this Privacy Policy or how we handle your data, we'd love to hear from you. Email us at hello@tripvibee.com or visit our Contact Us page.",
            },
        ],
    },
];

export default function PrivacyPage() {
    return (
        <main className="overflow-x-hidden pb-10">

            {/* Hero */}
            <section className="relative overflow-hidden mx-3 sm:mx-4 xl:mx-6 rounded-2xl xl:rounded-3xl mt-4 bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-700 px-6 sm:px-12 py-12 sm:py-16 text-white">

                {/* Decorative dots */}
                <svg className="absolute top-4 right-4 opacity-10 pointer-events-none" width="100" height="100" viewBox="0 0 80 80">
                    <pattern id="pdots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="white" />
                    </pattern>
                    <rect width="80" height="80" fill="url(#pdots)" />
                </svg>

                {/* Decorative dashed arc */}
                <svg className="absolute bottom-0 left-0 opacity-10 pointer-events-none" viewBox="0 0 300 120" fill="none" width="300">
                    <path d="M0 100 C 80 20, 200 80, 300 30" stroke="white" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
                </svg>

                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block bg-white/20 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                        Legal
                    </span>
                    <h1 className={`text-4xl sm:text-5xl font-bold leading-tight mb-4 ${pacifico.className}`}>
                        Privacy Policy
                    </h1>
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-lg">
                        At TripVibee, your trust is our compass. Here's exactly how we collect, use and protect your information — no jargon, just honesty.
                    </p>
                    <p className="text-xs text-white/50 mt-5">Last updated: May 10, 2026</p>
                </div>
            </section>

            {/* Main content */}
            <div className="mx-3 sm:mx-4 xl:mx-6 mt-4 grid grid-cols-1 xl:grid-cols-[220px_1fr] gap-4 items-start">

                {/* Sticky TOC — desktop only */}
                <nav className="hidden xl:block sticky top-20 self-start bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">On this page</p>
                    <ul className="flex flex-col gap-1">
                        {SECTIONS.map((s) => (
                            <li key={s.id}>
                                <a
                                    href={`#${s.id}`}
                                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 py-1 transition-colors rounded-lg px-2 hover:bg-purple-50"
                                >
                                    <span className="text-base">{s.emoji}</span>
                                    {s.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Policy sections */}
                <div className="flex flex-col gap-4">
                    {/* Intro card */}
                    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 sm:p-6 flex gap-4 items-start">
                        <span className="text-3xl shrink-0">✈️</span>
                        <div>
                            <p className="text-sm font-bold text-gray-900 mb-1">Your journey, your privacy.</p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                This policy explains how TripVibee handles your personal data. By using our platform, you agree to the practices described below. If something isn't clear, please <Link href="/about#contact" className="text-purple-600 font-semibold hover:underline">get in touch</Link> — we're happy to explain.
                            </p>
                        </div>
                    </div>

                    {SECTIONS.map((section) => (
                        <div
                            key={section.id}
                            id={section.id}
                            className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-7 shadow-sm scroll-mt-24"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl shrink-0">
                                    {section.emoji}
                                </span>
                                <h2 className="text-base sm:text-lg font-extrabold text-gray-900">{section.title}</h2>
                            </div>

                            <div className="flex flex-col gap-4">
                                {section.content.map((block, i) => (
                                    <div key={i}>
                                        {block.subtitle && (
                                            <p className="text-sm font-bold text-gray-800 mb-1">{block.subtitle}</p>
                                        )}
                                        <p className="text-sm text-gray-500 leading-relaxed">{block.body}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Bottom CTA */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">🧳</span>
                            <div>
                                <p className="font-bold text-gray-900">Still have questions?</p>
                                <p className="text-sm text-gray-500 mt-0.5">We're just an email away. We promise to respond within 48 hours.</p>
                            </div>
                        </div>
                        <Link
                            href="/about#contact"
                            className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-full px-6 py-3 transition-colors whitespace-nowrap"
                        >
                            Contact Us →
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}
