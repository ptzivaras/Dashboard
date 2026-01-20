# 🎓 Classroom Management Dashboard

A modern, full-stack classroom management system built with React 19, TypeScript, Express, and PostgreSQL.

## ✨ Features

✅ **Department Management** - Create, edit, view, and organize academic departments  
✅ **Subject Management** - Manage subjects with department relations  
✅ **Class Management** - Full CRUD with enrollment tracking & capacity validation  
✅ **Enrollment System** - Student enrollment with real-time capacity checks  
✅ **User Management** - Role-based administration (Admin/Teacher/Student)  
✅ **Real-time Dashboard** - Live statistics and system metrics  
✅ **Responsive Design** - Mobile-friendly with Tailwind CSS v4  
✅ **Dark Mode Support** - Built-in theme switching  
✅ **Toast Notifications** - User-friendly success/error messages  
✅ **Search & Filters** - Quick search across all resources  
✅ **Data Validation** - Form validation with error handling  
✅ **Accessibility** - ARIA labels and keyboard navigation  

## 🛠️ Tech Stack

### Frontend
- React 19.2.0 with TypeScript
- Vite - Lightning-fast build tool
- Tailwind CSS v4
- Refine Framework
- shadcn/ui components
- React Router v7
- TanStack Table v8

### Backend
- Express.js v5
- Drizzle ORM with PostgreSQL
- Better Auth for authentication
- TypeScript throughout

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/ptzivaras/Dashboard.git
cd Dashboard

# Install dependencies
cd ui && npm install
cd ../server && npm install

# Set up environment variables
# server/.env: DATABASE_URL, BETTER_AUTH_SECRET

# Run database migrations
cd server && npm run db:push

# Start servers
cd server && npm run dev  # Port 8000
cd ui && npm run dev      # Port 5173
```

## 📁 Project Structure

```
Dashboard/
├── ui/          # React frontend application
└── server/      # Express backend API
```

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Refine Framework
- shadcn/ui Components

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- Drizzle ORM
- Better Auth

## Getting Started

Coming soon...

## License

MIT
