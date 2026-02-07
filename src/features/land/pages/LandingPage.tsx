import Navbar from "@/components/layout/Navbar";
import Hero from "@/features/land/components/Hero";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
      </main>
    </>
  );
}
