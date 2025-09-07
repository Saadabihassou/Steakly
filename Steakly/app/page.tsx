import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import Hero from "@/components/Hero";
import {TrustedBy} from "@/components/TrustedBy"

export default function Home() {
  return (
    <main className="flex flex-col gap-16">
      <Hero />
      <TrustedBy />
      <FAQ />
      <Footer />
    </main>
  );
}
