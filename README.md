# QuickTodos

A simple and collaborative Todo List application that allows users to create and manage personal task lists within rooms accessible via a shared URL. Each user can create a todo list tied to a specific room, which can be accessed by anyone with the URL. Users can add, delete, and organize their tasks simply through a drag-and-drop system.

## Getting Started

### Environment Setup

This project uses environment variables for configuration. Before running the application, you need to set up your environment:

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and replace the placeholder values with your actual Firebase configuration.

### Running Locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Create and share todo lists with your team instantly
- No sign-up required
- Organize tasks by custom categories
- Set priority levels (Urgent, Normal, Low)
- Drag and drop tasks to reorder them
- Sort todos by name, urgency, or manual order
- Cloud storage for persistence across sessions

## Technologies Used

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Firebase Firestore
- **Deployment**: Vercel/Firebase Hosting

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js or [Firebase Hosting](https://firebase.google.com/docs/hosting).
