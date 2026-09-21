import { useEffect } from "react";
import { CubeProvider } from "../components/CubeController";
import Nav from "../components/Nav";
import CursorSpotlight from "../components/CursorSpotlight";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Builder from "../components/Builder";
import Work from "../sections/Work";
import Timeline from "../components/Timeline";
import TechStack from "../components/TechStack";
import BeyondScreen from "../components/BeyondScreen";
import Contact from "../components/Contact";

export default function Home() {
  useEffect(() => {
    document.title = "Niraj — Software Engineer · Product Builder";
  }, []);

  return (
    <CubeProvider>
      <main className="page-shell">
        <CursorSpotlight />
        <Nav />

        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <Hero />
          <hr className="section-divider" />
          <Builder />
          <hr className="section-divider" />
          <Work />
          <hr className="section-divider" />
          <Timeline />
          <hr className="section-divider" />
          <TechStack />
          <hr className="section-divider" />
          <BeyondScreen />
          <hr className="section-divider" />
          <Contact />
        </div>

        <Footer />
      </main>
    </CubeProvider>
  );
}