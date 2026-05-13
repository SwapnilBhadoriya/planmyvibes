import { Pacifico } from "next/font/google";
import Link from "next/link";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

export const metadata = { title: "Terms of Service — TripVibee" };

const SECTIONS = [
    {
        id: "acceptance",
        emoji: "✋",
        title: "Acceptance of Terms",
        content: [
            {
                subtitle: null,
                body: "By accessing or using TripVibee (the 'Platform'), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our platform. These terms apply to all visitors, users and anyone who accesses TripVibee.",
            },
        ],
    },
    {
        id: "platform",
        emoji: "🗺️",
        title: "About the Platform",
        content: [
            {
                subtitle: null,
                body: "TripVibee is a travel inspiration and itinerary discovery platform. We provide curated travel content, destination guides and itinerary ideas to help you plan better trips. TripVibee does not act as a travel agent, tour operator or booking service. Any bookings made through third-party links are governed by those third parties' own terms.",
            },
        ],
    },
    {
        id: "accounts",
        emoji: "👤",
        title: "User Accounts",
        content: [
            {
                subtitle: "Creating an account",
                body: "Some features of TripVibee may require you to create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.",
            },
            {
                subtitle: "Accurate information",
                body: "You agree to provide accurate, current and complete information when creating your account and to update it promptly if anything changes. We reserve the right to suspend or terminate accounts with inaccurate or misleading information.",
            },
        ],
    },
    {
        id: "conduct",
        emoji: "🤝",
        title: "Acceptable Use",
        content: [
            {
                subtitle: null,
                body: "You agree to use TripVibee only for lawful purposes and in a way that does not infringe the rights of others. You must not post or share content that is harmful, abusive, hateful, or misleading. You must not attempt to gain unauthorised access to any part of the platform, scrape or copy our content without permission, or use the platform in any way that could damage or overburden our systems.",
            },
        ],
    },
    {
        id: "content",
        emoji: "✍️",
        title: "User-Generated Content",
        content: [
            {
                subtitle: "Your content",
                body: "If you submit reviews, photos, comments or any other content to TripVibee, you grant us a non-exclusive, royalty-free licence to use, display and distribute that content on our platform. You retain ownership of your content.",
            },
            {
                subtitle: "Our standards",
                body: "We reserve the right to remove any user-generated content that violates these terms or our community guidelines, without prior notice. We are not responsible for the accuracy or reliability of user-submitted content.",
            },
        ],
    },
    {
        id: "ip",
        emoji: "🔐",
        title: "Intellectual Property",
        content: [
            {
                subtitle: null,
                body: "All content on TripVibee — including itineraries, destination descriptions, graphics, logos and design — is the property of TripVibee or its content partners and is protected by applicable intellectual property laws. You may not reproduce, distribute or create derivative works from our content without our express written permission.",
            },
        ],
    },
    {
        id: "disclaimer",
        emoji: "⚠️",
        title: "Disclaimers",
        content: [
            {
                subtitle: "Travel information",
                body: "TripVibee provides travel content for inspiration and planning purposes only. While we strive for accuracy, we cannot guarantee that all information is up-to-date. Travel conditions, prices, visa requirements and local regulations change frequently. Always verify critical information with official sources before travelling.",
            },
            {
                subtitle: "No warranties",
                body: "The platform is provided on an 'as is' basis without warranties of any kind, either express or implied. We do not warrant that the platform will be uninterrupted, error-free or free from viruses or other harmful components.",
            },
        ],
    },
    {
        id: "liability",
        emoji: "⚖️",
        title: "Limitation of Liability",
        content: [
            {
                subtitle: null,
                body: "To the fullest extent permitted by law, TripVibee shall not be liable for any indirect, incidental, special or consequential damages arising from your use of the platform, including but not limited to loss of profits, data or travel expenses. Our total liability for any claim shall not exceed the amount you paid us (if any) in the 12 months prior to the claim.",
            },
        ],
    },
    {
        id: "links",
        emoji: "🔗",
        title: "Third-Party Links",
        content: [
            {
                subtitle: null,
                body: "TripVibee may contain links to third-party websites, booking platforms or services. These links are provided for your convenience only. We have no control over the content, privacy policies or practices of those sites and accept no responsibility for them. We encourage you to read their terms and privacy policies before using their services.",
            },
        ],
    },
    {
        id: "termination",
        emoji: "🚫",
        title: "Termination",
        content: [
            {
                subtitle: null,
                body: "We reserve the right to suspend or permanently terminate your access to TripVibee at any time, with or without notice, if we believe you have violated these terms or are using the platform in a way that could harm other users or the integrity of the platform.",
            },
        ],
    },
    {
        id: "changes",
        emoji: "📝",
        title: "Changes to These Terms",
        content: [
            {
                subtitle: null,
                body: "We may update these Terms of Service from time to time. When we make significant changes, we will update the date at the top of this page. Continued use of TripVibee after changes are posted constitutes your acceptance of the revised terms.",
            },
        ],
    },
    {
        id: "governing",
        emoji: "🏛️",
        title: "Governing Law",
        content: [
            {
                subtitle: null,
                body: "These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in India.",
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
                body: "If you have any questions about these Terms of Service, please reach out to us at hello@tripvibee.com. We are always happy to clarify anything and will respond within 48 hours.",
            },
        ],
    },
];

