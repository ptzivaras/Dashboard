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
✅ **Toast Notifications** - User-friendly success/error messages for all operations  
✅ **Search & Filters** - Quick search across all resources with advanced filtering  
✅ **Data Validation** - Form validation with error handling and user feedback  
✅ **Accessibility** - ARIA labels and keyboard navigation support  

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
### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+ installed locally
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ptzivaras/Dashboard.git
cd Dashboard
```

2. **Install dependencies**
```bash
# Backend
cd server
npm install

# Frontend
cd ../ui
npm install
```

3. *server/              # Backend Express API
│   ├── src/
│   │   ├── db/         # Database schema & connection
│   │   ├── routes/     # API endpoints
│   │   ├── lib/        # Authentication
│   │   └── index.ts    # Server entry
│   ├── drizzle/        # Migrations
│   ├── seed.js         # Sample data seeder
│   └── package.json
│
└── ui/                  # Frontend React app
    ├── src/
    │   ├── components/ # UI components
    │   ├── pages/      # Page components
    │   ├── hooks/      # Custom hooks
    │   ├── lib/        # Utilities
    │   └── App.tsx     # Root component
    └── package.json
```

## 🎨 Key Features

### Dashboard
- Real-time statistics for all resources
- Quick action buttons
- Visual capacity indicators

### Class Management
- Assign teachers and subjects
- Set max capacity with real-time tracking
- Generate invite codes
- Status management (active/inactive/archived)

### Enrollment System
- Real-time capacity checking
- Visual progress bars
- Color-coded status (green/yellow/red)
- Prevent over-enrollmentpdate `server/.env`:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/classroom
BETTER_AUTH_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
PORT=8000
```

4. **Run Database Migrations**
```bash
cd server
npm run db:generate
npm run db:migrate
```

5. **Seed Database (Optional)**
```bash
cd server
node seed.js
```
Creates sample data: 5 departments, 8 subjects, 10 users, 6 classes, 12 enrollments.

6. **Start Development Servers**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd ui
npm run dev
```

7. **Open Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
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

## 👨‍💻 Author

**Panagiotis Tzivaras**  
GitHub: [@ptzivaras](https://github.com/ptzivaras)

---

Built with ❤️ using modern web technologies

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
