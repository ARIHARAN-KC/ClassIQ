# Classroom Authentication System

## Overview
A comprehensive classroom signin and login system built with React, featuring both full authentication and quick classroom access.

## Features

### 🔐 Authentication Pages
- **Full Auth Page** (`/auth`) - Complete signin/signup with role selection
- **Quick Classroom Join** - Fast access with just name and class code
- **Teacher Dashboard** (`/teacher`) - Class management interface

### 👥 User Roles
- **Student** - Join classes, participate in activities
- **Teacher** - Create and manage classes, view analytics
- **Administrator** - Full system access
- **Guest** - Quick join with class code only

### 🎯 Key Components

#### Auth.jsx
- Toggle between signin/signup modes
- Role-based registration (Student/Teacher/Admin)
- Social login options (Google, Microsoft)
- Animated transitions with Framer Motion

#### ClassroomSignin.jsx
- Quick classroom access
- Class code validation
- Guest user creation

#### TeacherDashboard.jsx
- Class creation and management
- Student analytics
- Real-time class status
- Assignment tracking

#### AuthContext.jsx
- Global authentication state
- Persistent login sessions
- Quick join functionality

## Routes
- `/` - Home page
- `/auth` - Full authentication
- `/classroom` - Student classroom interface
- `/teacher` - Teacher dashboard
- `/hero` - Hero section

## Usage

### For Students
1. Visit `/classroom`
2. Enter name and class code for quick access
3. Or create full account at `/auth` for additional features

### For Teachers
1. Sign up at `/auth` with Teacher role
2. Access dashboard at `/teacher`
3. Create classes and share class codes
4. Monitor student participation

### Quick Join Flow
```javascript
// Student enters class code and name
quickJoin("ABC123", "John Doe")
// Creates guest session with limited access
```

### Full Authentication Flow
```javascript
// Complete registration with all features
login({
  email: "user@example.com",
  role: "student",
  fullName: "John Doe"
})
```

## Styling
- Tailwind CSS for responsive design
- Framer Motion for smooth animations
- Gradient backgrounds and modern UI
- Mobile-first responsive layout

## State Management
- React Context for global auth state
- localStorage for session persistence
- Real-time authentication status

## Next Steps
- Integrate with backend API
- Add real-time video/chat features
- Implement assignment submission
- Add grade tracking system