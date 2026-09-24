# Alumni Network Project Report

## 1. Project Overview

Alumni Network is a React and TypeScript web application for managing an institution's alumni community. It provides two role-based experiences:

- **Administrator:** manages alumni records, verification and status, events, notices, reports, and institution settings.
- **Alumni user:** maintains a personal profile, controls privacy, browses other alumni, registers for events, reads notices, and changes a password.

The application is implemented as a single-page application using Vite, React 19, React Router, Redux Toolkit, Material UI, React Hook Form, Yup, Recharts, and Lucide icons. It can run against local mock services or a REST service layer selected through `VITE_DATA_SOURCE`.

## 2. Application Startup

The entry path is:

1. `src/main.tsx` mounts the React application in `StrictMode`.
2. `src/App.tsx` creates the Redux provider, dynamic MUI theme, browser router, route tree, and global toast container.
3. Authentication state is restored before protected content is shown.
4. A full-screen loading state is displayed while the session is unresolved.
5. The root route redirects unauthenticated users to `/login`, administrators to `/dashboard`, and alumni users to `/alumni/dashboard`.

The application uses `@` as a Vite path alias for `src`.

## 3. Access Model

`ProtectedRoute` enforces authentication and role access before rendering `AppLayout` and its nested routes.

### Administrator capabilities

- View the administrative dashboard.
- Create, view, edit, delete, verify, activate, and deactivate alumni records.
- Search, filter, sort, paginate, switch table/grid views, and export alumni data.
- Create and manage events, including registrations and capacity.
- Create and manage notices and publication status.
- View reports and export report data.
- Edit institution settings.
- Access shared alumni profile and self-service profile screens.

### Alumni capabilities

- View a personal dashboard.
- View and update the personal profile.
- Configure profile visibility and section privacy.
- Browse the alumni directory.
- View events and register or cancel registration.
- Read published notices.
- Change the account password.

## 4. Screen and Route Inventory

### Public and system screens

| Route           | Screen                                                         | Purpose                                                                              |
| --------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `/login`        | [LoginPage](src/components/login/LoginPage.tsx)                | Authenticates a user with a username, email, or phone-style identifier and password. |
| `/unauthorized` | [UnauthorizedPage](src/components/common/UnauthorizedPage.tsx) | Explains that the current user does not have permission for a route.                 |
| `*`             | [NotFoundPage](src/components/common/NotFoundPage.tsx)         | Displays an interactive 404 state and links to an appropriate home route.            |

### Shared authenticated screens

| Route                      | Screen                                                                      | Access                    | Purpose                                                                                        |
| -------------------------- | --------------------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------- |
| `/alumni/dashboard`        | [AlumniDashboardPage](src/components/dashboard/AlumniDashboardPage.tsx)     | Admin, Alumni             | Personal alumni overview with completion, profile details, events, notices, and quick actions. |
| `/alumni/profile`          | [AlumniDetailsPage](src/components/alumniProfile/AlumniDetailsPage.tsx)     | Admin, Alumni             | Displays the current user's profile.                                                           |
| `/alumni/profile-setup`    | [ProfileSetupPage](src/components/alumniProfile/ProfileSetupPage.tsx)       | Admin, Alumni             | Extended self-service profile editor.                                                          |
| `/alumni/settings-privacy` | [SettingsPrivacyPage](src/components/alumniProfile/SettingsPrivacyPage.tsx) | Admin, Alumni             | Controls global visibility and section-level privacy.                                          |
| `/alumni/directory`        | [AlumniDirectoryPage](src/components/alumniProfile/AlumniDirectoryPage.tsx) | Admin, Alumni             | Searchable and filterable alumni directory with grid/table views.                              |
| `/alumni/events`           | [EventListPage](src/components/event/EventListPage.tsx)                     | Admin, Alumni             | Lists upcoming, past, or all events.                                                           |
| `/alumni/events/:id`       | [EventDetailsPage](src/components/event/EventDetailsPage.tsx)               | Admin, Alumni             | Shows event details and permits eligible alumni to register or cancel.                         |
| `/alumni/notices`          | [NoticeListPage](src/components/notice/NoticeListPage.tsx)                  | Admin, Alumni             | Lists notices; alumni see published notices.                                                   |
| `/alumni/notices/:id`      | [NoticeDetailsPage](src/components/notice/NoticeDetailsPage.tsx)            | Admin, Alumni             | Shows a notice's content and publication metadata.                                             |
| `/alumni/account`          | [AlumniAccountPage](src/components/alumniProfile/AlumniAccountPage.tsx)     | Admin, Alumni             | Changes the authenticated user's password.                                                     |
| `/alumni/create`           | [AlumniFormPage](src/components/alumniProfile/AlumniFormPage.tsx)           | Admin, Alumni route group | Creates an alumni record. The interface is primarily intended for administrators.              |
| `/alumni/:id`              | [AlumniDetailsPage](src/components/alumniProfile/AlumniDetailsPage.tsx)     | Admin, Alumni             | Displays a selected alumni record.                                                             |
| `/alumni/:id/edit`         | [AlumniFormPage](src/components/alumniProfile/AlumniFormPage.tsx)           | Admin, Alumni             | Edits a selected alumni record.                                                                |

