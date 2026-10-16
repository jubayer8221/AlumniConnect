import { Box, Typography } from "@mui/material";
import LegalPageLayout from "@/components/landingPage/LegalPageLayout";
import { appConfig } from "@/config/appConfig";

const LAST_UPDATED = "January 15, 2026";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      badge="Legal"
      title="Privacy"
      highlightText="Policy"
      subtitle="How we collect, use, and protect your personal information."
      lastUpdated={LAST_UPDATED}
    >
      <Typography>
        {appConfig.appName} ("we", "us", or "our") operates the{" "}
        {appConfig.appName} alumni platform. This Privacy Policy explains what
        information we collect from alumni, members, and visitors, how we use
        it, and the choices you have. By using the platform, you agree to this
        policy.
      </Typography>

      <h2>1. Who we are</h2>
      <p>
        {appConfig.appName} is operated by {appConfig.institutionName}. For
        privacy questions, contact us at{" "}
        <a href={`mailto:${appConfig.contactEmail}`}>
          {appConfig.contactEmail}
        </a>
        .
      </p>

      <h2>2. Information we collect</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>
          <strong>Account details</strong> — name, email address, phone number,
          password, and profile photo.
        </li>
        <li>
          <strong>Alumni profile</strong> — graduation year, department, current
          occupation, employer, city, and biography.
        </li>
        <li>
          <strong>Communications</strong> — messages you send through the
          platform, mentorship requests, and event registrations.
        </li>
        <li>
          <strong>Payment details</strong> — processed by our payment provider;
          we do not store full card numbers.
        </li>
      </ul>

      <h3>Information collected automatically</h3>
      <ul>
        <li>IP address, browser type, device type, and operating system.</li>
        <li>Pages viewed, links clicked, and time spent on each page.</li>
        <li>Cookies and similar technologies (see our Cookie Policy).</li>
      </ul>

      <h3>Information from third parties</h3>
      <ul>
        <li>
          Institutional records used to verify your alumni status, where you
          have consented or where the institution is permitted to share them.
        </li>
        <li>Social sign-in providers, if you choose to sign in with them.</li>
      </ul>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To create and manage your alumni account.</li>
        <li>
          To power the alumni directory, messaging, and mentorship features.
        </li>
        <li>
          To send event invitations, notices, and news you have opted into.
        </li>
        <li>To verify your identity and prevent fraud or abuse.</li>
        <li>
          To improve the platform through aggregated, anonymized analytics.
        </li>
        <li>
          To comply with legal obligations and enforce our Terms of Service.
        </li>
      </ul>

      <h2>4. Legal basis for processing</h2>
      <p>
        Where required by law (for example under the GDPR), we rely on the
        following legal bases:
      </p>
      <ul>
        <li>
          <strong>Consent</strong> — for marketing emails, non-essential
          cookies, and directory visibility.
        </li>
        <li>
          <strong>Contract</strong> — to provide the services you have signed up
          for.
        </li>
        <li>
          <strong>Legitimate interests</strong> — to keep the platform secure
          and improve it.
        </li>
        <li>
          <strong>Legal obligation</strong> — where we must retain or disclose
          data to comply with the law.
        </li>
      </ul>

      <h2>5. How we share your information</h2>
      <p>We do not sell your personal information. We share it only with:</p>
      <ul>
        <li>
          <strong>Other alumni</strong> — only the fields you choose to make
          visible in the directory.
        </li>
        <li>
          <strong>Service providers</strong> — hosting, email delivery,
          analytics, and payment processing, under written confidentiality
          agreements.
        </li>
        <li>
          <strong>{appConfig.institutionName}</strong> — for institutional
          record-keeping and alumni relations, in aggregated or limited form.
        </li>
        <li>
          <strong>Legal authorities</strong> — when required by law or to
          protect the rights and safety of our members.
        </li>
      </ul>

      <h2>6. How long we keep your information</h2>
      <p>
        We keep your account information for as long as your account is active.
        After you delete your account, we remove or anonymize your personal data
        within 30 days, except where we are required to retain it for legal,
        tax, or accounting purposes.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct,
        delete, restrict, or port your personal data, and to object to certain
        processing. To exercise any of these rights, email{" "}
        <a href={`mailto:${appConfig.contactEmail}`}>
          {appConfig.contactEmail}
        </a>
        . We will respond within 30 days.
      </p>
      <p>
        If you are in the EEA or UK, you also have the right to lodge a
        complaint with your local data protection authority.
      </p>

      <h2>8. Security</h2>
      <p>
        We use encryption in transit (HTTPS), hashed passwords, and access
        controls to protect your data. No system is fully secure; please use a
        strong, unique password and tell us immediately if you suspect
        unauthorized access.
      </p>

      <h2>9. Children</h2>
      <p>
        The platform is intended for alumni aged 18 and over. We do not
        knowingly collect data from anyone under 16. If you believe a minor has
        registered, contact us and we will remove the account.
      </p>

      <h2>10. International transfers</h2>
      <p>
        Your data may be stored on servers located outside your country. Where
        we transfer data internationally, we use appropriate safeguards such as
        Standard Contractual Clauses.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we do, we will change
        the "Last updated" date and, for material changes, notify you by email
        or in-app.
      </p>

      <h2>12. Contact us</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href={`mailto:${appConfig.contactEmail}`}>
          {appConfig.contactEmail}
        </a>{" "}
        or write to us at:
      </p>
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
