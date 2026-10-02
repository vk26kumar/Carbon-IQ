# Carbon IQ

Carbon IQ is a mobile application that helps small and medium vendors measure,
understand and reduce the carbon emissions produced by their business
operations. A vendor registers, chooses an industry, enters the amount of
resources consumed during a reporting period (electricity, water, fuel,
chemicals, raw material and so on), and the application immediately returns an
emission score, a normalized score per unit of output, a star rating, a list of
resources that were used beyond the recommended limit, practical reduction tips,
carbon offset equivalents and a shareable PDF report.

The application is written in TypeScript with React Native and Expo, runs on
Android, iOS and the web, and stores its data in Google Firebase Cloud
Firestore. The user interface is available in six languages.

This document is written to be complete and self-contained. A reader who has
never seen the project, and who may be reading it many years after it was
written, should be able to understand what the project does, why it exists, how
every part of it works, how the numbers are calculated, and how to build and run
it.

---

## Table of Contents

1. [Project Summary](#1-project-summary)
2. [Purpose and Background](#2-purpose-and-background)
3. [Feature List](#3-feature-list)
4. [How the Application Is Used](#4-how-the-application-is-used)
5. [Screen Reference](#5-screen-reference)
6. [Emission Calculation Model](#6-emission-calculation-model)
7. [Carbon Offset Equivalents](#7-carbon-offset-equivalents)
8. [Data Model](#8-data-model)
9. [Technology Stack](#9-technology-stack)
10. [Repository Structure](#10-repository-structure)
11. [Installation and Local Development](#11-installation-and-local-development)
12. [Configuration and Environment Variables](#12-configuration-and-environment-variables)
13. [Building and Releasing](#13-building-and-releasing)
14. [Web Hosting and Continuous Deployment](#14-web-hosting-and-continuous-deployment)
15. [Localization](#15-localization)
16. [Privacy and Data Deletion](#16-privacy-and-data-deletion)
17. [Known Limitations](#17-known-limitations)
18. [Glossary](#18-glossary)
19. [Version History](#19-version-history)
20. [Author and Contact](#20-author-and-contact)
21. [License](#21-license)

---

## 1. Project Summary

| Item                  | Value                                                     |
| --------------------- | --------------------------------------------------------- |
| Name                  | Carbon IQ                                                 |
| Type                  | Cross-platform mobile application (Android, iOS, web)     |
| Primary audience      | Vendors and suppliers in production-oriented industries   |
| Application version   | 1.0.1 (Android version code 3)                            |
| Android package / iOS bundle | `com.carboniq.mobile`                              |
| Main languages        | TypeScript, JavaScript                                    |
| Framework             | React Native 0.81 on Expo SDK 54, Expo Router 6           |
| Data store            | Google Firebase Cloud Firestore                           |
| Supported UI languages | English, Hindi, Spanish, French, Chinese (Simplified), Arabic |
| Source repository     | https://github.com/vk26kumar/Carbon-IQ                    |
| Author                | Vishal Kumar (GitHub: vk26kumar)                          |
| License               | MIT (see the `LICENSE` file)                              |

---

## 2. Purpose and Background

Large retailers and manufacturers increasingly ask their suppliers to report the
environmental impact of the goods they supply. Small vendors such as a textile
workshop, a dairy farm or a small food processing unit usually do not have the
tools, staff or knowledge to produce such a report. Carbon IQ was created to fill
that gap with a tool that:

- requires no technical knowledge and no account password,
- asks only for figures a vendor already knows (for example the electricity bill
  in kilowatt-hours or the litres of diesel bought),
- returns an immediate, easy-to-read result rather than a spreadsheet,
- explains which resource is being overused and what can be done about it, and
- works in the vendor's own language.

The project was started in July 2025 and prepared for public release on the
Google Play Store in 2025 and 2026.

---

## 3. Feature List

- Language selection on the first screen, with six supported languages and
  automatic right-to-left layout for Arabic.
- Vendor registration with Vendor ID, name, 10-digit mobile number and industry.
- Eight selectable industries: Textile, Dairy, Agriculture, Manufacturing, Food
  Processing, Logistics, Electronics and Pharmaceuticals.
- An industry-specific input form that only asks for the fields relevant to the
  selected industry, with a progress indicator showing how many fields are
  filled.
- Instant calculation of:
  - the total emission score,
  - the normalized emission score (emission per unit of production),
  - a rating from 1 to 5 stars with a word label (Poor to Outstanding),
  - a compliance status (within limits or exceeding limits).
- Overuse detection: every resource is compared with a recommended allowance
  derived from production volume, and every resource above its allowance is
  listed with the allowed and the actual value.
- Industry-specific sustainability tips, translated into the selected language.
- A detailed analysis screen with three charts:
  - a pie chart of the resources entered in the current report,
  - a line chart of the vendor's normalized score over time,
  - a bar chart comparing normalized scores of all vendors in the same industry.
- Carbon offset equivalents: trees to plant, car kilometres avoided, solar
  energy needed, flight hours, LED bulb replacements and meat-free meals.
- Generation of a formatted PDF report that can be saved or shared through the
  device's standard share sheet.
- An in-app privacy policy and an in-app account deletion screen that removes
  all records belonging to a Vendor ID.
- Public web pages (privacy policy and account deletion instructions) hosted on
  Firebase Hosting, as required by the Google Play Store.

---

## 4. How the Application Is Used

The normal journey through the application is a straight line:

```
Language selection  ->  Home  ->  Vendor registration  ->  Resource input form
        ->  Results  ->  Emission breakdown  ->  (Detailed analysis |
            Carbon offset  ->  PDF report | PDF report | Summary message)
```

Step by step:

1. The vendor opens the application and chooses a language.
2. The Home screen explains what the toolkit does and how it works. From Home
   the vendor can also open the Privacy Policy or the Delete Account screen.
3. On the Vendor Registration screen the vendor enters a Vendor ID (any
   identifier the vendor chooses or has been given, for example `WAL12345`), a
   name, a 10-digit mobile number and the industry. The record is saved to the
   `vendors` collection.
4. On the Resource Input Form the vendor enters the consumption figures for the
   reporting period. All fields are required. The raw input is saved to the
   `formdata` collection.
5. The Results screen calculates the scores (see section 6), shows them with an
   animated counter and star rating, and saves the result to the `results`
   collection.
6. The Emission Breakdown screen lists every overused resource with the allowed
   amount, the used amount and the percentage of overuse, followed by the
   sustainability tips. From here the vendor can open the Detailed Analysis, the
   Carbon Offset calculator, the PDF Report or the final summary message.

---

## 5. Screen Reference

Every screen is a file in the `app/` directory. Expo Router turns each file name
into a route of the same name.

| File                      | Route                | What it does |
| ------------------------- | -------------------- | ------------ |
| `app/_layout.tsx`         | (layout)             | Root navigation stack. Hides headers, sets the light green background and the slide-from-right transition, and registers every screen. |
| `app/index.tsx`           | `/`                  | Landing screen with logo and language picker. Switching to Arabic enables right-to-left layout. |
| `app/home.tsx`            | `/home`              | Introduction, feature cards, "how it works" steps, and links to registration, privacy policy and account deletion. |
| `app/onboard.tsx`         | `/onboard`           | Vendor registration form. Validates that all fields are filled and that the mobile number has exactly 10 digits, then writes to `vendors`. |
| `app/form.tsx`            | `/form`              | Industry-specific resource input form with progress bar. Writes to `formdata`. |
| `app/results.tsx`         | `/results`           | Runs the emission calculation, shows score, normalized score, rating and status, and writes to `results`. |
| `app/emissionBreakdown.tsx` | `/emissionBreakdown` | Lists overused resources and tips, and links to the follow-up screens. |
| `app/detailAnalysis.tsx`  | `/detailAnalysis`    | Pie, line and bar charts. Reads the vendor's history and the industry's results from `results`. |
| `app/carbonOffset.tsx`    | `/carbonOffset`      | Converts the emission score into everyday offset equivalents. |
| `app/pdfReport.tsx`       | `/pdfReport`         | Shows a preview of the report contents and exports the PDF. |
| `app/message.tsx`         | `/message`           | Closing summary message with a button back to Home. |
| `app/privacyPolicy.tsx`   | `/privacyPolicy`     | In-app privacy policy. |
| `app/deleteAccount.tsx`   | `/deleteAccount`     | Permanently deletes every record for a given Vendor ID after the user types `DELETE` and confirms twice. |

Shared code lives in `utils/`:

| File                         | Purpose |
| ---------------------------- | ------- |
| `utils/firebaseConfig.js`    | Initializes the Firebase app once (safe during hot reload) and exports the Firestore instance `db`. |
| `utils/i18n.tsx`             | All user interface text in six languages, plus the per-industry tip lists. |
| `utils/generatePDFReport.ts` | Builds the HTML report, converts it to PDF with `expo-print`, and opens the share sheet with `expo-sharing`. |

Data is passed between screens as route parameters. Lists (overused resources
and tips) are joined with the separator `||`, and the raw form values are passed
as a JSON string.

---

## 6. Emission Calculation Model

The calculation is performed entirely on the device in `app/results.tsx`. It is
a simple, transparent, weighted-sum model. Every input value is converted to a
number; an empty or invalid value counts as zero.

Important: the coefficients and allowances below are the built-in benchmark
values chosen for this application. They are intended to give vendors a
consistent, comparable indicator and a direction for improvement. They are not
official national emission factors and the result must not be presented as a
certified carbon audit.

### 6.1 Terms

- Total emission score: the weighted sum of all resource inputs. The PDF report
  labels this value in kilograms of CO2 equivalent.
- Normalized score: the total emission score divided by the production quantity
  (metres of fabric, litres of milk, kilograms of crop, or units produced). It
  makes vendors of different sizes comparable. If the production quantity is
  zero, the normalized score is zero.
- Allowance: the recommended maximum amount of a resource for the reported
  production quantity. A resource is "overused" when the amount entered is
  strictly greater than its allowance.
- Reference normalized value: an internal benchmark per industry (Textile 0.6,
  Dairy 0.8, Agriculture 0.5, all others 1.0) kept for comparison purposes.

### 6.2 Textile

Inputs: fabric produced (m), electricity (kWh), water (L), chemicals (kg),
diesel (L).

```
total      = fabric x 0.2 + electricity x 0.7 + water x 0.005
           + chemicals x 0.2 + diesel x 1.2
normalized = total / fabric
```

| Resource    | Allowance       |
| ----------- | --------------- |
| Electricity | fabric x 0.3    |
| Water       | fabric x 50     |
| Chemicals   | fabric x 0.1    |
| Diesel      | fabric x 0.08   |

### 6.3 Dairy

Inputs: milk produced (L), number of cows, electricity (kWh), fodder (kg),
diesel (L).

```
total      = milk x 0.1 + cows x 5 + electricity x 0.5
           + fodder x 0.3 + diesel x 1.5
normalized = total / milk
```

| Resource    | Allowance     |
| ----------- | ------------- |
| Electricity | milk x 0.25   |
| Fodder      | milk x 0.3    |
| Diesel      | milk x 0.05   |

### 6.4 Agriculture

Inputs: land area (acres), fertilizer (kg), electricity (kWh), diesel (L), crop
yield (kg).

```
total      = fertilizer x 0.6 + electricity x 0.3 + diesel x 2
normalized = total / crop yield
```

| Resource    | Allowance     |
| ----------- | ------------- |
| Fertilizer  | land x 0.5    |
| Electricity | land x 1.0    |
| Diesel      | land x 0.1    |

### 6.5 Manufacturing, Food Processing, Logistics, Electronics, Pharmaceuticals

These five industries share the same input fields and the same formula.

Inputs: units produced, electricity (kWh), water (L), chemicals (kg), diesel (L).

```
total      = electricity x 0.6 + water x 0.05 + chemicals x 0.3 + diesel x 1.8
normalized = total / units produced
```

| Resource    | Allowance      |
| ----------- | -------------- |
| Electricity | units x 0.4    |
| Water       | units x 10     |
| Chemicals   | units x 0.05   |
| Diesel      | units x 0.1    |

The sustainability tips shown for these industries are the manufacturing tips.

### 6.6 Rating

The star rating depends only on the normalized score. A lower score is better.

| Normalized score      | Stars | Label        |
| --------------------- | ----- | ------------ |
| less than 0.3         | 5     | Outstanding  |
| 0.3 to less than 0.6  | 4     | Excellent    |
| 0.6 to less than 0.9  | 3     | Good         |
| 0.9 to less than 1.2  | 2     | Average      |
| 1.2 or more           | 1     | Poor         |

### 6.7 Status

- If at least one resource is overused, the status is "Your carbon usage
  exceeds standard limits."
- Otherwise the status is "Your carbon usage is within standard limits."

The total and normalized scores are rounded to two decimal places before they
are displayed and stored.

### 6.8 Worked Example

A textile vendor produces 1,000 m of fabric and uses 400 kWh of electricity,
40,000 L of water, 80 kg of chemicals and 100 L of diesel.

```
total      = 1000 x 0.2 + 400 x 0.7 + 40000 x 0.005 + 80 x 0.2 + 100 x 1.2
           = 200 + 280 + 200 + 16 + 120
           = 816
normalized = 816 / 1000 = 0.82
```

Allowances: electricity 300, water 50,000, chemicals 100, diesel 80. Electricity
(400 > 300) and diesel (100 > 80) are overused. The normalized score 0.82 gives
3 stars ("Good"), and the status is "exceeds standard limits".

---

## 7. Carbon Offset Equivalents

The Carbon Offset screen (`app/carbonOffset.tsx`) and the PDF report
(`utils/generatePDFReport.ts`) translate the total emission score `s` (treated as
kilograms of CO2; negative values are treated as zero) into everyday terms:

| Equivalent             | Formula                    | Assumption behind the factor |
| ---------------------- | -------------------------- | ---------------------------- |
| Trees to plant         | ceil(s / 21)               | One tree absorbs about 21 kg of CO2 per year |
| Car kilometres avoided | round(s / 0.21)            | A petrol car emits about 0.21 kg of CO2 per km |
| Solar energy needed    | s / 0.048 / 1000, in MWh   | About 0.048 kg of CO2 per kWh of solar generation |
| Flight hours offset    | s / 90, one decimal        | About 90 kg of CO2 per flight hour per passenger |
| LED bulb replacements  | ceil(s / 10)               | About 10 kg of CO2 saved per bulb per year |
| Meat-free meals        | round(s / 0.5)             | About 0.5 kg of CO2 saved per meal |

The PDF report includes the first four of these.

---

## 8. Data Model

All data is stored in Google Firebase Cloud Firestore in three top-level
collections. Documents are created with automatically generated identifiers and
are linked to each other through the `vendorId` field. Dates are stored as ISO
8601 text, for example `2026-01-15T10:30:00.000Z`.

### 8.1 Collection `vendors`

Written by the registration screen. One document per registration.

| Field       | Type   | Description |
| ----------- | ------ | ----------- |
| `vendorId`  | string | Identifier chosen or given to the vendor |
| `name`      | string | Vendor name |
| `mobile`    | string | 10-digit mobile number |
| `industry`  | string | Industry key, for example `textile` |
| `createdAt` | string | ISO 8601 creation time |

### 8.2 Collection `formdata`

Written by the input form. One document per submitted report.

| Field        | Type   | Description |
| ------------ | ------ | ----------- |
| `vendorId`   | string | Vendor identifier |
| `industry`   | string | Industry key |
| (input keys) | string | One field per input, for example `electricity_used`, `water_used` |
| `timestamp`  | string | ISO 8601 submission time |

### 8.3 Collection `results`

Written by the results screen. One document per calculation. This collection
feeds the trend and industry comparison charts.

| Field        | Type          | Description |
| ------------ | ------------- | ----------- |
| `vendorId`   | string        | Vendor identifier |
| `industry`   | string        | Industry key |
| `formData`   | map           | The input values used for the calculation |
| `score`      | number        | Total emission score |
| `normalized` | number        | Normalized score |
| `rating`     | string        | Rating text, for example `Good (3/5)` |
| `status`     | string        | Compliance status text |
| `tips`       | array         | Currently stored empty |
| `exceeded`   | array of string | Overused resources with allowed and used values |
| `createdAt`  | string        | ISO 8601 calculation time |

### 8.4 Input field keys

| Key               | Meaning                 | Unit   | Industries |
| ----------------- | ----------------------- | ------ | ---------- |
| `fabric_produced` | Fabric produced         | metres | Textile |
| `milk_produced`   | Milk produced           | litres | Dairy |
| `cows`            | Number of cows          | count  | Dairy |
| `fodder_used`     | Fodder used             | kg     | Dairy |
| `land_area`       | Land under cultivation  | acres  | Agriculture |
| `fertilizer_used` | Fertilizer used         | kg     | Agriculture |
| `crop_yield`      | Crop yield              | kg     | Agriculture |
| `units_produced`  | Units produced          | count  | Manufacturing and the four related industries |
| `electricity_used`| Electricity consumed    | kWh    | All |
| `water_used`      | Water consumed          | litres | Textile, Manufacturing group |
| `chemicals_used`  | Chemicals used          | kg     | Textile, Manufacturing group |
| `diesel_used`     | Diesel consumed         | litres | All |

---

## 9. Technology Stack

| Area              | Technology |
| ----------------- | ---------- |
| Language          | TypeScript (strict mode) and JavaScript |
| UI framework      | React 19.1 and React Native 0.81 |
| Platform tooling  | Expo SDK 54, Expo Application Services (EAS) |
| Navigation        | Expo Router 6 (file-based routing on top of React Navigation 7) |
| Database          | Firebase JavaScript SDK 11, Cloud Firestore |
| Charts            | `react-native-chart-kit` with `react-native-svg` |
| PDF               | `expo-print` (HTML to PDF) and `expo-sharing` (share sheet) |
| Localization      | `i18n-js` 3 and `expo-localization` |
| Visual effects    | `expo-linear-gradient`, React Native `Animated` API |
| Icons             | `@expo/vector-icons` (Ionicons) |
| Code quality      | ESLint 9 with `eslint-config-expo` |
| Web hosting       | Firebase Hosting, deployed with GitHub Actions |

---

## 10. Repository Structure

```
Carbon-IQ/
|-- app/                      Screens (one file per route, see section 5)
|-- assets/
|   |-- fonts/                SpaceMono font
|   `-- images/               App icon, adaptive icon, splash, logo, favicon
|-- utils/
|   |-- firebaseConfig.js     Firebase initialization
|   |-- generatePDFReport.ts  PDF report builder
|   `-- i18n.tsx              Translations and tips
|-- public/                   Static site served by Firebase Hosting
|   |-- index.html            Landing page
|   |-- privacy-policy.html   Public privacy policy
|   `-- delete-account.html   Public account deletion instructions
|-- web/index.html            Default Firebase Hosting placeholder page
|-- index.html                Default Firebase Hosting placeholder page
|-- .github/workflows/        Firebase Hosting deployment workflows
|-- app.config.js             Expo application configuration
|-- eas.json                  EAS build profiles
|-- firebase.json             Firebase Hosting configuration
|-- .firebaserc               Firebase project alias
|-- eslint.config.js          ESLint configuration
|-- tsconfig.json             TypeScript configuration (alias "@/" = project root)
|-- package.json              Dependencies and scripts
|-- README.md                 This document
|-- SECURITY.md               Security policy
`-- LICENSE                   License text
```

---

## 11. Installation and Local Development

### 11.1 Requirements

- Node.js 20 LTS or newer, with npm.
- Git.
- For a physical device: the Expo Go application, or a development build.
- For emulators: Android Studio (Android) or Xcode on macOS (iOS).
- A Google Firebase project with Cloud Firestore enabled.

### 11.2 Steps

```bash
git clone https://github.com/vk26kumar/Carbon-IQ.git
cd Carbon-IQ
npm install
```

Create a file named `.env` in the project root with your Firebase values (see
section 12), then start the development server:

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `a` for Android, `i` for iOS or `w` for
web.

### 11.3 Scripts

| Command           | Action |
| ----------------- | ------ |
| `npm start`       | Start the Expo development server |
| `npm run android` | Start and open on Android |
| `npm run ios`     | Start and open on iOS |
| `npm run web`     | Start and open in a web browser |
| `npm run lint`    | Run ESLint |

---

## 12. Configuration and Environment Variables

`app.config.js` reads the Firebase settings from environment variables (loaded
from `.env` through `dotenv`) and places them in `expo.extra`.
`utils/firebaseConfig.js` reads them from there at run time.

| Variable                                  | Firebase setting |
| ----------------------------------------- | ---------------- |
| `EXPO_PUBLIC_FIREBASE_API_KEY`            | apiKey |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`        | authDomain |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID`         | projectId |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`     | storageBucket |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`| messagingSenderId |
| `EXPO_PUBLIC_FIREBASE_APP_ID`             | appId |
| `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`     | measurementId |

Example `.env`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=000000000000
EXPO_PUBLIC_FIREBASE_APP_ID=1:000000000000:android:0000000000000000
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

The `.env` file is listed in `.gitignore` and must never be committed. For EAS
cloud builds, define the same variables as EAS environment variables or secrets.

Other notable settings in `app.config.js`:

- Expo owner `vk26_vishal`, slug `carbon-iq`, EAS project ID
  `e68f2e29-be84-4881-99aa-5456225b345f`.
- Portrait orientation only; tablets supported on iOS.
- Android: target SDK 35, minimum SDK 24 (Android 7.0), permissions limited to
  `INTERNET` and `ACCESS_NETWORK_STATE`.

---

## 13. Building and Releasing

Builds are produced with Expo Application Services. Install the command line
tool and sign in first:

```bash
npm install -g eas-cli
eas login
```

| Profile   | Command                                      | Output |
| --------- | -------------------------------------------- | ------ |
| `preview` | `eas build --profile preview --platform android` | Installable APK for internal testing |
| `release` | `eas build --profile release --platform android` | Android App Bundle (AAB) for the Play Store |

Submit a store build with `eas submit --platform android`.

Before every store release, increase `version` and `android.versionCode` in
`app.config.js`. The Play Store rejects a version code that has already been
uploaded.

---

## 14. Web Hosting and Continuous Deployment

The `public/` directory is published with Firebase Hosting to the Firebase
project aliased in `.firebaserc`. All paths are rewritten to `index.html`. These
pages provide the public privacy policy and account deletion URLs required by
the Google Play Store.

Two GitHub Actions workflows in `.github/workflows/` handle deployment:

- `firebase-hosting-merge.yml`: on every push to `main`, deploys to the live
  site.
- `firebase-hosting-pull-request.yml`: on every pull request from the same
  repository, deploys a temporary preview channel and comments the link.

Both require the repository secret `FIREBASE_SERVICE_ACCOUNT_WALLMART_FD89E`,
which holds the Firebase service account key.

Manual deployment: `npm install -g firebase-tools`, `firebase login`, then
`firebase deploy --only hosting`.

---

## 15. Localization

| Code | Language              | Direction     |
| ---- | --------------------- | ------------- |
| `en` | English               | Left to right |
| `hi` | Hindi                 | Left to right |
| `es` | Spanish               | Left to right |
| `fr` | French                | Left to right |
| `zh` | Chinese (Simplified)  | Left to right |
| `ar` | Arabic                | Right to left |

All strings live in `utils/i18n.tsx`, grouped by language code. The selected
code is passed to every screen as the `lang` route parameter. To add a language,
copy the complete `en` block, give it the new language code, translate every
value, and add the language to the list in `app/index.tsx`.

Note for maintainers: the results screens decide whether to show the warning
colour by checking for the warning symbol at the start of the translated
`status_overuse` text. Every translation of `status_overuse` must keep that
leading symbol, and `status_within` must not contain it.

---

## 16. Privacy and Data Deletion

- Data collected: Vendor ID, name, mobile number, industry, and the resource
  figures entered.
- Use: only for calculating scores, giving recommendations and showing
  analytics. No advertising or third-party analytics libraries are included.
- Storage: Google Firebase Cloud Firestore.
- Deletion: in the app, open Home, choose Delete Account, enter the Vendor ID,
  type `DELETE` and confirm. All documents with that Vendor ID in `vendors`,
  `formdata` and `results` are permanently removed. Deletion can also be
  requested by email (section 20).
- The full policy is in `app/privacyPolicy.tsx` and `public/privacy-policy.html`.

See `SECURITY.md` for the security model and its limitations.

---

## 17. Known Limitations

These are recorded honestly so that future maintainers know where to start.

1. There is no user authentication. A vendor is identified only by the Vendor ID
   typed in, so anyone who knows a Vendor ID can view its charts or delete its
   data. See `SECURITY.md`.
2. Firestore security rules are not stored in this repository and must be
   configured in the Firebase console.
3. The emission coefficients are fixed benchmark values in the source code, not
   certified emission factors, and are not adjustable by region or year.
4. Five industries share the general manufacturing formula and tips.
5. Registering twice with the same Vendor ID creates a second `vendors`
   document rather than updating the first.
6. A `download_csv` text exists in the translations, but CSV export is not
   implemented; reports are exported as PDF only.
7. Some alert messages are written in English only.
8. The charts in the detailed analysis read all results of an industry from the
   client, which will become slow as the data grows.
9. There are no automated tests.

---

## 18. Glossary

| Term              | Meaning |
| ----------------- | ------- |
| CO2               | Carbon dioxide, the main greenhouse gas produced by burning fuel. |
| CO2 equivalent    | A common unit expressing the warming effect of different greenhouse gases as an amount of CO2. |
| Carbon footprint  | The total greenhouse gas emissions caused by an activity or organisation. |
| Carbon offset     | An action that removes or avoids emissions to balance emissions made elsewhere. |
| Normalized score  | Emissions divided by production output; allows fair comparison of different sizes of business. |
| Vendor            | A business that supplies goods or services to another business. |
| kWh               | Kilowatt-hour, the unit of electrical energy on an electricity bill. |
| MWh               | Megawatt-hour, 1,000 kWh. |
| Expo              | A toolkit and service for building React Native applications. |
| EAS               | Expo Application Services, Expo's cloud build and submission service. |
| Firestore         | Google's cloud document database, part of Firebase. |
| APK / AAB         | Android installable package / Android App Bundle uploaded to the Play Store. |
| RTL               | Right-to-left text direction, used for Arabic. |

---

## 19. Version History

| Version | Date      | Notes |
| ------- | --------- | ----- |
| 0.x     | July 2025 | Initial frontend: language selection, registration, input form, results. |
| 1.0.0   | 2025      | Charts, carbon offset, PDF report, redesigned interface, Firebase environment configuration. |
| 1.0.1   | 2026      | Play Store readiness: account deletion, privacy policy screens and web pages, target SDK 35, version code 3. |

The complete history is available in the Git log of the repository.

---

## 20. Author and Contact

Carbon IQ was designed and developed by Vishal Kumar.

- GitHub: https://github.com/vk26kumar
- Email: vkumar26062003@gmail.com

Bug reports and feature requests can be opened as issues on the GitHub
repository. Security issues must be reported privately as described in
`SECURITY.md`.

---

## 21. License

Carbon IQ is released under the MIT License. The full text is in the `LICENSE`
file in the root of this repository. In short, anyone may use, copy, modify and
distribute the software, provided the copyright notice and license text are
included, and the software is provided without any warranty.

Copyright (c) 2025-2026 Vishal Kumar.