### Administrator screens

| Route               | Screen                                                                      | Purpose                                                                                                                            |
| ------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `/dashboard`        | [AdminDashboardPage](src/components/dashboard/AdminDashboardPage.tsx)       | Shows total, active, verified, mentor, pending, inactive, new-alumni, and event statistics, plus recent records and review queues. |
| `/alumni`           | [AlumniListPage](src/components/alumniProfile/AlumniListPage.tsx)           | Administrative alumni management table/grid with actions and CSV export.                                                           |
| `/events`           | [EventListPage](src/components/event/EventListPage.tsx)                     | Administrative event list with create and management actions.                                                                      |
| `/events/create`    | [EventFormPage](src/components/event/EventFormPage.tsx)                     | Creates an event.                                                                                                                  |
| `/events/:id`       | [EventDetailsPage](src/components/event/EventDetailsPage.tsx)               | Manages an event, registrations, capacity, and administrative actions.                                                             |
| `/events/:id/edit`  | [EventFormPage](src/components/event/EventFormPage.tsx)                     | Edits an event.                                                                                                                    |
| `/notices`          | [NoticeListPage](src/components/notice/NoticeListPage.tsx)                  | Lists all notices and provides administrative actions.                                                                             |
| `/notices/create`   | [NoticeFormPage](src/components/notice/NoticeFormPage.tsx)                  | Creates a notice as draft, published, or archived.                                                                                 |
| `/notices/:id`      | [NoticeDetailsPage](src/components/notice/NoticeDetailsPage.tsx)            | Displays a notice with administrative context.                                                                                     |
| `/notices/:id/edit` | [NoticeFormPage](src/components/notice/NoticeFormPage.tsx)                  | Edits a notice.                                                                                                                    |
| `/reports`          | [ReportsPage](src/components/report/ReportsPage.tsx)                        | Displays aggregate alumni statistics, charts, department data, and CSV export.                                                     |
| `/settings`         | [SettingsPage](src/components/settings/SettingsPage.tsx)                    | Edits institution name, contact information, address, and website.                                                                 |
| `/profile-setup`    | [ProfileSetupPage](src/components/alumniProfile/ProfileSetupPage.tsx)       | Legacy duplicate route for the profile setup screen.                                                                               |
| `/settings-privacy` | [SettingsPrivacyPage](src/components/alumniProfile/SettingsPrivacyPage.tsx) | Legacy duplicate route for privacy settings.                                                                                       |

### Implemented but not currently routed

[AlumniProfilePage](src/components/alumniProfile/AlumniProfilePage.tsx) is an older profile presentation with inline privacy switches. The current `/alumni/profile` route uses `AlumniDetailsPage` instead.

## 5. Shared Layout and UI Processes

[AppLayout](src/components/layout/AppLayout.tsx) wraps authenticated pages with a desktop sidebar, mobile navigation drawer, sticky header, and nested route outlet.

