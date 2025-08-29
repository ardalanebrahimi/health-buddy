📄 Product Requirement Document (PRD)

Version 7 – Doctor Portal & SaaS Expansion

1. Objective

Transform the personal health companion into a multi-user platform with a doctor portal.
This enables doctors/nutritionists/therapists to monitor patients, assign personalized plans, track adherence, and provide feedback directly in the app.

The goal: evolve from self-use + companion → professionalized digital health ecosystem.

2. Target Users

Primary: Patients/users who want structured health tracking + doctor oversight.

Secondary: Doctors, nutritionists, therapists who use the portal to manage patients.

Tertiary (admin): Platform operator (you) managing subscriptions, data, and access.

3. Core Features (V7 Scope)
   3.1 Multi-User Support

Secure account creation & login (email/OAuth).

Roles: user/patient, doctor, admin.

Multi-device sync (mobile + web).

3.2 Doctor Portal (Web-first)

Patient Dashboard:

Overview of assigned patients.

Alerts for drift (non-adherence, abnormal logs).

Patient Profile:

Nutrition, training, sleep, stress, pain, biometrics.

Insights & correlations (from V3–V6).

Plan Assignment:

Doctors create/update plans (nutrition, training, sleep goals).

Plans auto-sync to user app.

Messaging/Notes:

Secure text-based notes or feedback.

Future: teleconsults/video.

3.3 Patient App (Upgraded)

Doctor Plan Integration:

Plans now sync automatically when updated by doctor.

Adherence Reports:

Accessible to user + shared with doctor.

Communication:

User can message doctor via app (structured Q&A).

3.4 SaaS & Business Layer

Subscription System:

Free tier (self-logging only).

Paid tier (doctor oversight, advanced features).

Doctor accounts: monthly subscription or per-patient pricing.

Admin Dashboard: manage users, doctors, billing.

3.5 Data Security & Privacy

GDPR/HIPAA-compliant architecture.

User owns their data → must explicitly allow sharing with doctor.

Audit logs of data access.

4. Data Model (Extended)

UserAccount: roles, permissions.

DoctorAccount: assigned patients, plans.

PlanEntity (V4) extended: owner = doctor or patient.

MessageEntity: doctor ↔ patient communications.

SubscriptionEntity: billing tier, status.

5. User Flow
   Patient

Logs data as in V1–V6.

Doctor plan syncs automatically to app.

Sees adherence score & messages from doctor.

Can send questions/updates to doctor.

Doctor

Logs into portal.

Sees patient list with adherence & alerts.

Adjusts plan for patient → auto-updates in app.

Sends feedback or notes.

6. Tech & Architecture Notes

Backend:

Add /auth (multi-user, role-based).

Add /doctor, /admin modules.

Add /plans multi-owner support.

Add /messages module.

Frontend:

Patient app: extend companion to include doctor-linked content.

Doctor portal (web-first): Angular dashboard with patient lists, plan management.

Admin portal: manage subscriptions, billing.

APIs:

POST /auth/signup

POST /plans/assign (doctor → patient)

GET /patients/:id/summary

POST /messages

GET /messages

Billing: Stripe or Paddle integration.

7. Success Metrics (V7)

90% of doctor plan updates sync correctly to patient app within 1 hour.

Doctors can monitor at least 20 patients simultaneously without performance issues.

≥70% of patients respond to doctor-assigned plans weekly.

Secure role-based access passes GDPR/HIPAA audit checks.

8. Out of Scope (Future R&D)

Predictive ML diagnostics.

AI-generated plans (doctor-augmented).

Large-scale marketplace of doctors.

Wearable auto-integration for clinics.

✅ Summary

Version 7 is the professionalization layer: multi-user support, doctor portal, adherence dashboards, and SaaS monetization. It completes the evolution from personal self-coach → doctor-assisted companion → scalable health platform.
