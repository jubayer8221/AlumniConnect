import type { ReactNode } from "react";
import { Bell, BookOpen, Users } from "lucide-react";

export interface ActivityItem {
  id: string; // used in URL — must be unique and URL-safe
  icon: ReactNode;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  content: string; // full body — split on \n\n for paragraphs
  color: string;
  image: string;
}

export const ACTIVITIES: ActivityItem[] = [
  {
    id: "winter-reunion-2026-registration-opens",
    icon: <Bell size={18} />,
    category: "Announcement",
    date: "Oct 08, 2026",
    title: "Winter Reunion 2026 Registration Opens",
    excerpt:
      "Registration is now open for the biggest alumni gathering of the year. Early birds get priority seating and a special welcome kit.",
    content:
      "Registration for the Winter Reunion 2026 is officially open. This year's gathering will bring together alumni from every graduating batch for a day of celebration, reconnection, and reflection.\n\nThe event will be held on December 20 at the Victoria Academy Main Auditorium. Doors open at 5:30 PM, with the formal program beginning at 6:00 PM.\n\nEarly-bird registrants (before November 15) receive priority seating, a commemorative alumni pin, and a printed copy of the new alumni directory.\n\nHighlights of the evening include a keynote address from a distinguished alumnus, live performances by the current student cultural team, and the annual awards ceremony honoring outstanding contributions to the alumni community.\n\nSeats are limited to 300 attendees on a first-come, first-served basis. Register through the Alumni Portal under Events.",
    color: "var(--color-primary)",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "career-mentorship-program-kicks-off",
    icon: <BookOpen size={18} />,
    category: "Workshop",
    date: "Oct 02, 2026",
    title: "Career Mentorship Program Kicks Off",
    excerpt:
      "120 mentors across IT, banking, and healthcare have signed up. Students can now request one-on-one sessions through the portal.",
    content:
      'The Alumni Career Mentorship Program has officially launched with over 120 alumni mentors signing up across IT, banking, healthcare, education, and consulting.\n\nThe program matches current students and recent graduates with experienced alumni for one-on-one guidance. Mentees can request sessions through the Alumni Portal under the Mentorship section — pick a mentor based on industry, expertise, or background.\n\nEach match runs for a three-month cycle with a suggested cadence of one 45-minute session per month. Both mentees and mentors receive guidance on structuring their conversations.\n\n"The response has been extraordinary," says the Alumni Office. "We had mentors from three continents sign up within the first week. This is exactly the kind of cross-generational exchange that makes our community special."\n\nTo sign up as a mentor or mentee, visit /alumni/network/mentorship after logging in.',
    color: "var(--color-category-orange)",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "new-chapter-launched-in-dhaka",
    icon: <Users size={18} />,
    category: "Community",
    date: "Sep 25, 2026",
    title: "New Chapter Launched in Dhaka",
    excerpt:
      "The Dhaka chapter opened with 80 founding members. Monthly meetups begin this November — sign up to be part of the founding circle.",
    content:
      'The Dhaka Alumni Chapter officially launched on September 25 with 80 founding members in attendance at a warm inaugural event.\n\nThe chapter will host monthly meetups on the last Saturday of every month, rotating between member-hosted venues across the city. Meetups typically include a networking session, a short talk from a member, and an open discussion on community initiatives.\n\nBeyond casual meetups, the chapter is planning a formal mentorship pipeline with local universities, a small scholarship fund for current Victoria Academy students from Dhaka, and a business directory connecting alumni-owned ventures.\n\n"For those of us who moved to Dhaka after graduation, this chapter feels like coming home," said one of the founding organizers. "We want to build something that lasts for decades."\n\nSign up through the Alumni Portal to join the founding circle and receive meetup invitations.',
    color: "var(--color-info)",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
];

export const getActivityById = (id: string) =>
  ACTIVITIES.find((a) => a.id === id) ?? null;
