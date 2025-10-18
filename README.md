# MemoryMate

Assistive memory companion for people who need gentle, structured reminders. MemoryMate lets families store **faces**, **facts**, **to‑dos**, **medications**, and **emergency contacts**, then practice recall with friendly drills and optional notifications.

> README generated on 2025-10-18. Tailor secrets and environment variables before publishing.

---

##  Features

- **Secure sign‑in** via Google OAuth client with optional email/password fallback
- **Faces** photo, name, and description cards persisted to `localStorage`
- **Facts** category → fact cards with edit and delete controls
- **Practice** randomized non‑repeating sessions mixing user‑added truths with preloaded distractors
- **Practice Reminders** schedule weekly reminders with EmailJS and optional server‑side email via SendGrid
- **To‑Do** due time completion toggle and reminders
- **Medications** name dose taken checkbox and daily review
- **AI Assistant (stub)** placeholder for LLM‑powered help using @google/generative-ai
- **Emergency Contact** fast access to key contacts
- **Responsive UI** with Tailwind CSS and a simple navbar layout

---

##  Architecture

- **Frontend** React 18 (Create React App) + Tailwind CSS
- **Data storage** browser `localStorage` for primary entities
- **Reminders**
  - Client EmailJS from the Practice Reminder page
  - Server (optional) Express + SendGrid + node-cron for timed emails
- **Auth** @react-oauth/google (Google OAuth sign‑in token on client)
- **Routing** react-router-dom
- **APIs** placeholder `src/services/api.js` for future backend integration

```
Frontend (React) ── localStorage
   │
   ├─ Practice Reminder → EmailJS (client)
   └─ Optional server (Express) → SendGrid (cron email)
```

---

## 📂 Project Structure

```
MemoryMate/
📂 public/
   📄 Face.png
   📄 chat.png
   📄 delete.png
   📄 edit.png
   📄 facts.png
   📄 favicon.ico
   📄 favicon.png
   📄 home.png
   📄 index.html
   📄 list.png
   📄 logo192.png
   📄 logo512.png
   📄 manifest.json
   📄 medication.png
   📄 more.png
   📄 practice.png
   📄 robots.txt
   📄 schedule.png
📂 src/
   📂 AuthCont/
   📂 components/
      📄 FactCard.js
      📄 Footer.js
      📄 Loading.js
      📄 MedicationItem.js
      📄 Navbar.js
      📄 ToDoItem.js
   📂 pages/
      📄 AIChatPage.css
      📄 AIChatPage.js
      📄 AiAssistantPage.js
      📄 EmergencyContactPage.js
      📄 FacesPage.css
      📄 FacesPage.js
      📄 FactsPage.css
      📄 FactsPage.js
      📄 HomePage.css
      📄 HomePage.js
      📄 MedicationsPage.css
      📄 MedicationsPage.js
      📄 PracticePage.js
      📄 PracticeReminderPage.css
      📄 PracticeReminderPage.js
      📄 SchedulePage.js
      📄 SignupPage.js
      📄 ToDoPage.css
      📄 ToDoPage.js
      📄 schedule.png
   📂 services/
      📄 api.js
   📂 utils/
      📄 reminders.js
   📄 App.css
   📄 App.js
   📄 App.test.js
   📄 AuthContext.js
   📄 GlobalState.js
   📄 dataUtils.js
   📄 index.css
   📄 index.js
   📄 logo.svg
   📄 postcss.config.js
   📄 reportWebVitals.js
   📄 server.js
   📄 setupTests.js
📄 .gitignore
📄 README.md
📄 package-lock.json
📄 package.json
📄 tailwind.config.js
```

Key files and folders

- `src/App.js` Google OAuth provider routes and protected-route wrapper
- `src/pages/*` views for Faces Facts Practice PracticeReminder ToDo Medications AI Signup Emergency
- `src/components/*` reusable UI pieces `Navbar` `FactCard` `MedicationItem` `ToDoItem` `Loading` `Footer`
- `src/utils/reminders.js` in‑browser reminder scheduler helpers
- `src/services/api.js` placeholder API helpers
- `src/server.js` optional Express+SendGrid cron email service
- `tailwind.config.js` `src/postcss.config.js` Tailwind setup
- `public/*` static assets and icons

---

##  Tech Stack

- React 18 react-router-dom
- Tailwind CSS with PostCSS and Autoprefixer
- @react-oauth/google for Google sign‑in
- emailjs-com for client reminder emails
- Express @sendgrid/mail node-cron cors for optional server emails
- @google/generative-ai dependency present (AI assistant stub)
- Testing `@testing-library/react` `@testing-library/jest-dom` `@testing-library/user-event`

---

##  Quickstart (Frontend)

**Requirements** Node.js 18+ and npm

```bash
npm install
npm start
```

