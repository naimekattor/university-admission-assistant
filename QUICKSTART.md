# EduGuide - Quick Start (5 minutes)

## TL;DR - Get Running in 5 Minutes

### Prerequisites
- Node.js 18+
- pnpm
- Docker (recommended)
- Ollama (or OpenAI/Anthropic API key)

### 1. One-Command Setup

```bash
# Clone and enter directory
cd /vercel/share/v0-project

# Install packages
pnpm install

# Start services in Docker
docker run --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=admission_db -p 5432:5432 -d postgres:latest
docker run --name qdrant -p 6333:6333 -d qdrant/qdrant:latest

# Copy environment
cp .env.example .env.local

# Start dev server
pnpm dev
```

### 2. In Another Terminal - Start Ollama

```bash
ollama serve
# In a third terminal:
ollama pull llama2
```

### 3. Visit the App

Open http://localhost:3000 in your browser

---

## What You'll See

### Landing Page (/)
- Beautiful warm-colored design with amber and emerald accents
- Feature overview
- Links to all sections

### Chat (/chat)
- Talk to AI about universities
- Try: "What universities in Bangladesh have engineering programs?"
- Or: "I scored 80 in HSC, what universities can I get into?"

### Eligibility (/eligibility)
- Enter HSC marks (try: 80)
- Select subjects (Physics, Chemistry, Math)
- See which programs you qualify for

### Recommendations (/recommendations)
- Get personalized university suggestions
- View match scores
- Browse popular programs

### Universities (/universities)
- Browse all 6 universities
- Search by name
- Click to see detailed info

### University Details (/universities/du)
- Full information about each university
- Programs offered
- Admission process
- Fees
- Campus facilities

---

## Configuration

### Using Ollama (Recommended for Development)

Already set in `.env.local`:
```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

Just run: `ollama serve` and `ollama pull llama2`

### Using OpenAI

Edit `.env.local`:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
```

### Using Anthropic

Edit `.env.local`:
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

## Project Features

✅ Anonymous user tracking (no login needed)
✅ AI-powered chat advisor  
✅ Eligibility checking algorithm
✅ University recommendations
✅ 6 Bangladeshi universities with programs
✅ Warm, modern design (amber + emerald)
✅ Mobile responsive
✅ Fast loading
✅ Real-time streaming chat

---

## Common Issues

### Chat says "Unauthorized"
- Refresh the page (clears and creates new session)
- Check browser cookies are enabled

### Ollama not responding
```bash
# Make sure Ollama is running in another terminal
ollama serve

# And the model is pulled
ollama pull llama2
```

### Database connection error
```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# If not running, start it
docker run --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=admission_db -p 5432:5432 -d postgres:latest
```

### Port already in use
```bash
# Check what's on port 3000
lsof -i :3000

# Kill it if needed
kill -9 <PID>
```

---

## Customize

### Change Colors
Edit `/app/globals.css` - look for the `:root` color definitions

### Add More Universities
Edit `/lib/db/seed.ts` and add to `universityData` array

### Change AI Provider
Edit `.env.local` and set `AI_PROVIDER`

### Customize Chat Prompts
Edit `/lib/ai/context.ts` to change system prompts

---

## Next Steps

1. **Explore the code** - Start in `app/page.tsx` for landing page
2. **Check the database** - Look at `lib/db/schema.ts` for data structure
3. **Understand the flow** - Trace how chat works: `app/chat/page.tsx` → `app/api/chat/route.ts`
4. **Customize** - Add your own universities, programs, colors
5. **Deploy** - See README.md for Vercel deployment instructions

---

## File Structure Cheat Sheet

```
app/page.tsx              ← Landing page
app/chat/page.tsx         ← Chat interface
app/eligibility/page.tsx  ← Eligibility checker
app/recommendations/      ← Recommendations engine
app/universities/         ← Browse universities
lib/db/schema.ts          ← Database structure
lib/ai/provider.ts        ← AI configuration
lib/session.ts            ← Session management
app/globals.css           ← Colors and styles
.env.local                ← Configuration
```

---

## Help & Docs

- **Full Setup**: See SETUP.md
- **Architecture**: See IMPLEMENTATION_SUMMARY.md
- **All Details**: See README.md

---

## You're All Set! 🎉

- App running: http://localhost:3000
- Chat ready to use
- Eligibility checker ready
- Universities browsable

Start chatting! Try: "Tell me about BUET"

---

## Troubleshooting Checklist

Before reaching out for help:

- [ ] PostgreSQL running (`docker ps`)
- [ ] Ollama running (`ollama serve`)
- [ ] Model pulled (`ollama list` shows llama2)
- [ ] `.env.local` has correct DATABASE_URL
- [ ] Port 3000 free (or change in dev config)
- [ ] Node 18+ installed (`node --version`)
- [ ] pnpm installed (`pnpm --version`)
- [ ] Dependencies installed (`pnpm install`)

If still issues, check logs:
- Terminal where `pnpm dev` runs for Next.js errors
- Terminal where `ollama serve` runs for AI errors
- Check browser console (F12) for client errors

---

Happy exploring! 🚀
