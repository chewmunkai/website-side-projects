import Nav from "@/components/Nav";
import Journey from "@/components/Journey";
import Why from "@/components/Why";
import Stats from "@/components/Stats";
import Roadmap from "@/components/Roadmap";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <span id="top" aria-hidden="true" />
      <Nav />
      <main>
        <Journey />
        <Why />
        <Stats />
        <Roadmap />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
