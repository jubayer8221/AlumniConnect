import { Box } from "@mui/material";
import LandingHeader from "./LandingHeader";
import HeroSection from "./HeroSection";
import FeaturedSlider from "./FeaturedSlider";
// import AboutUsSection from "./AboutUsSection";
import ProgramsSection from "./ProgramsSection";
import EventsSection from "./event/EventsSection";
import NewsSection from "./NewsSection";
import ActivitiesSection from "./ActivitiesSection";
import MomentsGallery from "./MomentsGallery";
import JoinNetworkSection from "./JoinNetworkSection";
import LandingFooter from "./LandingFooter";
import AboutUsSection from "./AboutUs";

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <LandingHeader />
      <Box component="main">
        <HeroSection />
        <FeaturedSlider />
        <AboutUsSection />
        <ProgramsSection />
        <EventsSection />
        <NewsSection />
        <ActivitiesSection />
        <MomentsGallery />
        <JoinNetworkSection />
      </Box>
      <LandingFooter />
    </Box>
  );
}
