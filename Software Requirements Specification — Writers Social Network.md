# Software Requirements Specification (SRS)

## 1. Project Overview

### 1.1 Project Name

**Writely — Social Network for Writers**

Writely is a social media platform designed specifically for writers and readers.

The platform allows users to:

- Create and publish written works.
- Keep writings public or private.
- Categorize writings by type.
- Discover writings from the global community.
- Follow other writers.
- View writer profiles.
- Favourite writings.
- Send and accept messaging requests.
- Communicate privately with other users.
- Search users and writings using advanced filters.
- Use AI-powered writing assistance tools.
- Manage their own writing library.

The application should feel like a combination of a modern social network, writing portfolio, discovery platform, and AI writing workspace.

---

# 2. Objectives

The primary objectives are:

1. Create a dedicated social platform for writers.
2. Make publishing written content simple.
3. Give writers complete control over the visibility of their work.
4. Make discovering new writers and writings easy.
5. Provide social features such as following, favourites, messaging and profiles.
6. Provide useful AI tools specifically designed around writing.
7. Provide powerful search and filtering.
8. Maintain a clean, distraction-free writing experience.
9. Build the application using a scalable and maintainable architecture.
10. Make the project suitable for future expansion.

---

# 3. Recommended Technology Stack

## 3.1 Frontend

### Framework

**Next.js with TypeScript**

Use the App Router architecture.

Reasons:

- Full-stack React framework.
- Server-side rendering where useful.
- Strong routing system.
- Excellent TypeScript support.
- API/server functionality can coexist with the frontend.
- Good deployment support.
- Suitable for SEO-friendly public writing pages.

### UI

- Tailwind CSS
- shadcn/ui
- Radix UI primitives where required
- Lucide React for icons

The UI should be modern, minimal and typography-focused.

Writing content should be the visual priority.

### Rich Text Editor

Use **TipTap**.

Requirements:

- Paragraphs
- Headings
- Bold
- Italic
- Underline
- Links
- Blockquotes
- Lists
- Code blocks
- Horizontal separators
- Text alignment
- Undo/redo
- Word count

The editor should be extensible for future writing-specific features.

---

# 4. Backend Architecture

Use the Next.js server-side architecture rather than creating an unnecessary separate Express server.

Use:

- Next.js Server Actions where appropriate.
- Route Handlers for REST-style APIs.
- Server Components for server-rendered data.
- Client Components only where interactivity is required.

Business logic must not be placed directly inside UI components.

Use a layered architecture:

```text
UI
 ↓
Server Actions / API Routes
 ↓
Service Layer
 ↓
Repository / Prisma
 ↓
PostgreSQL
```

Example:

```text
app/
services/
repositories/
lib/
prisma/
components/
```

---

# 5. Database

## PostgreSQL

Use PostgreSQL as the primary database.

Use **Prisma ORM** for:

- Schema management
- Migrations
- Type-safe queries
- Database access

Prisma currently provides PostgreSQL support and type-safe database access, migrations and tooling.

The database must be designed relationally rather than using a document-oriented structure.

---

# 6. Authentication

Users must be able to:

- Register.
- Log in.
- Log out.
- Reset password.
- Verify email.
- Maintain a session.
- Edit their account information.

Authentication should use a secure, production-ready authentication library.

Do not implement password hashing or session management manually unless absolutely necessary.

Passwords must never be stored in plaintext.

---

# 7. User System

Each user should have:

```text
User
├── id
├── username
├── email
├── password/auth identity
├── displayName
├── bio
├── avatar
├── location (optional)
├── website (optional)
├── createdAt
└── updatedAt
```

Users should also be able to specify writing-related information such as:

- Favourite genres
- Writer type
- Interests
- Currently working on
- Social links

These fields should be optional.

---

# 8. User Profile

Each public user profile should contain:

- Profile picture
- Display name
- Username
- Bio
- Follower count
- Following count
- Number of public writings
- Follow button
- Message button
- User's public writings
- Favourite/public collections if enabled
- Writing categories
- Joined date

Example:

```text
-----------------------------------------
        [Profile Picture]

        Jane Doe
        @janedoe

        "Writer of stories about..."
        
        1.2K Followers
        384 Following

        [Follow] [Message]

-----------------------------------------

        Writings

  Poems | Stories | Novels | Essays

-----------------------------------------
```

---

# 9. Writing/Post System

