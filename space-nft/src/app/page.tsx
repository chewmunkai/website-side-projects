import BackgroundScene from "@/components/scene/BackgroundScene";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Collection from "@/components/Collection";
import Stats from "@/components/Stats";
import Roadmap from "@/components/Roadmap";
import Team from "@/components/Team";
import Faq from "@/components/Faq";
import CtaCosmos from "@/components/CtaCosmos";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <BackgroundScene />
      <Nav />
      <main>
        <Hero />
        <Mission />
        <Collection />
        <Stats />
        <Roadmap />
        <Team />
        <Faq />
        <CtaCosmos />
      </main>
      <Footer />
    </>
  );
}
