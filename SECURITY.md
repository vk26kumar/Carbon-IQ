# Security Policy

This document describes how security is handled in Carbon IQ: which versions
receive fixes, how to report a vulnerability, how the application protects
data, and which limitations are currently known. It is written so that a reader
with no prior knowledge of the project can understand the security position of
the software at the time of writing and act on it.

---

## 1. Supported Versions

Only the most recent release receives security fixes. Older versions should be
upgraded.

| Version | Supported |
| ------- | --------- |
| 1.0.1 (current, Android version code 3) | Yes |
| 1.0.0 and earlier                         | No  |

---

## 2. Reporting a Vulnerability

Please report security problems privately. Do not open a public GitHub issue,
pull request or discussion for a vulnerability, because that would expose the
problem to everyone before it can be fixed.

Send an email to:

- Vishal Kumar, vkumar26062003@gmail.com
- Subject line: `Carbon IQ Security Report`

If the repository has GitHub private vulnerability reporting enabled
(Security tab, "Report a vulnerability"), that channel may be used instead.

Please include:

1. A clear description of the problem and its possible impact.
2. The affected component (mobile app screen, Firestore data, web page, build or
   deployment workflow).
3. The application version, device and operating system.
4. Exact steps to reproduce the problem, and a proof of concept if available.
5. Your name or handle if you would like to be credited.

### Response process

| Stage                          | Target time |
| ------------------------------ | ----------- |
| Acknowledgement of the report  | Within 3 working days |
| Initial assessment and severity | Within 7 working days |
| Fix or mitigation for high and critical issues | Within 30 days where possible |

The reporter will be kept informed of progress. Once a fix is released, the
issue may be disclosed publicly, and the reporter will be credited unless they
prefer to remain anonymous. Please allow a reasonable time for a fix before any
public disclosure.

### Good faith research

Research carried out in good faith is welcome. While testing, please:

- use only your own test accounts and test Vendor IDs,
- do not read, change or delete data belonging to other vendors,
- do not perform denial-of-service testing or automated mass requests, and
- stop and report immediately if you encounter real user data.

---

## 3. Scope

In scope:

- The Carbon IQ mobile application source code in this repository.
- The data stored by the application in Google Firebase Cloud Firestore.
- The static pages in `public/` served through Firebase Hosting.
- The GitHub Actions workflows in `.github/workflows/`.

Out of scope:

- Vulnerabilities in Google Firebase, Expo, React Native, Android, iOS or other
  third-party platforms themselves. Please report those to the respective
  vendor.
- Social engineering, physical attacks, and attacks requiring a device that is
  already compromised.

---

## 4. Security Model

### 4.1 Data handled

The application collects the Vendor ID, name, mobile number and industry of a
vendor, together with the resource consumption figures that the vendor enters,
and the calculated results. It does not collect passwords, payment information,
location, contacts, photos or device identifiers. Only two Android permissions
are requested: `INTERNET` and `ACCESS_NETWORK_STATE`.

### 4.2 Storage and transport

- All data is stored in Google Firebase Cloud Firestore in the collections
  `vendors`, `formdata` and `results`.
- Communication between the application and Firebase uses HTTPS (TLS), provided
  by the Firebase SDK.
- Data at rest is encrypted by Google Cloud.
- The emission calculation runs on the device; no third-party analytics or
  advertising libraries are included.

### 4.3 Configuration and secrets

- The Firebase web configuration values (API key, project ID and so on) are read
  from `EXPO_PUBLIC_` environment variables in a local `.env` file that is
  excluded from Git by `.gitignore`.
- Firebase client configuration values are not secret by design: they are
  embedded in every built application and can be extracted from it. They only
  identify the Firebase project. The real protection of the data must come from
  Firestore security rules (see section 5).
- The Firebase service account key used for web deployment is stored only as the
  GitHub Actions secret `FIREBASE_SERVICE_ACCOUNT_WALLMART_FD89E` and must never
  be committed to the repository.
- Never commit `.env` files, service account JSON files, keystores or signing
  credentials. If one is committed by mistake, treat it as compromised: rotate
  or revoke it immediately, then remove it from the Git history.

### 4.4 Account deletion

The Delete Account screen removes every document with the given Vendor ID from
`vendors`, `formdata` and `results`. To prevent accidents, the user must enter
the Vendor ID, type the word `DELETE` exactly, and confirm a final warning.
Deletion is permanent and cannot be undone.

---

## 5. Known Limitations and Recommendations

The following weaknesses are known at the time of writing. They are listed so
that operators and future maintainers can make informed decisions.

1. No user authentication. A vendor is identified only by the Vendor ID that is
   typed in. Anyone who knows or guesses a Vendor ID can view the associated
   history in the analysis charts or delete the associated data.
   Recommendation: add Firebase Authentication (for example phone number
   verification, which fits the mobile number already collected), store the
   authenticated user ID on every document, and allow access only to the owner.

2. Firestore security rules are not version-controlled. Access control depends
   entirely on rules configured in the Firebase console. Recommendation: add a
   `firestore.rules` file to the repository, deploy it with the Firebase CLI,
   and never run production in "test mode" rules that allow everyone to read and
   write. Until authentication exists, rules should at least validate field
   types and sizes, and should restrict deletes as far as the design allows.

3. Industry comparison reads all results. The analysis screen queries every
   result of an industry from the client to draw the comparison chart. Only the
   normalized score is displayed, but the full documents are downloaded.
   Recommendation: provide aggregated values through a Cloud Function or a
   separate summary collection, so that vendors cannot read each other's raw
   data.

4. Limited input validation. Mobile numbers are checked for length only, and
   numeric fields are converted without range checks. Recommendation: validate
   formats and ranges on the client and enforce them in Firestore rules.

5. No rate limiting. Without authentication, the database could be filled with
   automated writes. Recommendation: enable Firebase App Check and add
   authentication.

---

## 6. Guidance for Contributors

- Keep dependencies current. Run `npm audit` regularly and upgrade the Expo SDK
  when security releases are published.
- Do not log personal data (names, mobile numbers) to the console in production
  builds.
- Do not add analytics, advertising or tracking libraries without updating the
  privacy policy in `app/privacyPolicy.tsx` and `public/privacy-policy.html`.
- Review every change that touches Firestore queries, the delete flow, or the
  deployment workflows with particular care.

---

## 7. Contact

Security contact: Vishal Kumar, vkumar26062003@gmail.com
Project repository: https://github.com/vk26kumar/Carbon-IQ
