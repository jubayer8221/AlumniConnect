import { Box, Typography } from "@mui/material";
import LegalPageLayout from "@/components/landingPage/LegalPageLayout";
import { appConfig } from "@/config/appConfig";

const LAST_UPDATED = "January 15, 2026";

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      badge="Legal"
      title="Terms of"
      highlightText="Service"
      subtitle="The rules for using the alumni network, directory, and community features."
      lastUpdated={LAST_UPDATED}
    >
      <Typography>
        These Terms of Service ("Terms") govern your access to and use of the{" "}
        {appConfig.appName} platform operated by {appConfig.institutionName}. By
        creating an account or using the platform, you agree to these Terms. If
        you do not agree, please do not use the platform.
      </Typography>

      <h2>1. Acceptance of terms</h2>
      <p>
        By registering, accessing, or using the platform, you confirm that you
        have read, understood, and agree to be bound by these Terms and our
        Privacy Policy.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old and a verified alumnus, current
        student, faculty member, or invited guest of {appConfig.institutionName}{" "}
        to register. We may verify your alumni status using institutional
        records.
      </p>

      <h2>3. Your account</h2>
      <ul>
        <li>You are responsible for keeping your password confidential.</li>
        <li>
          You must provide accurate information and keep your profile up to
          date.
        </li>
        <li>
          You may not share your account or create accounts on behalf of others.
        </li>
        <li>
          Notify us immediately at{" "}
          <a href={`mailto:${appConfig.contactEmail}`}>
            {appConfig.contactEmail}
          </a>{" "}
          if you suspect unauthorized access.
        </li>
      </ul>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          Post content that is unlawful, defamatory, harassing, hateful,
          obscene, or invasive of another person's privacy.
        </li>
        <li>
          Impersonate another person, or misrepresent your affiliation with any
          person or organization.
        </li>
        <li>
          Use the directory, messaging, or mentorship features to send spam,
          solicitations, or unsolicited commercial communications.
        </li>
        <li>
          Scrape, harvest, or bulk-export member data without written
          permission.
        </li>
        <li>
          Attempt to gain unauthorized access to the platform, other accounts,
          or our systems.
        </li>
        <li>
          Upload malware, or interfere with the platform's normal operation.
        </li>
      </ul>

      <h2>5. Your content</h2>
      <p>
        You retain ownership of content you post (profile text, photos,
        messages). By posting, you grant us a worldwide, non-exclusive,
        royalty-free license to host, display, and distribute that content on
        the platform for the purpose of running the service.
      </p>
      <p>
        You represent that you own or have permission to share everything you
        post. We may remove content that violates these Terms or applicable law.
      </p>

      <h2>6. Alumni directory and messaging</h2>
      <ul>
        <li>
          You control what appears in the directory through your privacy
          settings.
        </li>
        <li>
          Messages sent through the platform are stored and may be reviewed if
          reported for abuse.
        </li>
        <li>
          Do not use member contact information obtained from the platform for
          any purpose unrelated to alumni networking.
        </li>
      </ul>

      <h2>7. Mentorship</h2>
      <p>
        Mentorship relationships are voluntary and informal. {appConfig.appName}{" "}
        does not supervise, endorse, or guarantee the outcome of any mentorship
        pairing and is not a party to any agreement between mentor and mentee.
      </p>

      <h2>8. Events and payments</h2>
      <ul>
        <li>
          Event registrations are subject to availability and any specific terms
          shown at checkout.
        </li>
        <li>
          Refunds are handled according to the policy stated on the event page.
        </li>
        <li>
          You are responsible for any taxes arising from your participation.
        </li>
      </ul>

      <h2>9. Intellectual property</h2>
      <p>
        The platform, including its design, logos, code, and original content,
        is owned by {appConfig.institutionName} or its licensors and is
        protected by copyright and trademark laws. You may not copy, modify, or
        redistribute it without permission.
      </p>

      <h2>10. Disclaimers</h2>
      <p>
        The platform is provided "as is" and "as available." We do not warrant
        that it will be uninterrupted, error-free, or free of harmful
        components. We are not responsible for the accuracy of content posted by
        members.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, {appConfig.institutionName} and
        its officers, employees, and agents will not be liable for any indirect,
        incidental, special, consequential, or punitive damages arising from
        your use of the platform. Our total liability for any claim will not
        exceed the greater of (a) the amount you paid us in the twelve months
        before the claim or (b) USD 50.
      </p>

      <h2>12. Termination</h2>
      <p>
        You may delete your account at any time. We may suspend or terminate
        your access if you violate these Terms, if required by law, or if we
        discontinue the platform. Sections that by their nature should survive
        termination (including intellectual property, disclaimers, and
        limitation of liability) will survive.
      </p>

      <h2>13. Governing law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which{" "}
        {appConfig.institutionName} is established, without regard to its
        conflict-of-laws principles. Any dispute will be resolved in the courts
        of that jurisdiction.
      </p>

      <h2>14. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be
        communicated by email or in-app notice. Continued use after changes take
        effect constitutes acceptance.
      </p>

      <h2>15. Contact</h2>
      <Box
        sx={{
          pl: 2,
          borderLeft: "3px solid",
          borderColor: "primary.main",
          color: "text.secondary",
          fontSize: "0.9rem",
          lineHeight: 1.7,
          mb: 2,
        }}
      >
        {appConfig.institutionName}
        <br />
        {appConfig.address}
        <br />
        <a href={`mailto:${appConfig.contactEmail}`}>
          {appConfig.contactEmail}
        </a>
      </Box>

      <Typography
        sx={{
          mt: 5,
          p: 2,
          bgcolor: "action.hover",
          borderRadius: 2,
          fontSize: "0.8rem",
          color: "text.secondary",
          fontStyle: "italic",
        }}
      >
        This document is a template for informational purposes and does not
        constitute legal advice. Please have it reviewed by a qualified lawyer
        familiar with the laws of your jurisdiction before publishing.
      </Typography>
    </LegalPageLayout>
  );
}
