# EduGuide Setup Guide

This guide will help you set up the EduGuide application from scratch.

## System Requirements

- Node.js 18 or higher
- pnpm (recommended) or npm/yarn
- PostgreSQL 12+
- Docker (optional, for running PostgreSQL and Qdrant in containers)

## Step 1: Install Dependencies

```bash
cd /vercel/share/v0-project
pnpm install
```

## Step 2: Setup PostgreSQL Database

### Option A: Using Docker (Recommended)

```bash
# Run PostgreSQL container
docker run --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=admission_db \
  -p 5432:5432 \
  -d postgres:latest

# Wait a few seconds for the database to start
sleep 5
```

### Option B: Using Local PostgreSQL

1. Create a new database:
```sql
CREATE DATABASE admission_db;
```

2. Note your connection string

## Step 3: Setup Qdrant Vector Database

### Option A: Using Docker (Recommended)

```bash
docker run --name qdrant \
  -p 6333:6333 \
  -v /tmp/qdrant_storage:/qdrant/storage \
  -d qdrant/qdrant:latest
```

### Option B: Local Installation

Download and run Qdrant from: https://qdrant.tech/documentation/quick-start/

## Step 4: Setup AI Provider

Choose your preferred AI provider:

### Option A: Ollama (Recommended for Development)

```bash
# Install Ollama from https://ollama.ai
# Then pull a model:
ollama pull llama2

# In another terminal, start Ollama:
ollama serve
```

### Option B: OpenAI

1. Sign up at https://platform.openai.com/
2. Get your API key from the settings page

### Option C: Anthropic Claude

1. Sign up at https://console.anthropic.com/
2. Get your API key

## Step 5: Configure Environment Variables

Copy the example file and update it:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# PostgreSQL Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/admission_db

# Qdrant Configuration
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# AI Provider Selection
AI_PROVIDER=ollama

# Ollama Configuration (if using Ollama)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# OR - OpenAI Configuration (if using OpenAI)
# AI_PROVIDER=openai
# OPENAI_API_KEY=sk-your-key-here

# OR - Anthropic Configuration (if using Anthropic)
# AI_PROVIDER=anthropic
# ANTHROPIC_API_KEY=sk-ant-your-key-here

NODE_ENV=development
```

## Step 6: Initialize Database

Run migrations:

```bash
pnpm run db:migrate
```

Seed example data:

```bash
pnpm run db:seed
```

## Step 7: Start Development Server

```bash
pnpm dev
```

The application will be available at: http://localhost:3000

## Testing the Application

### 1. Landing Page
- Visit http://localhost:3000
- Verify the navigation and feature cards load correctly

### 2. Chat Interface
- Click "Get Started" or go to http://localhost:3000/chat
- Try asking a question like: "What are the top universities in Bangladesh?"
- Verify you get a response from your AI provider

### 3. Eligibility Checker
- Go to http://localhost:3000/eligibility
- Enter 80 as HSC marks
- Select Physics, Chemistry, Mathematics
- Click "Check Eligibility"
- Should show eligible programs

### 4. Recommendations
- Go to http://localhost:3000/recommendations
- Enter 85 as HSC marks
- Click "Get Recommendations"
- Should display recommended universities

### 5. Universities
- Go to http://localhost:3000/universities
- Verify all 6 universities display
- Click on one to see details
- Test search functionality

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

Solution:
- Ensure PostgreSQL is running: `docker ps | grep postgres`
- Check DATABASE_URL in .env.local
- Verify credentials are correct

### AI Provider Not Responding

```
Error: OLLAMA_BASE_URL is required when using Ollama provider
```

Solution for Ollama:
- Ensure Ollama is running: `ollama serve`
- Check OLLAMA_BASE_URL in .env.local (should be `http://localhost:11434`)
- Pull a model: `ollama pull llama2`

### Chat API 401 Unauthorized

Solution:
- Clear cookies and reload the page
- This resets your session

### Qdrant Connection Error

Solution:
- Ensure Qdrant is running: `docker ps | grep qdrant`
- Check QDRANT_URL in .env.local
- Qdrant may be optional - chat will work without it

## Performance Tips

1. **For faster responses with Ollama:**
   - Use smaller models for testing: `ollama pull neural-chat` (5.3GB)
   - Use larger models for better quality: `ollama pull mistral` (4.7GB) or `llama2` (3.8GB)

2. **For database optimization:**
   - Index frequently searched columns
   - Use connection pooling (already configured with Drizzle)

3. **For API optimization:**
   - Use response caching for university data
   - Implement rate limiting for chat API

## Next Steps

1. Customize the color scheme in `app/globals.css`
2. Add more universities to the database
3. Implement the circular reader for PDFs
4. Add multi-language support
5. Set up authentication if needed
6. Deploy to Vercel

## Getting Help

If you encounter issues:

1. Check the README.md for general information
2. Review error messages carefully
3. Check the logs in your terminal
4. Verify all services are running (PostgreSQL, Qdrant, AI Provider)
5. Check environment variables are set correctly

## Environment Checklist

Before you start the app, verify:

- [ ] PostgreSQL is running and accessible
- [ ] Database is created with correct name
- [ ] .env.local file is created with correct values
- [ ] AI Provider is selected and running (Ollama/OpenAI/Anthropic)
- [ ] Qdrant is running (optional but recommended)
- [ ] Node dependencies are installed
- [ ] Database migrations have run
- [ ] Seed data has been inserted

## Quick Start Command (All-in-One)

If you prefer a single command:

```bash
# Start PostgreSQL
docker run --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=admission_db -p 5432:5432 -d postgres:latest

# Wait for PostgreSQL
sleep 5

# Start Qdrant
docker run --name qdrant -p 6333:6333 -d qdrant/qdrant:latest

# Copy environment file (edit DATABASE_URL if needed)
cp .env.example .env.local

# Install dependencies
pnpm install

# Run migrations
pnpm run db:migrate

# Seed data
pnpm run db:seed

# Start Ollama in another terminal:
# ollama serve

# Start development server
pnpm dev
```

Then visit http://localhost:3000

---

Happy coding! If you have questions, refer to the main README.md file.
