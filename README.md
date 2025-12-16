# TodoDash — Next.js Todo App

A **full-stack Todo application** built with **Next.js (App Router)**, **NextAuth.js**, and **MongoDB**.  
Includes secure authentication and a modern dashboard with full CRUD functionality.

---

## Features

- Authentication (NextAuth – Credentials & Google)
- Create, Read, Update, Delete Todos
- User-specific dashboard
- Real-time stats (Total / Completed / Pending)
- Modern dark UI with Tailwind CSS

---

## Tech Stack

- Next.js + TypeScript
- NextAuth.js
- MongoDB + Mongoose
- Tailwind CSS
- React Hook Form + Zod

---

## Environment Variables

Create `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/todos
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
