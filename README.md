# EduGuide - University Admission Assistant for Bangladesh

An AI-powered web application to help HSC students in Bangladesh find suitable universities and programs through intelligent guidance and personalized recommendations.

## Features

- **AI Chat Advisor** - Ask questions about universities, programs, and admission processes
- **Eligibility Checker** - Check your eligibility for different programs based on your HSC marks and subjects
- **Smart Recommendations** - Get personalized university recommendations based on your academic profile
- **University Explorer** - Browse and compare universities and programs
- **Anonymous Tracking** - Track user interactions while maintaining anonymity with session IDs
- **Multi-AI Support** - Supports Ollama (default), OpenAI, and Anthropic Claude

## Tech Stack

- **Frontend**: Next.js 16 with React 19
- **Styling**: Tailwind CSS with custom warm color scheme (amber/emerald/rust)
- **Database**: PostgreSQL (self-hosted or managed)
- **Vector Database**: Qdrant (for semantic search)
- **AI**: Support for Ollama, OpenAI, and Anthropic Claude
- **ORM**: Drizzle ORM
- **UI Components**: shadcn/ui

## Prerequisites

Before you start, make sure you have:

- Node.js 18+ and pnpm installed
- PostgreSQL database running
- Qdrant vector database running (optional but recommended)
- One of the AI providers configured:
  - **Ollama** (default) - `ollama serve` running locally
  - **OpenAI** - API key available
  - **Anthropic** - API key available

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd eduguide
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/admission_db

# Qdrant
QDRANT_URL=http://localhost:6333

# AI Provider (choose one)
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# Or for OpenAI:
# AI_PROVIDER=openai
# OPENAI_API_KEY=your_key_here

# Or for Anthropic:
# AI_PROVIDER=anthropic
# ANTHROPIC_API_KEY=your_key_here
```

### 3. Setup Database

Run database migrations:

```bash
pnpm run db:migrate
```

Seed initial data:

```bash
pnpm run db:seed
```

### 4. Start Services

#### PostgreSQL (if not running)
```bash
# Using Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

#### Qdrant (if using vector search)
```bash
# Using Docker
docker run --name qdrant -p 6333:6333 -d qdrant/qdrant
```

#### Ollama (if using as AI provider)
```bash
ollama serve
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── chat/               # Chat interface
│   ├── eligibility/        # Eligibility checker
│   ├── recommendations/    # Recommendations page
│   ├── universities/       # Universities listing & details
│   └── api/
│       └── chat/           # AI chat API endpoint
├── lib/
│   ├── db/
│   │   ├── index.ts        # Database client
│   │   ├── schema.ts       # Database schema
│   │   └── seed.ts         # Seed data
│   ├── ai/
│   │   ├── provider.ts     # AI provider configuration
│   │   └── context.ts      # AI system prompts and context
│   ├── session.ts          # Session management
│   └── qdrant.ts           # Qdrant client
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── ...                 # Custom components
└── public/                 # Static assets
```

## Pages Overview

### Landing Page (`/`)
- Hero section with call-to-action
- Feature highlights
- Statistics
- Footer with navigation

### Chat Page (`/chat`)
- AI-powered chat interface
- Real-time streaming responses
- Suggested prompts for new users
- Message history display

### Eligibility Checker (`/eligibility`)
- Input HSC marks and subjects
- Display eligible programs
- Show eligibility margins
- Comparison with cutoff marks

### Recommendations (`/recommendations`)
- Personalized university recommendations
- Match scores based on academic profile
- Popular programs at each university
- Detailed recommendations

### Universities (`/universities`)
- Browse all universities
- Search and filter options
- University cards with key information
- Link to detailed university pages

### University Details (`/universities/[slug]`)
- Comprehensive university information
- Programs offered
- Admission process
- Tuition fees
- Campus facilities
- Tabbed interface for easy navigation

## AI Provider Configuration

### Ollama (Default)
Run locally without API keys:
```bash
ollama serve
# In another terminal:
ollama pull llama2  # or other models
```

### OpenAI
Set environment variables:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

### Anthropic Claude
Set environment variables:
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
```

## Session Tracking

Users are tracked anonymously using:
- **Session IDs**: Unique identifier stored in PostgreSQL
- **HTTP-only Cookies**: Secure session tokens
- **Activity Logs**: Track user actions (chat, eligibility checks, etc.)
- **No PII**: No personal information is stored

## Database Schema

### Key Tables:
- `sessions` - Anonymous user sessions
- `chat_messages` - Conversation history
- `activity_logs` - User interactions
- `universities` - University data
- `programs` - Degree programs
- `eligibility_criteria` - Program requirements
- `user_preferences` - User study preferences

## API Endpoints

### POST `/api/chat`
- Accepts chat messages
- Returns streaming AI responses
- Stores conversation history
- Requires active session

## Design System

### Color Palette (No Blue/Violet)
- **Primary**: Warm Amber/Rust (`oklch(0.55 0.19 47)`)
- **Accent**: Emerald Green (`oklch(0.48 0.18 87)`)
- **Background**: Off-white (`oklch(0.99 0 0)`)
- **Foreground**: Dark Brown (`oklch(0.2 0 0)`)

### Typography
- **Headings**: Geist Sans Bold
- **Body**: Geist Sans Regular
- **Monospace**: Geist Mono

## Development

### Run Tests
```bash
pnpm test
```

### Build for Production
```bash
pnpm build
pnpm start
```

### Lint Code
```bash
pnpm lint
```

## Deployment

### Deploy to Vercel

```bash
pnpm i -g vercel
vercel
```

### Environment Variables on Vercel
Set these in Vercel project settings:
- `DATABASE_URL`
- `QDRANT_URL`
- `AI_PROVIDER`
- `OPENAI_API_KEY` (if using OpenAI)
- `ANTHROPIC_API_KEY` (if using Anthropic)
- `OLLAMA_BASE_URL` (if using Ollama)

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check `DATABASE_URL` format
- Verify database exists

### Qdrant Connection Error
- Ensure Qdrant is running on configured port
- Check `QDRANT_URL` is correct

### AI Provider Error
- Verify the selected AI provider is running/configured
- Check API keys are set correctly
- For Ollama, ensure model is pulled: `ollama pull llama2`

### Session Cookie Error
- Ensure cookies are enabled in browser
- Check if running on HTTPS (required for production)

## Future Enhancements

- PDF circular reader for university circulars
- Advanced comparison tools for multiple universities
- Admission timeline and deadline tracking
- Integration with university official APIs
- Multi-language support (Bengali, English)
- Mobile app version
- User accounts with saved preferences

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the FAQ on the landing page
2. Chat with the AI advisor
3. Open an issue on GitHub

---

Built with ❤️ for Bangladesh students