The core entity of the platform is a **Writing**.

A writing should contain:

```text
Writing
├── id
├── authorId
├── title
├── content
├── excerpt
├── writingType
├── visibility
├── coverImage (optional)
├── wordCount
├── createdAt
├── updatedAt
└── publishedAt
```

---

# 10. Writing Types

Initially support:

- Poem
- Short Story
- Novel
- Chapter
- Essay
- Article
- Flash Fiction
- Screenplay
- Journal
- Other

The database should use an enum or configurable category system.

The architecture should allow additional writing types later.

---

# 11. Writing Visibility

Every writing must have one of:

```text
PUBLIC
PRIVATE
```

### Public

The writing:

- Appears in global discovery.
- Can appear in search.
- Can appear on the author's public profile.
- Can be favourited.
- Can be shared through a public URL.

### Private

The writing:

- Is visible only to its author.
- Does not appear in global feeds.
- Does not appear in public search.
- Does not appear on the public profile.
- Cannot be favourited by other users.
- Should not be accessible through guessing its URL.

The backend must enforce visibility.

Do not rely only on hiding UI elements.

---

# 12. Create Writing

The Create page should contain:

```text
Title
Writing type
Visibility
Rich text editor
Optional cover image
Tags
Save draft
Publish
```

Example:

```text
Create Writing

Title
[ The Last Train ]

Type
[ Short Story ▼ ]

Visibility
(●) Public
( ) Private

Tags
[fiction] [train] [mystery]

--------------------------------
Rich Text Editor
--------------------------------

                 Word count: 842

[Save Draft]              [Publish]
```

---

# 13. Draft System

Writings should support a draft state.

Recommended states:

```text
DRAFT
PUBLISHED
PRIVATE
ARCHIVED
```

A draft:

- Is visible only to the author.
- Does not appear in search.
- Does not appear in feeds.
- Can be edited later.

Users should be able to save work without publishing it.

---

# 14. Global Feed

The Dashboard should contain the global feed.

The feed should display public writings from the community.

Each feed card should contain:

- Author avatar
- Author name
- Username
- Follow button where appropriate
- Writing title
- Writing type
- Excerpt/content preview
- Tags
- Published date
- Favourite button
- Share button
- Open/read button

Example:

```text
Jane Doe @janedoe
Short Story · 4 min read

The Last Train

The train arrived at midnight...

#fiction #mystery

♡ 24 favourites

[Read]
```

---

# 15. Feed Algorithm

Version 1 should use a simple chronological/global discovery algorithm.

Possible ordering:

1. Recently published public writings.
2. Followed users' writings.
3. Popular writings.
4. Recommended/discovery writings.

Do not implement a complicated machine-learning recommendation system in version 1.

The feed architecture should make future recommendation algorithms possible.

---

# 16. Following System

Users can follow other users.

Relationships:

```text
Follower → Following
```

A follow relationship should contain:

```text
followerId
followingId
createdAt
```

Rules:

- A user cannot follow themselves.
- Duplicate follows are not allowed.
- Following/unfollowing should be idempotent.
- Follower/following counts should update correctly.

The profile should display:

```text
1,284 Followers
382 Following
```

---

# 17. Favourite System

Users can favourite writings.

A favourite relationship should contain:

```text
userId
writingId
createdAt
```

Rules:

- A user can favourite a writing once.
- Clicking again removes the favourite.
- Private writings cannot be favourited by other users.
- Users can view their favourite writings.

---

# 18. Favourites Page

Create a dedicated:

```text
My Favourites
```

page.

It should display writings the current user has favourited.

Include filters:

- Writing type
- Author
- Date added
- Genre/tag

Example:

```text
My Favourites

[All] [Poems] [Stories] [Essays]

--------------------------------

The Ocean
by Jane Doe

Poem · Added 3 days ago

--------------------------------
```

---

# 19. Messaging System

Messaging should have a request-based system.

A user cannot automatically start a conversation with anyone.

### Sending a message request

User A:

```text
View User B profile
        ↓
Click Message
        ↓
Message Request
        ↓
Write optional introduction
        ↓
Send Request
```

User B receives:

```text
Jane Doe wants to message you.

"Hi, I really enjoyed your short story..."

[Accept] [Decline]
```

---

# 20. Messaging Rules

If request is:

```text
PENDING
```

No normal conversation is available.

If:

```text
ACCEPTED
```

Both users can message each other.