export default function TermsPage() {
    return (
        <main className="overflow-x-hidden pb-10">

            {/* Hero */}
            <section className="relative overflow-hidden mx-3 sm:mx-4 xl:mx-6 rounded-2xl xl:rounded-3xl mt-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 sm:px-12 py-12 sm:py-16 text-white">

                {/* Dot grid */}
                <svg className="absolute top-4 right-4 opacity-10 pointer-events-none" width="100" height="100" viewBox="0 0 80 80">
                    <pattern id="tdots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="white" />
                    </pattern>
                    <rect width="80" height="80" fill="url(#tdots)" />
                </svg>

                {/* Dashed arc */}
                <svg className="absolute bottom-0 right-0 opacity-10 pointer-events-none" viewBox="0 0 300 120" fill="none" width="300">
                    <path d="M300 100 C 220 20, 100 80, 0 30" stroke="white" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
                </svg>

                {/* Purple accent glow */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                        Legal
                    </span>
                    <h1 className={`text-4xl sm:text-5xl font-bold leading-tight mb-4 ${pacifico.className}`}>
                        Terms of Service
                    </h1>
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-lg">
                        Please read these terms carefully before using TripVibee. They outline your rights, responsibilities and our commitments to you as a traveller.
                    </p>
                    <p className="text-xs text-white/40 mt-5">Last updated: May 10, 2026</p>
                </div>
            </section>

            {/* Main content */}
            <div className="mx-3 sm:mx-4 xl:mx-6 mt-4 grid grid-cols-1 xl:grid-cols-[220px_1fr] gap-4 items-start">

                {/* Sticky TOC — desktop */}
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

                {/* Sections */}
                <div className="flex flex-col gap-4">

                    {/* Intro card */}
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 sm:p-6 flex gap-4 items-start">
                        <span className="text-3xl shrink-0">⚖️</span>
                        <div>
                            <p className="text-sm font-bold text-gray-900 mb-1">Simple, honest terms.</p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                We've written these terms in plain language so you know exactly what to expect. If anything is unclear, <Link href="/about#contact" className="text-purple-600 font-semibold hover:underline">contact us</Link> — we'll be happy to explain.
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
                                <span className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl shrink-0 border border-gray-100">
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
                            <span className="text-4xl">✈️</span>
                            <div>
                                <p className="font-bold text-gray-900">Questions about our terms?</p>
                                <p className="text-sm text-gray-500 mt-0.5">We're just an email away at hello@tripvibee.com.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 flex-wrap justify-center shrink-0">
                            <Link
                                href="/privacy"
                                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-bold rounded-full px-5 py-2.5 transition-colors whitespace-nowrap"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/about#contact"
                                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-full px-5 py-2.5 transition-colors whitespace-nowrap"
                            >
                                Contact Us →
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
