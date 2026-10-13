import { lazy } from "react";
import { Box } from "@mui/material";
import LandingHeader from "./LandingHeader";
import HeroSection from "./HeroSection";
import AboutUsSection from "./AboutUs";
import DeferredSection from "./DeferredSection";

const ProgramsSection = lazy(() => import("./ProgramsSection"));
const EventsSection = lazy(() => import("./event/EventsSection"));
const NewsSection = lazy(() => import("./PublicNewsSection"));
const ActivitiesSection = lazy(() => import("./ActivitiesSection"));
const FeaturedSlider = lazy(() => import("./FeaturedSlider"));
const MomentsGallery = lazy(() => import("./MomentsGallery"));
const JoinNetworkSection = lazy(() => import("./JoinNetworkSection"));
const LandingFooter = lazy(() => import("./LandingFooter"));

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <LandingHeader />
      <Box component="main">
        <HeroSection />
        <AboutUsSection />
        <DeferredSection id="programs" minHeight={480}>
          <ProgramsSection />
        </DeferredSection>
        <DeferredSection id="events" minHeight={500}>
          <EventsSection />
        </DeferredSection>
        <DeferredSection minHeight={520}>
          <NewsSection />
        </DeferredSection>
        <DeferredSection id="activities" minHeight={520}>
          <ActivitiesSection />
        </DeferredSection>
        <DeferredSection minHeight={480}>
          <FeaturedSlider />
        </DeferredSection>
        <DeferredSection id="gallery" minHeight={560}>
          <MomentsGallery />
        </DeferredSection>
        <DeferredSection minHeight={420}>
          <JoinNetworkSection />
        </DeferredSection>
        <DeferredSection minHeight={240}>
          <LandingFooter />
        </DeferredSection>
      </Box>
    </Box>
  );
}