If:

```text
DECLINED
```

Conversation is not created/activated.

Users should also be able to block another user.

---

# 21. Messaging Interface

The messaging UI should contain:

```text
---------------------------------------
Conversations | Chat
---------------------------------------

Jane Doe       Hello! I loved...
Alex Smith     Thanks for reading...
John Writer    Are you working...
---------------------------------------
```

Messages should support:

- Text
- Timestamp
- Read/unread status
- Message request state
- Basic pagination

Real-time messaging should be implemented using WebSockets or a managed realtime service if required.

---

# 22. Notifications

Create a notification system.

Notification types:

```text
FOLLOW
MESSAGE_REQUEST
MESSAGE_ACCEPTED
FAVOURITE
SYSTEM
```

Example:

```text
Jane Doe started following you.

Alex Smith favourited your writing
"The Last Train".

John Writer sent you a message request.
```

Notifications should have:

```text
id
userId
type
actorId
referenceId
read
createdAt
```

---

# 23. Search System

Search is a major feature and should not be treated as a simple text input.

The search system should support:

### Search targets

- Users
- Writings
- Tags
- Genres
- Writing types

Example:

```text
Search: "dark fantasy"
```

Results:

```text
Writings
-----------------------------
Dark Forest
by Jane Doe

Darkness Within
by Alex Smith

Users
-----------------------------
@darkwriter
@fantasy_author
```

---

# 24. Search Filters

Writing search should support:

- Writing type
- Genre
- Tags
- Author
- Publication date
- Popularity
- Word count
- Language
- Public only

Example:

```text
Search

[ dark fantasy                 ]

Filters

Type
☐ Poem
☑ Short Story
☐ Novel
☐ Essay

Date
○ Any time
○ Today
○ This week
○ This month

Sort
[ Relevance ▼ ]

[Apply Filters]
```

---

# 25. Search Quality Requirements

Search should support:

- Partial matches
- Typo tolerance
- Prefix matching
- Relevance ranking
- Exact phrase matching
- Usernames
- Writing titles
- Tags
- Pagination
- Debouncing
- Search suggestions

The search implementation should be abstracted so that a dedicated search engine such as Meilisearch or Typesense can be introduced without rewriting the application.

For an MVP, PostgreSQL full-text/trigram search can be used.

---

# 26. AI Writing Assistant

The platform should include a dedicated AI Writing Studio.

The AI must assist writers rather than replace them.

The interface should allow users to provide text and select an AI operation.

Initial tools:

### Improve Writing

Improve:

- Grammar
- Clarity
- Flow
- Sentence structure

---

### Rewrite

Modes:

```text
Professional
Casual
Poetic
Concise
Descriptive
Dramatic
Simple
```

---

### Continue Writing

Given existing text, generate possible continuation.

---

### Summarize

Generate:

- Short summary
- One-sentence summary
- Plot summary

---

### Generate Title

Generate potential titles based on the writing.

---

### Generate Description

Generate a short description/excerpt for publishing.

---

### Grammar Checker

Identify:

- Grammar errors
- Spelling
- Punctuation
- Awkward sentences

---

### Tone Analysis

Analyze whether writing is:

- Happy
- Sad
- Suspenseful
- Romantic
- Dramatic
- Humorous
- Neutral
- etc.

---

### Show Don't Tell

Identify sentences that tell rather than show and provide alternatives.

---

### Character Development

Given character information, AI can suggest:

- Character traits
- Motivations
- Conflicts
- Character arcs

---

### Plot Brainstorming

User provides an idea.

AI provides:

- Plot possibilities
- Conflicts
- Twists
- Character relationships

---

# 27. AI UX

AI must never silently modify the user's writing.

Instead:

```text
Original
--------------------------------
She walked into the room.
--------------------------------

AI Suggestion
--------------------------------
She stepped cautiously into the
silent room.
--------------------------------

[Replace] [Copy] [Dismiss]
```

The user must remain in control.

AI-generated content should be visually distinguished from the user's original writing.

---

# 28. AI Architecture

Create an abstraction:

```text
AIProvider
    ↓
AIService
    ↓
WritingTools
```

Example conceptual interface:

```text
generateSuggestion()
improveWriting()
rewriteWriting()
summarizeWriting()
generateTitle()
analyzeTone()
```

Do not couple the entire application to one AI provider.

The provider should be configurable through environment variables.

