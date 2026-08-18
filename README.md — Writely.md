# Writely

### A social platform built specifically for writers.

Writely is a modern social network where writers can publish, discover, save and discuss written works while using AI-powered tools to improve their writing.

It combines the social features of a community platform with the focused reading and writing experience of a publishing platform.

---

## Local setup and AI configuration

### Environment variables

Copy `.env.example` to `.env` and fill in the relevant keys for your environment:

```bash
cp .env.example .env
```

The app supports the following AI options:

- `OPENAI_API_KEY` for OpenAI GPT
- `GEMINI_API_KEY` for Google Gemini
- `AI_API_KEY` as a shared fallback used by either provider

If no key is configured, Writely automatically uses the built-in local AI engine so the app continues to work in local development.

When 3000 is already in use, run the app on a different port:

```bash
PORT=3001 npm run dev
```

### Features

### Authentication

- User registration
- Login/logout
- Session management
- Email verification
- Password recovery
- Protected routes

### Writer Profiles

Every writer gets a dedicated profile containing:

- Avatar
- Display name
- Username
- Bio
- Followers
- Following
- Public writings
- Writing categories
- Social links

---

## Writing

Users can create different kinds of writing:

- Poems
- Short stories
- Novels
- Chapters
- Essays
- Articles
- Flash fiction
- Screenplays
- Journals
- Other

Each writing supports:

- Title
- Rich text content
- Writing type
- Tags
- Genre
- Cover image
- Word count
- Draft status
- Public/private visibility

---

## Public and Private Writing

Writers have complete control over who can see their work.

### Public

Public writings:

- Appear in the global feed.
- Appear in search.
- Appear on the author's profile.
- Can be favourited.
- Have shareable URLs.

### Private

Private writings:

- Are visible only to their author.
- Do not appear in feeds.
- Do not appear in search.
- Do not appear on public profiles.

Privacy is enforced on the server, not merely through the frontend.

---

## Global Feed

The dashboard provides a global discovery feed.

Users can discover:

- Recently published writings
- Popular writings
- Writings from followed writers
- Recommended writings

The initial feed algorithm is intentionally simple and deterministic, with the architecture designed to support a more advanced recommendation system later.

---

## Following

Users can follow writers.

Following another writer allows their public writings to appear more prominently in the user's feed.

Users can:

- Follow
- Unfollow
- View followers
- View following

---

## Favourites

Users can favourite writings they want to return to later.

The application provides a dedicated:

**My Favourites**

page where users can browse their saved writings.

---

## Messaging

Writely uses a request-based messaging system.

A user cannot immediately start a conversation with another user.

The flow is:

```text
View Profile
     ↓
Message
     ↓
Send Message Request
     ↓
Recipient Accepts
     ↓
Conversation
```

Users can:

- Send message requests
- Accept requests
- Decline requests
- Send messages after acceptance
- Block users

---

## Notifications

Users receive notifications for important events:

- New follower
- Favourite on their writing
- Message request
- Accepted message request
- System notifications

---

# AI Writing Studio

Writely includes an AI Writing Studio designed specifically for writers.

Initial tools include:

### Improve Writing

Improve:

- Grammar
- Clarity
- Flow
- Sentence structure

### Rewrite

Rewrite content in different styles:

- Concise
- Descriptive
- Poetic
- Dramatic
- Professional
- Casual
- Simple

### Continue Writing

Generate possible continuations from existing text.

### Generate Title

Generate possible titles for a piece of writing.

### Generate Description

Create short descriptions/excerpts suitable for publishing.

### Summarize

Generate summaries of writings.

### Grammar Checker

Identify grammatical, spelling and punctuation issues.

### Tone Analysis

Analyze the emotional/style characteristics of a piece.

### Show Don't Tell

Identify opportunities to make writing more descriptive and immersive.

### Character Development

Generate character ideas, motivations, conflicts and arcs.

### Plot Brainstorming

Generate possible:

- Plot directions
- Conflicts
- Twists
- Character relationships

AI suggestions never automatically overwrite the user's work.

The writer remains in control.

---

# Search

Writely provides a powerful search system.

Search across:

- Writings
- Users
- Tags
- Genres

Search supports:

- Partial matching
- Typo tolerance
- Prefix matching
- Relevance ranking
- Exact phrases
- Filters
- Sorting
- Pagination

Writing filters include:

- Writing type
- Genre
- Tag
- Author
- Date
- Word count
- Popularity
- Language

The search layer is abstracted so a dedicated search engine can be introduced later.

