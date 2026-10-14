import { lazy } from "react";
import { Box } from "@mui/material";
import LandingHeader from "./LandingHeader";
import HeroSection from "./HeroSection";
import DeferredSection from "./DeferredSection";

const AboutUsSection = lazy(() => import("./AboutUs"));
const ProgramsSection = lazy(() => import("./ProgramsSection"));
const EventsSection = lazy(() => import("./event/EventsSection"));
const NewsSection = lazy(() => import("./PublicNewsSection"));
const ActivitiesSection = lazy(() => import("./ActivitiesSection"));
const FeaturedSlider = lazy(() => import("./FeaturedSlider"));
const MomentsGallery = lazy(() => import("./MomentsGallery"));
const JoinNetworkSection = lazy(() => import("./JoinNetworkSection"));
const LandingFooter = lazy(() => import("./LandingFooter"));
const MentorshipBanner = lazy(() => import("./MentorshipBanner"));
const JobOpportunitiesSection = lazy(() => import("./JobOpportunitiesSection"));

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <LandingHeader />

      <Box component="main">
        {/* 1. Introduction */}
        <HeroSection />

        {/* 2. About the alumni community */}
        <DeferredSection minHeight={480}>
          <AboutUsSection />
        </DeferredSection>

        {/* 3. Programs and initiatives */}
        <DeferredSection id="programs" minHeight={480}>
          <ProgramsSection />
        </DeferredSection>

        {/* 4. Community activities */}
        <DeferredSection id="activities" minHeight={520}>
          <ActivitiesSection />
        </DeferredSection>

        {/* 5. Upcoming events and reunions */}
        <DeferredSection id="events" minHeight={500}>
          <EventsSection />
        </DeferredSection>

        {/* 6. Featured alumni or highlights */}
        <DeferredSection minHeight={480}>
          <FeaturedSlider />
        </DeferredSection>

        {/* 7. Latest news and announcements */}
        <DeferredSection minHeight={520}>
          <NewsSection />
        </DeferredSection>

        {/* 8. Career opportunities */}
        <DeferredSection id="jobs" minHeight={520}>
          <JobOpportunitiesSection />
        </DeferredSection>

        {/* 9. Mentorship and guidance */}
        <DeferredSection minHeight={420}>
          <MentorshipBanner />
        </DeferredSection>

        {/* 10. Shared memories */}
        <DeferredSection id="gallery" minHeight={560}>
          <MomentsGallery />
        </DeferredSection>

        {/* 11. Final membership invitation */}
        <DeferredSection minHeight={420}>
          <JoinNetworkSection />
        </DeferredSection>

        {/* 12. Footer */}
        <DeferredSection minHeight={240}>
          <LandingFooter />
        </DeferredSection>
      </Box>
    </Box>
  );
}
