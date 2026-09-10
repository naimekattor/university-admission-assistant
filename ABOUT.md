# About EduGuide

**EduGuide** is an AI-powered platform designed to simplify university admissions and HSC exam preparation for Bangladeshi students.

## 🎯 Purpose

We're building an intelligent companion for Higher Secondary Certificate (HSC) students navigating the complex landscape of higher education in Bangladesh. Our mission is to:

- **Guide students** toward universities and programs that align with their academic performance and career aspirations
- **Provide personalized recommendations** based on individual preferences, strengths, and qualifications
- **Offer comprehensive exam preparation** resources, mock tests, and practice questions
- **Democratize educational guidance** with AI-driven insights accessible to all students, regardless of geographic or financial constraints

## 🌟 Key Features

### 🤖 AI-Powered University Matching
- Intelligent eligibility analysis based on GPA, subject combinations, and board examinations
- Smart university recommendations considering admission criteria, program quality, and student preferences
- Conversational AI guidance for personalized counseling

### 📚 HSC Exam Preparation
- Comprehensive curriculum-aligned question banks
- Mock tests with detailed performance analytics
- Subject-wise preparation modules and study resources
- Adaptive learning paths based on student progress

### 🎓 Admission Intelligence
- Real-time admission requirement databases
- Historical acceptance trends and cutoff scores
- Detailed university and program profiles
- Application timeline management

### 💡 Personalized Learning
- AI-powered study recommendations
- Progress tracking and performance insights
- Subject strengths and weakness analysis
- Customized preparation strategies

## 🏗️ Technical Stack

**Frontend (91.1% TypeScript)**
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide Icons
- **Type Safety**: Full TypeScript support

**Backend (TypeScript)**
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: LLM orchestration for intelligent features
- **APIs**: RESTful API architecture

**DevOps & Tools**
- **Package Manager**: pnpm (monorepo support)
- **Scripting**: Shell scripts for automation and seeding
- **Build Tools**: TypeScript compiler and Next.js bundler

## 📦 Project Structure

EduGuide is built as a **monorepo** with two independent but integrated packages:

- **Frontend** (`/frontend`) - Next.js web application with rich UI components
- **Backend** (`/backend`) - Express.js API server with AI orchestration, database models, and business logic

Both packages can run independently or be orchestrated together for seamless integration.

## 🚀 Getting Started

### Quick Start
```bash
# Install dependencies and start both frontend & backend
pnpm install
pnpm dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

### Standalone Execution
Run frontend and backend independently for flexible development and deployment.

## 📊 Repository Metrics

- **Language Composition**: 
  - TypeScript: 91.1% (Core application logic)
  - HTML: 4.7% (Template markup)
  - Shell: 3.3% (Build & seed scripts)
  - Other: 0.9%

- **Type**: Full-stack web application
- **Monorepo**: Yes (pnpm workspace)
- **Database**: PostgreSQL
- **AI Features**: Yes (LLM-powered recommendations)

## 🎓 Target Audience

- **HSC Students** in Bangladesh seeking university admission guidance
- **Parents** wanting to understand admission processes and university options
- **Educators** requiring comprehensive exam preparation resources
- **Educational Institutions** looking for integrated counseling solutions

## 🌍 Impact

By providing AI-driven personalized guidance, EduGuide aims to:
- Reduce educational inequality in Bangladesh
- Help students make informed decisions about their future
- Increase quality university placements
- Enhance overall HSC exam preparation outcomes
- Bridge the gap between students' potential and opportunities

## 📄 Documentation

- [Quick Start Guide](QUICKSTART.md) - Get up and running in minutes
- [Setup Guide](SETUP.md) - Detailed installation instructions
- [Architecture Audit](docs/architecture-audit.md) - Technical deep-dive

## 🤝 Contributing

We welcome contributions from developers, educators, and students passionate about improving educational outcomes in Bangladesh. Please check our contribution guidelines for more details.

## 📜 License

[Check LICENSE file for details]

---

**EduGuide**: *Making quality educational guidance accessible to every HSC student in Bangladesh.*
