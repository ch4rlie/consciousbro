import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Problem } from "@/components/site/Problem";
import { Ownership } from "@/components/site/Ownership";
import { BeingSeen } from "@/components/site/BeingSeen";
import { SurvivalStrategy } from "@/components/site/SurvivalStrategy";
import { MonthlyCall } from "@/components/site/MonthlyCall";
import { Circles } from "@/components/site/Circles";
import { WhoFor } from "@/components/site/WhoFor";
import { Container } from "@/components/site/Container";
import { Host } from "@/components/site/Host";
import { Faq } from "@/components/site/Faq";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <Ownership />
        <BeingSeen />
        <SurvivalStrategy />
        <MonthlyCall />
        <Circles />
        <WhoFor />
        <Container />
        <Host />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