---

# Technology Stack

## Frontend / Full-stack Framework

- Next.js
- React
- TypeScript

## Styling

- Tailwind CSS
- shadcn/ui
- Radix UI
- Lucide React

## Editor

- TipTap

## Database

- PostgreSQL

## ORM

- Prisma

Prisma provides type-safe PostgreSQL access and database migrations.

## Authentication

Use a production-ready authentication solution rather than implementing authentication primitives manually.

## Validation

- Zod

## Testing

- Vitest
- Testing Library
- Playwright

## AI

Provider-agnostic AI service abstraction.

The application should be able to support different AI providers without changing the UI or business logic.

## File Storage

Use object storage such as:

- Cloudflare R2
- Amazon S3
- Cloudinary
- Supabase Storage

## Search

Initial:

```text
PostgreSQL full-text/trigram search
```

Scalable implementation:

```text
Meilisearch / Typesense
```

---

# Architecture

```text
Next.js
│
├── App Router
│
├── Server Components
│
├── Client Components
│
├── Server Actions
│
└── Route Handlers
        │
        ▼
   Service Layer
        │
        ├───────────────┐
        ▼               ▼
     Prisma          External Services
        │               │
        ▼               ├── AI
   PostgreSQL           ├── Search
                        └── Storage
```

---

# Project Structure

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   │
│   ├── (platform)/
│   │   ├── dashboard/
│   │   ├── explore/
│   │   ├── create/
│   │   ├── writings/
│   │   ├── favourites/
│   │   ├── messages/
│   │   ├── notifications/
│   │   ├── ai/
│   │   ├── profile/
│   │   └── settings/
│   │
│   ├── u/
│   │   └── [username]/
│   │
│   ├── writing/
│   │   └── [slug]/
│   │
│   └── api/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── writing/
│   ├── feed/
│   ├── profile/
│   ├── messaging/
│   ├── search/
│   └── ai/
│
├── services/
│   ├── auth/
│   ├── writing/
│   ├── users/
│   ├── social/
│   ├── messaging/
│   ├── notifications/
│   ├── search/
│   └── ai/
│
├── repositories/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── validation/
│   ├── storage/
│   └── utils/
│
├── hooks/
│
└── types/

prisma/
├── schema.prisma
└── migrations/
```

---

# Core Data Model

The initial database should contain:

```text
User
Profile

Writing
Tag
WritingTag
Genre

Follow
Favourite

MessageRequest
Conversation
ConversationParticipant
Message

Notification

AIRequest
AIUsage
```

Potential future entities:

```text
Comment
Like
Block
Report
WritingVersion
ReadingHistory
Collection
Recommendation
```

---

# Getting Started

## Prerequisites

Install:

- Node.js
- npm/pnpm
- PostgreSQL

Create a database for local development.

---

## Clone the repository

```bash
git clone <repository-url>
cd writely
```

---

## Install dependencies

```bash
npm install
```

---

## Environment Variables

Create:

```text
.env
```

using:

```text
.env.example
```

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/writely"

AUTH_SECRET=""

AI_API_KEY=""

STORAGE_ACCESS_KEY=""
STORAGE_SECRET_KEY=""
STORAGE_BUCKET=""

SEARCH_URL=""
SEARCH_API_KEY=""

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Never commit `.env`.

---

# Database Setup

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

Open Prisma Studio if required:

```bash
npx prisma studio
```

Prisma's current PostgreSQL workflow supports migrations and type-safe database access through Prisma ORM.

---

# Development

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# Recommended Scripts

The final project should provide:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio"
  }
}
```

---

# Development Principles

The project should follow these principles:

### Type Safety

Use TypeScript throughout the application.

Avoid:

```typescript
any
```

unless there is a documented reason.

### Server-side Security

Never trust client-side authorization.

For example, hiding a private writing from the UI is not sufficient.

The server must verify:

```text
currentUser === writing.author
```

before allowing access.

### Validation

All external input must be validated with Zod.

### Separation of Concerns

Do not place:

- Database queries inside UI components.
- AI API calls inside UI components.
- Authorization logic inside random components.
- Large business logic inside route handlers.

Use services and repositories.

---

# UI Principles

Writely should feel like a platform designed for writers rather than another generic social media application.

Design characteristics:

- Elegant
- Minimal
- Typography-focused
- Calm
- Spacious
- Highly readable
- Responsive

The writing should be the primary visual element.

Avoid excessive:

