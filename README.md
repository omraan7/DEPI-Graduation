# PhysioHome 🏥

Professional Physical Therapy at Home — Full-stack React app.



## Project Structure

```
src/
├── main.jsx                    ← Entry + BrowserRouter
├── App.jsx                     ← Renders AppRouter
├── index.css                   ← Global styles + CSS variables
│
├── router/
│   └── index.jsx               ← All routes (public / patient / doctor)
│
├── layouts/
│   ├── PublicLayout.jsx        ← Landing navbar + footer
│   ├── PatientLayout.jsx       ← Bottom navbar shell
│   └── DoctorLayout.jsx        ← Sidebar shell
│
├── components/ui/
│   ├── Button.jsx              ← Reusable button (variants + sizes)
│   ├── Card.jsx                ← Reusable card with hover
│   ├── Badge.jsx               ← Status / label badges
│   └── Avatar.jsx              ← Initials avatar
│
├── data/
│   └── mockData.js             ← Doctors, patients, exercises, statuses
│
├── pages/
│   ├── Landing.jsx             ← PhysioHome landing page
│   ├── AuthSelect.jsx          ← Choose patient or doctor role
│   │
│   ├── patient/
│   │   ├── ChatOnboarding.jsx  ← AI chat → injury detection
│   │   ├── PainMap.jsx         ← Interactive body map (front/back)
│   │   ├── DoctorRecommend.jsx ← Doctor list filtered by injury
│   │   ├── DoctorProfilePage.jsx ← Doctor profile + booking
│   │   ├── PatientHome.jsx     ← Patient dashboard
│   │   ├── PatientProfile.jsx  ← Profile + exercise history
│   │   ├── MessagesPage.jsx    ← Chat with doctor
│   │   ├── AlertsPage.jsx      ← Notifications
│   │   └── TrackerPage.jsx     ← Full-screen camera tracker
│   │
│   └── doctor/
│       ├── DoctorDashboard.jsx ← Stats + patient table
│       ├── PatientsList.jsx    ← Searchable patient list
│       ├── PatientDetail.jsx   ← Patient profile + notes + history
│       ├── DoctorMessages.jsx  ← Multi-patient chat
│       ├── DoctorAnalytics.jsx ← Charts + outcomes
│       └── DoctorSettings.jsx  ← Profile + notification settings
```

## User Flows

### Patient Flow
```
Landing → /auth (choose Patient)
  → /patient/chat        (describe pain in AI chat)
  → /patient/pain-map    (click body regions)
  → /patient/doctors     (filtered doctor list)
  → /patient/doctor/:id  (book appointment)
  → /patient/home        (dashboard)
  → /patient/tracker     (exercise with camera)
  → /patient/messages    (chat with doctor)
```

### Doctor Flow
```
Landing → /auth (choose Doctor)
  → /doctor/dashboard    (overview)
  → /doctor/patients     (all patients)
  → /doctor/patient/:id  (patient detail + assign exercises)
  → /doctor/messages     (chat with patients)
  → /doctor/analytics    (charts)
  → /doctor/settings     (profile)
```

## Tech Stack
- React 18 + React Router v6
- react-icons (all icons)
- MediaPipe Pose (camera tracking)
- Vite

## Demo Credentials
- Doctor: /auth → "I'm a Therapist" → goes to dashboard
- Patient: /auth → "I'm a Patient" → starts chat flow