- The sidebar navigation is role-sensitive.
- The sidebar can collapse on desktop.
- Mobile users access navigation through a drawer.
- The header exposes the theme switch, profile popover, account links, and logout.
- `HeaderProfileDialog` provides profile, account/settings, and logout navigation.
- MUI theme state supports light and dark modes.
- Toasts communicate successful operations and errors.
- Common loading, empty, error, unauthorized, confirmation, pagination, form, avatar, status, and data-grid components standardize behavior across screens.

## 6. End-to-End Business Processes

### Login and session restoration

1. A user enters an identifier and password on the login screen.
2. The auth slice calls the configured auth service.
3. Successful authentication stores the user/session state and redirects by role.
4. On reload, `restoreSessionAsync` attempts to restore the session.
5. Logout clears the session and returns the user to the login screen.

The login page includes a password visibility toggle and remember-me control. The remember-me value is currently UI state only. The forgot-password control has no implemented recovery workflow. Identifier tabs change presentation, while the mock service accepts normalized username, email, or phone values.

### Alumni discovery and management

1. The list or directory screen loads alumni records through the alumni slice.
2. Search, filters, sorting, pagination, and page-size changes update the displayed records.
3. Users switch between table and card/grid presentations.
4. Administrators can open, edit, verify, activate/deactivate, delete, or export records.
5. The directory provides profile navigation and an administrator-only add action.

### Alumni creation and editing

The form supports personal identity, contact details, present/permanent addresses, academic data, employment, social links, mentor information, family members, education history, and profile photo upload. Present-address-to-permanent-address copying is supported. Yup validation runs before submission. New mock alumni records receive generated credentials and identifiers.

### Profile completion

[profileCompletion.ts](src/utils/profileCompletion.ts) calculates completion from required profile fields. The result is displayed on both dashboards and profile cards, with missing-field information used to guide the user toward profile setup.

### Profile details and administration

The details screen presents identity, academic, professional, contact, address, social, skills, and privacy-sensitive information. Owners and administrators can edit. Administrators can verify, activate, deactivate, print, and open an ID-card dialog. Address visibility is restricted based on ownership, administration role, and privacy settings.

### Privacy management

Users can change global profile visibility and section visibility for personal, contact, academic, job, social, family, and biography information. Legacy field-level controls also cover email, phone, address, company, and social links. The screen tracks unsaved changes and provides save/discard behavior.

### Event lifecycle

1. Administrators create an event with title, description, type, date, time, venue, location, organizer, registration deadline, capacity, and status.
2. Yup validation checks required fields, dates, enumerated values, and positive capacity.
3. Users browse upcoming, past, or all events and search the list.
4. An eligible alumni user registers if the event is open, before its deadline/date, and has available capacity.
5. The user can cancel registration where allowed.
6. Administrators view registration statistics and edit or delete events.

### Notice lifecycle

1. Administrators create a notice with title, content, date, category, and status.
2. Notices can be draft, published, or archived.
3. Administrators can publish/unpublish, edit, view, and delete notices.
4. Alumni users receive the published-notice view and can open notice details.

### Reporting and export

The reports screen aggregates gender, mentor, verification, and total-alumni metrics. It renders graduation-year bars, a location pie chart, and department percentages. CSV export is implemented through [csvExport.ts](src/utils/csvExport.ts) and browser download behavior. Alumni list data also supports CSV export.

### Institution settings

Administrators can edit institution branding/contact data, address, and website. Current settings are written to local storage. The screen contains a remaining demo-data reset handler, but its visible reset UI is commented out.

## 7. State and Data Architecture

The Redux store is configured in [store.ts](src/store/store.ts) with these slices:

- `auth`: user, role, authentication state, restoration, login, logout, errors, and password changes.
- `alumni`: records, selected record, search/filter/sort/pagination state, CRUD, verification, status, privacy, and dashboard aggregates.
- `events`: records, selected event, registrations, personal registrations, filtering, pagination, CRUD, and registration actions.
- `notices`: records, selected notice, filtering, pagination, CRUD, and publication state.
- `dashboard`: derived dashboard data and loading/error state.
- `ui`: sidebar, mobile drawer, theme, and toast state.

