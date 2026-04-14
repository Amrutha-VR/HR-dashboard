<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

<h1 align="center">CoreHR - Simplified HRIS Dashboard</h1>

<p align="center">
  <b>A polished, professional, and production-quality employee management directory built for HR teams.</b>
  <br />
  View workforce data, explore org hierarchy, manage roles — all from a refined internal‑tool interface.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Employees-25-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Departments-5-teal?style=flat-square" />
  <img src="https://img.shields.io/badge/Backend-None%20(Mock%20Data)-lightgrey?style=flat-square" />
</p>

---

##  Demo Login Credentials

| Field    | Value              |
|----------|--------------------|
| **Email**    | `hr@corehr.io`     |
| **Password** | `admin`            |

> The app uses mock authentication. Use the credentials above to access the HR dashboard.
> A "Forgot Password" flow is also included as a simulated experience.

---

##  Features at a Glance

| Feature | Description |
|---------|-------------|
|  **HR Dashboard** | Summary metrics, department & status charts, recent joiners, motivational quote widget |
|  **Employee Directory** | Searchable, filterable, sortable employee table with 6 filter dimensions |
|  **Employee Detail View** | Full profile — employment info, projects, performance, direct reports, contacts |
|  **Org Chart** | Top-to-bottom visual hierarchy built dynamically from `managerId` relationships |
|  **Promote / Demote** | Simulate HR role changes with polished modal — updates state instantly |
|  **Login & Auth** | Mock HR-only login with protected routes, session persistence, and logout |
|  **Forgot Password** | Simulated password reset flow with elegant success state |
|  **Quote Widget** | Auto-rotating motivational quotes curated for HR teams |
|  **Performance View** | Star ratings, trend indicators, review status per employee |
|  **Cross Navigation** | Seamless flow between directory → detail → org chart and back |

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 |
| **Language** | TypeScript 5 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Routing** | React Router v7 |
| **State** | React Context API |
| **Data** | Local mock data (no backend) |

---

##  Project Structure

```
src/
├── config/           # Auth constants & demo credentials
│   └── auth.ts
├── types/            # TypeScript interfaces & domain types
│   └── employee.ts
├── data/             # Mock database — 25 employees, quotes
│   ├── employees.ts
│   └── quotes.ts
├── utils/            # Pure utility functions
│   └── index.ts      # Hierarchy builder, filters, sort, metrics, promote/demote
├── hooks/            # React Context providers & custom hooks
│   ├── useAuth.tsx   # Auth context (login / logout / session)
│   └── useEmployees.tsx  # Employee state store
├── components/       # Reusable UI components
│   ├── Avatar.tsx
│   ├── Badge.tsx         # Status, Review, Trend, Band, EmploymentType badges
│   ├── MetricCard.tsx
│   ├── SearchBar.tsx
│   ├── FilterBar.tsx
│   ├── EmployeeTable.tsx
│   ├── QuoteWidget.tsx
│   ├── PromoteModal.tsx
│   ├── DepartmentChart.tsx
│   ├── StatusChart.tsx
│   ├── PerformanceStars.tsx
│   ├── OrgChartNode.tsx  # Visual hierarchy node
│   ├── ProtectedRoute.tsx
│   └── Layout.tsx        # App shell with navbar & logout
├── pages/            # Route-level screens
│   ├── Login.tsx
│   ├── ForgotPassword.tsx
│   ├── Dashboard.tsx
│   ├── EmployeeDetail.tsx
│   └── OrgChart.tsx
├── App.tsx           # Router & provider setup
├── main.tsx          # Entry point
└── index.css         # Tailwind import & global styles
```

---

##  Design System

| Element | Value |
|---------|-------|
| **Background** | Warm cream `#faf9f7` |
| **Cards** | White with subtle stone borders |
| **Text** | Charcoal / Neutral 800 |
| **Positive / Active** | Muted emerald green |
| **Negative / Inactive** | Muted red |
| **Warning / Review** | Amber |
| **Typography** | Inter (Google Fonts) |
| **Animations** | Subtle Framer Motion transitions |
| **Scrollbars** | Custom thin stone-colored |

---

##  Mock Data Overview

- **25 realistic employees** across **5 departments** and **11 teams**
- Nested reporting hierarchy: CEO → VPs → Managers → Team Leads → ICs
- Edge cases included:
  -  Inactive employee
  -  Employee on leave
  -  Probation / new hire
  -  Contract employee & intern
  -  Invalid manager reference (`EMP-999`)
  -  Duplicate first names
  -  Missing optional fields (address, emergency contact, notes)

---

##  Getting Started

### Prerequisites

- **Node.js** v18+ 
- **npm** v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Amrutha-VR/HR-dashboard.git
cd HR-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open **http://localhost:5173/** and login with the demo credentials above.

### Build for Production

```bash
npm run build
npm run preview
```

---

##  Core Screens

### 1. Login Page
- Elegant centered card with CoreHR branding
- Email & password fields with show/hide toggle
- Input validation & error handling
- "Forgot Password" link
- Demo credentials displayed professionally

### 2.  HR Dashboard
- 6 summary metric cards (Total, Active, Managers, Teams, Under Review, Departments)
- Department distribution bar chart
- Workforce status donut chart
- Recent joiners panel
- Auto-rotating motivational quote widget
- Full employee table with search, 6 filters, and multi-column sorting

### 3.  Employee Detail
- Profile header with avatar, status badges, and profile completeness
- Employment info, projects (current + previous), and team details
- Performance summary (stars, trend, review status)
- Direct reports list with team average rating (for managers)
- Contact & address info
- Promote / Demote HR actions with polished modal
- "View in Org Chart" navigation

### 4.  Org Chart
- Top-to-bottom visual hierarchy with centered layout
- Dynamic tree built from `managerId` relationships
- Expand / collapse per node with `+`/`−` controls
- Expand All / Collapse All bulk actions
- Node highlighting via URL parameter
- Click-to-detail navigation on hover

---

##  Key Engineering Decisions

| Decision | Rationale |
|----------|-----------|
| **React Context over Redux** | Minimal state complexity — Context + `useCallback` is sufficient |
| **Pure utility functions** | All filtering, sorting, hierarchy building, and metrics are pure functions — easily testable |
| **Mock data as single source of truth** | One `employees.ts` file drives the entire app — easy to swap with API later |
| **Session-based auth** | `sessionStorage` — clears on tab close, intentionally temporary for demo |
| **Component barrel exports** | Clean imports via `index.ts` files — `import { Avatar } from './components'` |
| **TypeScript strict types** | Every employee field, every status, every action payload is typed |

---

##  License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <sub>Built with ☕ and attention to detail — designed for HR teams who value clarity.</sub>
</p>