- App runs at http://localhost:3000
- CRA scripts `start` `build` `test` `eject`

If Tailwind styles do not apply ensure CRA picked up `index.css` import and Tailwind `content` globs include `./src/**/*.{js,jsx,ts,tsx}`.

---

##  Configuration

### 1) Google OAuth (client)

In `src/App.js` the Google provider uses a client ID. For production replace with an environment variable and never commit secrets.

Example (CRA)

- Add to `.env` at project root
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```
- Update `App.js`
```jsx
<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
  ...
</GoogleOAuthProvider>
```

### 2) EmailJS (client)

`src/pages/PracticeReminderPage.js` initializes EmailJS with an ID. Replace with your own and consider environment variables

```
REACT_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
```

Initialize via
```js
import emailjs from 'emailjs-com';
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
```

### 3) SendGrid (optional server Express)

`src/server.js` currently contains a hard‑coded SendGrid API key which is a security risk. Replace with an environment variable

```
SENDGRID_API_KEY=SG.xxxxx...
FROM_EMAIL=no-reply@yourdomain.com
```

Then update `server.js`

```js
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = { to: email, from: process.env.FROM_EMAIL, subject, text, html };
```

> Never commit API keys. Ensure `.env` is in `.gitignore`.

---

##  Optional Server (Email via SendGrid)

Add a script alias in `package.json`

```json
"scripts": {
  "server": "node src/server.js"
}
```

Run
```bash
npm run server
# Server at http://localhost:5000
```

### Available endpoints
- `GET /api/tasks` list scheduled tasks (in‑memory)
- `POST /api/tasks` add and schedule a task email
- `DELETE /api/tasks/:id` delete a task

> Storage is in‑memory for demo purposes. Replace with a database in production.

---

##  Usage Guide

### Sign up and Auth
Use Google sign‑in or email/password fallback stored locally for demo.

### Faces
Add face name description and image captured to Base64 stored as `faces` in localStorage.

### Facts
Create categories and add facts under each. Edit and delete via options menu.

### Practice
Randomized non‑repeating recall drills interleave user truths with preset distractors to avoid repetition bias.

### Practice Reminders
Choose times and weekdays schedules EmailJS client sends. Optional server tasks trigger SendGrid cron emails.

### To‑Do
Add items with time reminders mark complete clear done.

### Medications
Track daily medications with dose and checklist.

### AI Assistant (stub)
Simple input and response area. Wire up an LLM endpoint in a secure backend before production.

### Emergency Contacts
Store important contacts for quick access.

---

##  Testing

CRA and Testing Library are configured.

```bash
npm test
```

Suggested additions
- Unit tests for `utils/reminders.js`
- Component tests for `FactCard` `MedicationItem` and `ToDoItem`
- E2E smoke test across protected routes

---

##  Security and Privacy Notes

- Do not commit secrets Google OAuth client ID EmailJS key SendGrid key
- Client keys are visible to users sensitive actions should be proxied through a backend
- Consider moving from localStorage to a real database for multi‑device sync
- Add authentication and authorization if you expose server APIs

---

## 🛠️ Roadmap

- Replace AI stub with a backend route to an LLM provider
- Migrate reminders to a server queue such as BullMQ and Redis with per‑user schedules
- Persist data to a database such as Supabase Firebase or Postgres with Prisma
- Add image upload to cloud storage
- Add PWA offline mode and push notifications

---

##  Build and Deploy

### Frontend (Vercel or Netlify)
- Build `npm run build` outputs `build/`
- Deploy the `build/` directory

### Server
- Deploy Express server on Render Fly.io Heroku or any Node host
- Set `SENDGRID_API_KEY` and `FROM_EMAIL` environment variables
- Configure CORS for the frontend origin

---

##  Scripts (from package.json)

```json
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
```

---

##  Notable Dependencies (from package.json)

```json
"dependencies": {
    "@google/generative-ai": "^0.21.0",
    "@heroicons/react": "^2.1.5",
    "@react-oauth/google": "^0.12.1",
    "@sendgrid/mail": "^8.1.4",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.7.7",
    "cors": "^2.8.5",
    "emailjs-com": "^3.2.0",
    "express": "^4.21.1",
    "feather-icons": "^4.29.2",
    "framer-motion": "^11.11.9",
    "jwt-decode": "^4.0.0",
    "lucide-react": "^0.453.0",
    "node-cron": "^3.0.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-markdown": "^9.0.1",
    "react-redux": "^9.1.2",
    "react-router-dom": "^6.27.0",
    "react-scripts": "5.0.1",
    "react-time-picker": "^7.0.0",
    "redux": "^5.0.1",
    "web-vitals": "^2.1.4"
  }
```

---

##  Data Keys (localStorage)

- `user`
- `faces`
- `factCategories`
- `practiceReminders`
- `todos`
- `medications`

---

