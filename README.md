# Quill - A Modern FullStack SaaS-Platform

Built with the Next.js 13.5 App Router, tRPC, TypeScript, Prisma & Tailwind.

Credits: [Joscha Neske](https://www.youtube.com/@joshtriedcoding/videos)

## Features

- 🛠️ Complete SaaS with Payment & Subscription
- 💻 Beautiful Landing Page & Pricing Page Included
- 💳 Free & Pro Plan Using Stripe
- 📄 A Beautiful And Highly Functional PDF Viewer
- 🔄 Streaming API Responses in Real-Time
- 🔒 Authentication Using Kinde
- 🎨 Clean, Modern UI Using 'shadcn-ui'
- 🚀 Optimistic UI Updates for a Great UX
- ⚡ Infinite Message Loading for Performance
- 📤 Intuitive Drag n’ Drop Uploads
- ✨ Instant Loading States
- 🔧 Modern Data Fetching Using tRPC & Zod
- 🧠 LangChain for Infinite AI Memory
- 🌲 Pinecone as our Vector Storage
- 📊 Prisma as our ORM
- 🔤 Fully TypeSafe with TypeScript

## Getting Started

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://github.com/nayak-nirmalya/quill.git
```

### Install Packages

```shell
pnpm install
```

### Setup .env file

```js
# Kinde
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_ISSUER_URL=
KINDE_SITE_URL=
KINDE_POST_LOGOUT_REDIRECT_URL=
KINDE_POST_LOGIN_REDIRECT_URL=

# Database (PlanetScale)
DATABASE_URL=

# Uploadthing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# OpenAI
OPENAI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Pinecone
PINECONE_API_KEY=
```

### Setup Prisma

Add MySQL Database (PlanetScale)

```shell
npx prisma generate
npx prisma db push
```

### Start the App

```shell
pnpm dev
```

## Available Commands

Running commands with npm `pnpm [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev`   | Starts a development instance of the app |
| `lint`  | Run lint check                           |
| `build` | Start building app for deployment        |
| `start` | Run build version of app                 |

## License

[MIT](https://choosealicense.com/licenses/mit/)
