import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import Statistics from "@/components/Statistics";
import AboutUsStory from "@/components/AboutUsStory";
import MissionVision from "@/components/MissionVision";
import GreenAcresDifference from "@/components/GreenAcresDifference";
import Team from "@/components/Team";
import CoffeeMap from "@/components/CoffeeMap";
import CoffeeScrollShowcase from "@/components/CoffeeScrollShowcase";
import EthiopiaCulture from "@/components/EthiopiaCulture";
import CoffeeJourney from "@/components/CoffeeJourney";
import OrderingProcess from "@/components/OrderingProcess";

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />

      {/* Identity & Origin Block */}
      <EthiopiaCulture />
      <AboutUsStory />
      <CoffeeMap />
      <MissionVision />

      {/* Product & Validation Block */}
      <CoffeeScrollShowcase />
      <Statistics />

      {/* Logistics & Service Block */}
      <CoffeeJourney />
      <OrderingProcess />
      <GreenAcresDifference />

      {/* Team Block */}
      <Team />
    </>
  );
}