AI requests should be performed server-side.

Never expose private AI API keys to the browser.

---

# 29. AI Usage Limits

Implement basic usage controls.

Example:

```text
Free User

20 AI requests/day
```

The exact limits should be configurable.

Track:

```text
userId
tool
request count
tokens/usage if available
createdAt
```

Do not allow unlimited anonymous AI requests.

---

# 30. Author Dashboard

The dashboard should eventually contain:

```text
Welcome back, Jane

Your Writing
----------------
12 Published
5 Drafts
23 Favourites

Recent Activity
----------------

Your latest writings

Recommended writers

Trending writings
```

---

# 31. My Writings

Users should have a private writing management page.

Tabs:

```text
All
Published
Drafts
Private
Archived
```

Actions:

- Edit
- Delete
- Change visibility
- Duplicate
- Archive
- View

---

# 32. Writing Reader Page

Each public writing should have a dedicated page.

Example URL:

```text
/writing/[slug]
```

The page should contain:

```text
Title

by Jane Doe
Short Story · 1,240 words

--------------------------------

Writing content

--------------------------------

♡ Favourite
Share

About the author

More from Jane Doe
```

The reader should be distraction-free.

Typography should prioritize long-form reading.

---

# 33. Sharing

Public writings should have shareable URLs.

Support:

- Copy link
- Native browser share where available
- Social metadata
- Open Graph preview

Private writings must never expose public share pages.

---

# 34. Tags and Genres

Writings can have tags.

Example:

```text
#fantasy
#romance
#poetry
#horror
#fiction
```

Tags should be normalized rather than stored as arbitrary repeated strings.

Genres can be predefined.

Example:

```text
Fantasy
Romance
Mystery
Horror
Science Fiction
Literary Fiction
Historical Fiction
Thriller
Comedy
Drama
```

---

# 35. Privacy

Privacy is a core requirement.

The backend must enforce:

```text
PRIVATE writing → author only
DRAFT → author only
PUBLIC writing → everyone
```

Never trust:

```text
hidden buttons
frontend state
client-side checks
```

All authorization must be validated server-side.

---

# 36. Authorization

Create authorization utilities such as:

```text
requireAuth()
requireUser()
canEditWriting()
canDeleteWriting()
canViewWriting()
canMessageUser()
```

Do not duplicate authorization logic across components.

---

# 37. Security Requirements

The application must:

- Hash passwords using a secure password hashing algorithm if password auth is used.
- Protect authenticated routes.
- Validate all input.
- Sanitize rich text appropriately.
- Prevent XSS.
- Prevent SQL injection through ORM/parameterized queries.
- Rate-limit authentication endpoints.
- Rate-limit AI endpoints.
- Rate-limit messaging endpoints.
- Protect against CSRF where applicable.
- Validate uploaded files.
- Limit file sizes.
- Restrict allowed MIME types.
- Never expose secret environment variables to the client.

---

# 38. Input Validation

Use a schema validation library such as **Zod**.

Every server endpoint/action must validate input.

Example:

```text
CreateWritingSchema
UpdateWritingSchema
SearchSchema
FollowSchema
MessageRequestSchema
SendMessageSchema
AIRequestSchema
```

Never trust TypeScript types alone for runtime validation.

---

# 39. API Design

Use consistent REST-style endpoints where API endpoints are required.

Example:

```text
/auth
/users
/writings
/feed
/follow
/favourites
/messages
/notifications
/search
/ai
```

Example:

```text
GET    /api/writings
POST   /api/writings
GET    /api/writings/:id
PATCH  /api/writings/:id
DELETE /api/writings/:id
```

Follow the same convention across the application.

---

# 40. Suggested Database Models

Minimum models:

```text
User
Profile
Writing
WritingTag
Tag
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

Session / Account
```

Potential future models:

```text
Comment
Like
BookmarkCollection
Report
Block
ModerationAction
WritingVersion
ReadingHistory
Recommendation
```

Do not implement unnecessary future models in the MVP unless they are required.

---

# 41. Important Relationships

```text
User
 ├── Writings
 ├── Followers
 ├── Following
 ├── Favourites
 ├── Messages
 ├── Notifications
 └── AI Usage

Writing
 ├── Author
 ├── Tags
 ├── Genre
 └── Favourites

Conversation
 ├── Participants
 └── Messages
```

---

# 42. Performance Requirements

The application should:

- Paginate feeds.
- Paginate search results.
- Paginate writings.
- Lazy-load images.
- Avoid unnecessary client-side fetching.
- Use database indexes.
- Avoid N+1 queries.
- Cache appropriate read-heavy data.
- Debounce search input.
- Stream AI responses when supported.

Never load an entire user's writing library at once.

---

# 43. Pagination

Use cursor-based pagination for:

- Global feed
- User writings
- Search results
- Notifications
- Messages

Avoid offset pagination for large, frequently changing feeds where practical.

---

# 44. Responsive Design

The application must work on:

- Desktop
- Laptop
- Tablet
- Mobile

Mobile navigation should transform into a bottom navigation or compact navigation system.

Desktop layout:

```text
Sidebar | Main Content | Optional Right Sidebar
```

Mobile:

```text
Main Content

Bottom Navigation
```

---

# 45. Main Navigation

Recommended navigation:

```text
Home
Explore
Create
AI Studio
Favourites
Messages
Notifications
Profile
Settings
```

---

# 46. Explore Page

Explore should provide discovery beyond the global feed.

Sections:

```text
Trending Writings
Popular Writers
New Writers
Popular Genres
Recently Published
```

This can initially use deterministic ranking.

---

# 47. Settings

Settings should include:

### Account

- Name
- Username
- Email

### Profile

- Bio
- Avatar
- Website
- Writing preferences

### Privacy

- Who can send message requests
- Profile visibility
- Writing defaults

### Notifications

- Followers
- Favourites
- Messages
- Requests

### Security

- Change password
- Sessions
- Logout from all devices

---

# 48. Error Handling

Use consistent error responses.

Example:

```json
{
  "success": false,
  "error": {
    "code": "WRITING_NOT_FOUND",
    "message": "Writing could not be found."
  }
}
```

Never expose:

- Database errors
- Stack traces
- API keys
- Internal implementation details

to end users.

---

# 49. Loading States

Every asynchronous page/action should have proper loading states.

Examples:

```text
Skeleton feed cards
Skeleton profile
Skeleton search results
AI generation indicator
Message sending indicator
```

Avoid blank screens.

---

# 50. Empty States

Every list must have a meaningful empty state.

Examples:

```text
No favourites yet.

Start exploring writings and favourite the ones
you want to return to later.

[Explore Writings]
```

---

# 51. Testing Requirements

Use:

- Unit tests
- Integration tests
- End-to-end tests

Recommended:

```text
Vitest
Testing Library
Playwright
```

Critical flows requiring tests:

### Authentication

- Register
- Login
- Logout
- Unauthorized access

### Writings

- Create
- Edit
- Delete
- Publish
- Private visibility
- Drafts

### Social

- Follow
- Unfollow
- Favourite
- Unfavourite

### Messaging

- Send request
- Accept
- Decline
- Send message

### Search

- Query
- Filters
- Pagination

### AI

- Authentication
- Rate limits
- Tool execution
- Error handling

---

# 52. Accessibility

Follow WCAG principles.

Requirements:

- Keyboard navigation
- Semantic HTML
- Proper labels
- Focus states
- Screen-reader support
- Sufficient contrast
- Accessible modals
- Accessible dropdowns
- Accessible rich-text editor controls

Do not use icons without accessible labels.

---

# 53. SEO

Public writing pages should be SEO-friendly.

Generate:

- Title
- Description
- Open Graph metadata
- Twitter/social metadata
- Canonical URLs

Private pages should not be indexed.

Public profiles should have SEO metadata.

---

# 54. File Storage

User avatars and writing cover images should not be stored directly in PostgreSQL.

Use an object-storage service.

Examples:

- Cloudinary
- Cloudflare R2
- AWS S3
- Supabase Storage

Create a storage abstraction:

```text
StorageService
    upload()
    delete()
    getUrl()
```

This allows changing providers later.

---

# 55. Environment Variables

Never commit secrets.

Example:

```env
DATABASE_URL=

AUTH_SECRET=

AI_API_KEY=

STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
STORAGE_BUCKET=

SEARCH_URL=
SEARCH_API_KEY=

NEXT_PUBLIC_APP_URL=
```

Provide:

```text
.env.example
```

with placeholders only.

---

# 56. Project Structure

Recommended:

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
│   ├── search/
│   ├── ai/
│   └── notifications/
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
├── types/
│
└── hooks/