The service interfaces in `src/services/interfaces` separate UI/state code from implementations. [services/index.ts](src/services/index.ts) selects mock services unless `VITE_DATA_SOURCE` is set to `api`.

### Mock persistence

Mock authentication, alumni, event, and notice services seed data and persist changes through [localStorageService.ts](src/services/storage/localStorageService.ts). Keys are prefixed with `alumniconnect_`. This supports a usable browser-based demo without a backend.

### REST boundary

The API implementation uses Axios through [apiClient.ts](src/services/api/apiClient.ts). It supports a configurable base URL, bearer-token injection, and 401 cleanup. API modules cover authentication, alumni, events, and notices.

The current REST auth implementation returns `null` from `getSession()`, so REST-mode reload session restoration is not complete through the current interface.

## 8. Validation and Utilities

- `authValidation.ts`: login fields, password length, and confirmation.
- `alumniValidation.ts`: identity, contact, address, academic, URL, credential, family, and status rules.
- `eventValidation.ts`: required event fields, event type/status, date-related values, and positive integer capacity.
- `noticeValidation.ts`: title, content, date, category, and status.
- `dateUtils.ts`: date/time formatting, relative time, and upcoming-event checks.
- `generateId.ts`: UUID and domain identifier generation.
- `debounce.ts`: reusable debounce helper.
- `csvExport.ts`: browser CSV generation and download.
- `profileCompletion.ts`: profile completeness calculation.

## 9. Visual Assets and Configuration

- `public/image/logo.png`: application logo.
- `public/image/favicon.png`: favicon and event-image fallback.
- `public/image/logomain.jpg`: additional branding asset.
- `public/alumni/alumni data.pdf`: alumni reference/source document.
- Event seed data includes external Pexels image URLs.
- [appConfig.ts](src/config/appConfig.ts) contains institution branding and contact defaults.
- [theme.ts](src/store/theme.ts) defines the MUI light/dark palettes, typography, shape, and component overrides.
- Tailwind is configured, but the visible application is primarily implemented with MUI and Emotion.

## 10. Current Gaps and Risks

The following items are visible from the current implementation and should be addressed before treating the application as production-complete:

1. Forgot-password recovery is not implemented.
2. Remember-me does not change session persistence behavior.
3. Login identifier tabs change labels but do not represent separate validation or flows.
4. Event and notice search dispatches a search argument while the corresponding thunks read Redux state, which may prevent search text from being applied correctly.
5. Privacy settings submit newer section privacy data through a type escape, while the formal service contract primarily models legacy privacy fields.
6. Profile setup, alumni form, and the unused legacy profile page overlap, increasing maintenance and behavior drift risk.
7. Some routes and navigation links distinguish `/alumni` from `/alumni/directory` inconsistently.
8. Institution settings are written to local storage but are initialized from static configuration rather than clearly rehydrated from saved values.
9. Extended profile fields such as job experiences and some privacy data are not clearly persisted by every mock create/update path.
10. Updating an alumni record does not clearly synchronize changed login credentials with the mock credential store.
11. Several form integrations use `as any` or `as never`, reducing compile-time safety around form values.
12. The package scripts provide build, lint, and typecheck commands but no automated test script.
13. Some default configuration values still refer to placeholder institution data and should be aligned with the intended deployment institution.

## 11. Technology and Run Commands

The project is configured with these scripts:

```text
npm run dev        Start the Vite development server
npm run build      Build the production bundle
npm run preview    Preview the production bundle
npm run lint       Run ESLint
npm run typecheck  Run TypeScript without emitting files
```

## 12. Overall Assessment

Alumni Network is a substantial, coherent alumni-management portal rather than a static prototype. The main user journeys are represented end to end: authentication, role-based navigation, profile management, directory browsing, event registration, notice publication, reporting, and local persistence. The mock service layer makes the application demonstrable without a backend, while the service interfaces and REST modules establish a path toward API-backed deployment.

The highest-value next work is to consolidate duplicate profile flows, repair event/notice search wiring, complete privacy and extended-profile persistence, implement password recovery and remember-me semantics, rehydrate institution settings, and add focused automated tests for authentication, authorization, CRUD, privacy, and event-capacity rules.
