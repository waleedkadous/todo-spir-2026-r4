# Todo Manager

A Todo Manager application built with Next.js 14, TypeScript, and Tailwind CSS. Features a natural language interface powered by Gemini for creating, updating, deleting, and filtering todos.

## Features

- Create, edit, and delete todos
- Priority levels: low, medium, high
- Due dates
- Status tracking: pending / completed
- Filter by status and priority
- Natural language interface (powered by Gemini 2.0 Flash)
- Browser-only storage (localStorage)

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your-api-key-here
GEMINI_MODEL=gemini-2.0-flash
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Test

```bash
npm test
```

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | No | — | Google Gemini API key. NL features disabled without it. |
| `GEMINI_MODEL` | No | `gemini-2.0-flash` | Gemini model to use. |

## Deploy to Railway

1. Push this repository to GitHub.
2. Create a new project on [Railway](https://railway.com) and connect the repo.
3. Set the `GEMINI_API_KEY` environment variable in Railway's dashboard.
4. Railway will auto-detect the Dockerfile and deploy.

The app listens on port 3000 by default. Railway sets the `PORT` variable automatically.