- Gradients
- Animations
- Cards
- Badges
- Notifications
- Visual clutter

Long-form reading should feel comfortable.

---

# Main Navigation

Desktop:

```text
Writely

Home
Explore
Create
AI Studio
Favourites
Messages
Notifications

----------------
Profile
Settings
Logout
```

Mobile should use a compact navigation/bottom navigation system.

---

# Important Routes

```text
/
```

Landing page.

```text
/login
/register
```

Authentication.

```text
/dashboard
```

Global feed.

```text
/explore
```

Discovery.

```text
/create
```

Writing editor.

```text
/writing/[slug]
```

Public writing reader.

```text
/u/[username]
```

User profile.

```text
/favourites
```

Favourite writings.

```text
/messages
```

Messaging.

```text
/notifications
```

Notifications.

```text
/ai
```

AI Writing Studio.

```text
/settings
```

Account/settings.

---

# MVP

The first production-ready milestone should contain:

## Authentication

- [ ] Register
- [ ] Login
- [ ] Logout
- [ ] Protected routes

## Profiles

- [ ] Create profile
- [ ] Edit profile
- [ ] View profile
- [ ] Follow/unfollow

## Writings

- [ ] Create writing
- [ ] Rich text editor
- [ ] Save draft
- [ ] Edit writing
- [ ] Delete writing
- [ ] Public/private visibility
- [ ] Writing types
- [ ] Tags
- [ ] Public reader page

## Feed

- [ ] Global feed
- [ ] Pagination
- [ ] Writing cards
- [ ] Author information

## Favourites

- [ ] Favourite
- [ ] Unfavourite
- [ ] Favourites page

## Search

- [ ] User search
- [ ] Writing search
- [ ] Writing type filter
- [ ] Genre filter
- [ ] Tag filter
- [ ] Sorting
- [ ] Pagination

## Messaging

- [ ] Message request
- [ ] Accept request
- [ ] Decline request
- [ ] Conversations
- [ ] Send messages

## Notifications

- [ ] Follow notification
- [ ] Favourite notification
- [ ] Message request notification

## AI

- [ ] Improve writing
- [ ] Rewrite
- [ ] Grammar
- [ ] Generate title
- [ ] Summarize

## Quality

- [ ] Responsive design
- [ ] Accessibility
- [ ] Error states
- [ ] Loading states
- [ ] Empty states
- [ ] Unit tests
- [ ] E2E tests
- [ ] Type checking
- [ ] Linting

---

# Future Roadmap

After the MVP, consider:

```text
Comments
Likes
Writer communities
Writing competitions
Reading lists
Public collections
Writing statistics
Version history
Collaborative writing
Writer subscriptions
Premium AI tools
Advanced recommendations
AI character assistant
AI plot assistant
AI world-building assistant
Text-to-speech
Audiobooks
Writing challenges
Creator monetization
```

---

# AI Coding Agent Instructions

If this repository is being generated by Claude Code, Gemini CLI, Cursor, or another coding agent:

1. Read this README and the SRS before writing application code.
2. Inspect the existing repository before making changes.
3. Build the application incrementally.
4. Do not generate the entire application as one enormous file.
5. Keep components small and reusable.
6. Keep business logic inside service modules.
7. Keep database operations inside repositories/services.
8. Validate all server inputs.
9. Implement server-side authorization.
10. Never expose environment secrets.
11. Create proper Prisma migrations.
12. Add database indexes for frequently queried fields.
13. Add tests for important business rules.
14. Do not use fake API responses in production code.
15. Do not silently swallow errors.
16. Provide useful loading and empty states.
17. Make every page responsive.
18. Keep public and private content strictly separated.
19. Do not expose private writing through API responses, search, metadata or URLs.
20. Do not automatically overwrite user writing with AI output.
21. Keep AI provider logic behind an abstraction.
22. Keep search provider logic behind an abstraction.
23. Keep storage provider logic behind an abstraction.
24. Avoid unnecessary dependencies.
25. Prefer established, maintained libraries.
26. Run linting and type checking after significant changes.
27. Test critical user flows before considering the feature complete.
28. Update documentation when architecture or setup changes.

---

# Definition of Done

The project is not considered complete merely because the UI renders.

A feature is complete only when:

```text
UI
 +
Backend
 +
Database
 +
Validation
 +
Authorization
 +
Error handling
 +
Loading state
 +
Empty state
 +
Responsive design
 +
Tests
```

are all implemented where applicable.

---

# License

Choose an appropriate license before making the repository public.