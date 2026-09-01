# EduGuide (AI University Admission & Preparation Platform)

An AI-powered university admission counseling and HSC preparation platform for Bangladeshi students.

---

## 🏗️ Repository Architecture

The project is structured into two independent packages that can be developed, tested, and deployed completely independently or orchestrated together:

```
university-admission-assistant/
├── frontend/                  # Next.js 16 App Router (React 19, Tailwind CSS v4, Lucide)
│   ├── app/                   # App Router pages and layouts
│   ├── components/            # Reusable UI widgets & components
│   ├── lib/                   # Frontend helpers & calculations
│   ├── package.json           # Frontend scripts & dependencies
│   └── next.config.mjs        # Next.js config & backend API rewrites
│
├── backend/                   # Express + TypeScript Service
│   ├── src/
│   │   ├── config/            # Environment configurations
│   │   ├── db/                # Drizzle ORM schema & PostgreSQL pool
│   │   ├── middleware/        # CORS, Error handling, Auth
│   │   ├── modules/           # AI orchestrator, Eligibility, Practice, Exams, Prep, RAG
│   │   ├── routes/            # Express REST API routes (/api/*)
│   │   └── server.ts          # Express server entry point
│   ├── scripts/               # Seeding and vector ingestion scripts
│   └── package.json           # Backend scripts & dependencies
│
├── pnpm-workspace.yaml        # Workspace configuration linking frontend and backend
└── package.json               # Root monorepo orchestrator scripts
```

---

## 🚀 Getting Started

### Option 1: Run Both Concurrently (Root)

```bash
pnpm install
pnpm dev
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000](http://localhost:4000)

### Option 2: Run Independently

#### Run Backend
```bash
cd backend
pnpm install
pnpm dev
```

#### Run Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

---

## 🛠️ Available Scripts

### Root Monorepo
| Command | Description |
|---|---|
| `pnpm dev` | Starts frontend and backend concurrently in parallel |
| `pnpm dev:frontend` | Starts only the Next.js frontend |
| `pnpm dev:backend` | Starts only the Express backend |
| `pnpm build` | Builds both frontend and backend |
| `pnpm seed` | Runs database seeding via backend scripts |

### Backend (`backend/`)
| Command | Description |
|---|---|
| `pnpm dev` | Starts Express server with hot-reload (`tsx watch`) |
| `pnpm build` | Compiles TypeScript (`tsc`) |
| `pnpm start` | Runs production server (`tsx src/server.ts`) |
| `pnpm seed:db` | Seeds core university data |
| `pnpm seed:saas` | Seeds curriculum, mock tests, and question bank |

### Frontend (`frontend/`)
| Command | Description |
|---|---|
| `pnpm dev` | Starts Next.js dev server with Turbopack |
| `pnpm build` | Builds optimized Next.js production build |
| `pnpm start` | Starts Next.js production server |
| `pnpm lint` | Runs ESLint |

---

## 📖 Documentation
- [Quick Start Guide](QUICKSTART.md)
- [Setup Guide](SETUP.md)
- [Architecture Audit](docs/architecture-audit.md)
