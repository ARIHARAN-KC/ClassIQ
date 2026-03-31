# ClassIQ

<p align="center">
  <img src="./classIQ-client/public/logo.png" alt="ClassIQ Logo" width="200"/>
</p>

<p align="center">
  <strong>AI-Powered Classroom Management System</strong>
</p>

<p align="center">
  A modern, intelligent platform for managing classrooms, assignments, and student-teacher interactions with integrated AI features.
</p>

---

## Features

### Authentication & User Management
- **User Registration & Login** - Separate roles for teachers and students
- **Password Recovery** - Forgot password and reset functionality
- **Profile Management** - View and update user profiles
- **Secure Authentication** - JWT-based authentication system

### Classroom Management
- **Create Classes** - Teachers can create and manage multiple classes
- **Join Classes** - Students can join classes with invite codes
- **Class Dashboard** - Centralized view of all enrolled classes
- **Class Updates** - Edit and delete class information
- **Classroom Stream** - Post announcements and updates to class feed

### Assignment System
- **Create Assignments** - Teachers can create detailed assignments
- **Assignment Management** - Update, delete, and organize assignments
- **Student Submissions** - Students can upload and submit assignments
- **Grading System** - Teachers can grade and provide feedback
- **Submission Tracking** - Monitor submission status and deadlines

### AI-Powered Features
ClassIQ integrates advanced AI capabilities powered by OpenRouter:

- **AI ChatBot** - Interactive assistant for students and teachers
- **Class Summary** - Automatic generation of class summaries
- **Assignment Generator** - AI-powered assignment description creation
- **Assignment Explanation** - Detailed explanations for complex assignments
- **Submission Summary** - Quick summaries of student submissions
- **Notes Generator** - Convert PDF/DOC files into structured notes
- **Voice to Notes** - Transcribe voice recordings to text and generate notes
- **Difficulty Analysis** - Analyze assignment complexity and difficulty level
- **Plagiarism Detection** - Check submissions for potential plagiarism
- **Study Planner** - AI-generated personalized study plans
- **Quiz Generator** - Automatically create quizzes from content
- **Translation** - Multi-language support for content
- **Semantic Search** - Intelligent content search across materials

### Analytics & Insights
- **Teacher Performance Dashboard** - Track class performance metrics
- **Student Progress Tracking** - Monitor individual student progress
- **Deadline Risk Prediction** - AI-powered predictions for at-risk students

### Coming Soon
- **Notifications System** - Real-time notifications for updates and deadlines
- **Calendar Integration** - Event management and deadline tracking
- **Focus Mode** - Productivity tracking and focus sessions

---

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **TSX** - React with TypeScript

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type-safe server code
- **MongoDB** - NoSQL database

### AI Integration
- **OpenRouter** - AI model aggregation platform

### Object Storage
-**GDrive** - Object Storage area

### Package Manager
- **Yarn** - Fast, reliable dependency management

---

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v16 or higher)
- Yarn package manager
- MongoDB (local or Atlas)
- OpenRouter API key (for AI features)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ARIHARAN-KC/ClassIQ.git
cd classiq
```

### 2. Install Dependencies

#### Install Client Dependencies
```bash
cd classIQ-client
yarn install
```

#### Install Server Dependencies
```bash
cd ../classIQ-server
yarn install
```

### 3. Environment Configuration

#### Client Environment Variables
Create a `.env` file in the `classIQ-client` directory:

```env
VITE_API_URL=http://localhost:5000
```

#### Server Environment Variables
Create a `.env` file in the `classIQ-server` directory:

```env
This is sample env
# Application
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:5173

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/classiq?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=30d

# AI Models (OpenRouter)
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=your-model
# SMTP (Gmail Example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_app_password_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Google Drive Storage (OAuth2)
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5000/api/...here
GOOGLE_REFRESH_TOKEN=your_google_refresh_token_here
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=500000
RATE_LIMIT_MAX_REQUESTS=20

# File Upload
MAX_FILE_SIZE_MB=50
ALLOWED_FILE_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp,application/zip,application/x-zip-compressed

# Security
BCRYPT_ROUNDS=90
```

### 4. Run the Application

#### Start the Server
```bash
cd classIQ-server
yarn dev
```

#### Start the Client
```bash
cd classIQ-client
yarn dev
```

The application will be available at:
- **Client**: http://localhost:5173
- **Server**: http://localhost:5000

---

## Security

- All passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected routes with middleware
- Input validation and sanitization
- Rate limiting on sensitive endpoints
- CORS configuration for secure cross-origin requests

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Authors

- **Ariharan K C** - [ariharankc@gmail.com](mailto:ariharankc@gmail.com) - [LinkedIn](https://www.linkedin.com/in/ariharankc07/)
- **Prabhkaran S** - [prabhakaransv69@gmail.com](mailto:prabhakaransv69@gmail.com) - [LinkedIn](https://www.linkedin.com/in/prabhakarans07/)
- **Sakthivel M** - [sakthivelmurugesan3931@gmail.com](mailto:sakthivelmurugesan3931@gmail.com) - [LinkedIn](https://www.linkedin.com/in/sakthivel-murugesan-3b823a378/)

---

## Acknowledgments

- OpenRouter for AI integration
- MongoDB for database solutions
- The React and Express communities

---

## Support

For support and queries, email any of the authors or open an issue in the repository.

---

<p align="center">
  Open-source contributors are always welcome!
</p>
