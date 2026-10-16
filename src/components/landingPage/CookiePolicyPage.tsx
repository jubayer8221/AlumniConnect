import { Box, Typography } from "@mui/material";
import LegalPageLayout from "@/components/landingPage/LegalPageLayout";
import { appConfig } from "@/config/appConfig";

const LAST_UPDATED = "January 15, 2026";

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      badge="Legal"
      title="Cookie"
      highlightText="Policy"
      subtitle="What cookies we use, why, and how you can control them."
      lastUpdated={LAST_UPDATED}
    >
      <Typography>
        This Cookie Policy explains how {appConfig.appName} uses cookies and
        similar technologies on our website and alumni platform. It should be
        read alongside our Privacy Policy.
      </Typography>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device by your browser when
        you visit a website. They help the site remember your preferences, keep
        you signed in, and understand how the site is used. Similar technologies
        include local storage, session storage, and pixels.
      </p>

      <h2>2. How we use cookies</h2>
      <p>We group the cookies we use into four categories:</p>

      <Box sx={{ overflowX: "auto", mb: 2 }}>
        <Box
          component="table"
          sx={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.88rem",
            "& th, & td": {
              textAlign: "left",
              p: 1.5,
              border: "1px solid",
              borderColor: "divider",
              verticalAlign: "top",
            },
            "& th": {
              bgcolor: "action.hover",
              fontWeight: 700,
              color: "text.primary",
            },
            "& td": { color: "text.secondary" },
          }}
        >
          <thead>
            <tr>
              <th>Category</th>
              <th>Purpose</th>
              <th>Examples</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Strictly necessary</strong>
              </td>
              <td>
                Required for the platform to work. Cannot be disabled without
                breaking sign-in, navigation, or security.
              </td>
              <td>Session cookie, CSRF token, load balancer affinity.</td>
            </tr>
            <tr>
              <td>
                <strong>Functional</strong>
              </td>
              <td>
                Remember your preferences — language, theme, sidebar state,
                recently viewed.
              </td>
              <td>Theme preference, sidebar collapse state.</td>
            </tr>
            <tr>
              <td>
                <strong>Analytics</strong>
              </td>
              <td>
                Help us understand how the platform is used so we can improve
                it. Data is aggregated.
              </td>
              <td>Page views, session duration, error tracking.</td>
            </tr>
            <tr>
              <td>
                <strong>Marketing</strong>
              </td>
              <td>
                Used only if you opt in. Help us measure the reach of alumni
                campaigns.
              </td>
              <td>Campaign attribution, referral tracking.</td>
            </tr>
          </tbody>
        </Box>
      </Box>

      <h2>3. Third-party cookies</h2>
      <p>
        Some cookies are set by trusted third parties we use to run the
        platform:
      </p>
      <ul>
        <li>
          <strong>Analytics providers</strong> — to measure usage and detect
          errors.
        </li>
        <li>
          <strong>Payment processors</strong> — to complete event registration
          payments securely.
        </li>
        <li>
          <strong>Embedded content</strong> — if you view a page containing an
          embedded video or map, that provider may set its own cookies.
        </li>
      </ul>
      <p>
        We do not control third-party cookies. Please refer to each provider's
        own cookie policy for details.
      </p>

      <h2>4. How to manage cookies</h2>
      <p>
        You can control cookies through your browser settings. Most browsers let
        you block all cookies, block third-party cookies, or delete cookies
        after each session. Where to find these settings:
      </p>
      <ul>
        <li>Chrome — Settings → Privacy and security → Cookies</li>
        <li>Firefox — Settings → Privacy &amp; Security → Cookies</li>
        <li>Safari — Preferences → Privacy → Cookies</li>
        <li>Edge — Settings → Cookies and site permissions</li>
      </ul>
      <p>
        Blocking strictly necessary cookies will prevent you from signing in and
        using the platform. Blocking analytics or marketing cookies will not
        affect your ability to use the platform.
      </p>

      <h2>5. Do Not Track</h2>
      <p>
        Some browsers send a "Do Not Track" signal. There is no common industry
        standard for responding to it, so we do not currently act on DNT
        signals. We do honor opt-outs through the mechanisms described above.
      </p>

      <h2>6. Changes to this policy</h2>
      <p>
        We may update this Cookie Policy as our practices change. When we do, we
        will update the "Last updated" date at the top of this page.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about our use of cookies? Email{" "}
        <a href={`mailto:${appConfig.contactEmail}`}>
          {appConfig.contactEmail}
        </a>
        .
      </p>

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
