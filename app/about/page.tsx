import AboutHero from "@/components/about/AboutHero";
import StatsBar from "@/components/about/StatsBar";
import StorySection from "@/components/about/StorySection";
import TeamSection from "@/components/about/TeamSection";
import ContactSection from "@/components/about/ContactSection";

export const metadata = { title: "About Us — TripVibee" };

export default function AboutPage() {
    return (
        <main className="overflow-x-hidden pb-4">
            <AboutHero />
            <StatsBar />
            <StorySection />
            <TeamSection />
            <ContactSection />
        </main>
    );
}