prisma/
├── schema.prisma
└── migrations/
```

---

# 57. Design Requirements

The visual design should be:

- Minimal
- Elegant
- Typography-focused
- Writer-oriented
- Modern
- Calm
- Responsive

Avoid making it look like a generic Twitter/Instagram clone.

The writing itself should be the center of the interface.

Use generous whitespace and strong typography.

---

# 58. Core User Journey

A new user should experience:

```text
Landing Page
      ↓
Register
      ↓
Create Profile
      ↓
Select Writing Interests
      ↓
Dashboard
      ↓
Discover Writings
      ↓
Read Writing
      ↓
Favourite / Follow Author
      ↓
Create Own Writing
      ↓
Publish
      ↓
Receive Favourites / Followers
      ↓
Message Other Writers
      ↓
Use AI Writing Tools
```

---

# 59. MVP Scope

The first working version MUST contain:

### Authentication

- Register
- Login
- Logout

### Profiles

- View profile
- Edit profile

### Writings

- Create
- Edit
- Delete
- Draft
- Public/private
- Writing categories
- Reader page

### Social

- Follow
- Unfollow
- Favourite

### Feed

- Global feed
- Pagination

### Search

- Users
- Writings
- Basic filters

### Messaging

- Message requests
- Accept/decline
- Basic chat

### AI

- Improve writing
- Rewrite
- Grammar
- Generate title
- Summarize

### Notifications

- Follow
- Favourite
- Message request

---

# 60. Post-MVP Features

Do NOT make these blockers for the first release:

- Comments
- Likes
- Advanced recommendation algorithms
- Collaborative writing
- Writing competitions
- Communities
- Writer subscriptions
- Monetization
- Premium AI
- Advanced analytics
- Version history
- Reading lists
- Public collections
- Audio narration
- AI image generation
- Writing challenges

These can be added after the core platform is stable.

---

# 61. Definition of Done

A feature is considered complete only when:

- UI is implemented.
- Backend logic exists.
- Database relationships exist.
- Validation exists.
- Authorization exists.
- Error handling exists.
- Loading state exists.
- Empty state exists.
- Mobile layout works.
- Tests exist for critical behavior.
- No TypeScript errors exist.
- No lint errors exist.
- No secrets are exposed.
- Database migrations work from a clean installation.

---

# 62. AI Coding Agent Rules

When implementing this SRS, the coding agent MUST:

1. Inspect the existing project before modifying files.
2. Never overwrite working functionality unnecessarily.
3. Use TypeScript strictly.
4. Avoid `any` unless unavoidable.
5. Use reusable components.
6. Keep business logic out of UI components.
7. Validate server inputs.
8. Perform authorization on the server.
9. Never trust client-side visibility checks.
10. Never expose secrets.
11. Use database migrations.
12. Add indexes for frequently queried fields.
13. Write tests for critical functionality.
14. Handle loading and error states.
15. Make the UI responsive.
16. Avoid duplicated code.
17. Use environment variables for external services.
18. Create `.env.example`.
19. Document setup instructions.
20. Do not add unnecessary dependencies.
21. Prefer stable, well-maintained libraries.
22. Do not implement placeholder functionality while claiming it is complete.
23. If an external API is unavailable, create a clean provider abstraction and clearly document the missing configuration.
24. Never hard-code fake production data into the application.
25. Keep the architecture ready for scaling.

---

# 63. Implementation Priority

Implement in this order:

```text
Phase 1
Project setup
Database
Authentication
Layout
        ↓
Phase 2
User profiles
Writing CRUD
Drafts
Public/private permissions
        ↓
Phase 3
Global feed
Following
Favourites
        ↓
Phase 4
Search
Filters
Explore
        ↓
Phase 5
Messaging requests
Chat
Notifications
        ↓
Phase 6
AI Writing Studio
        ↓
Phase 7
Testing
Security
Performance
SEO
Accessibility
        ↓
Phase 8
Deployment
Monitoring
Production hardening
```

---

# 64. Final Architecture

```text
                         ┌─────────────────┐
                         │    Next.js UI   │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
             Server Actions                Route Handlers
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                           Service Layer
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
             Prisma             AI              Search
                │                 │                 │
                ▼                 ▼                 ▼
          PostgreSQL        AI Provider       Search Engine
                │
                ▼
          Object Storage
```

The architecture should remain modular enough that individual infrastructure providers can be replaced without rewriting the application.