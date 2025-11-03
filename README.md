# Majlis: The AI-Powered Academy Console

> A comprehensive, AI-powered suite designed for the modern learning academy. Majlis serves as a central hub for students, mentors, and administrators to interact, share knowledge, and leverage cutting-edge AI tools to enhance the educational experience.

## ✨ Core Features

### 🤝 Community & Collaboration
*   **Dynamic Feed:** A central hub for announcements, activities, and posts.
*   **Role-Based Access:** Tailored experiences for Students, Members (Mentors), and Administrators.
*   **Interactive Activities:** Members can create activities that students can rate, fostering engagement and feedback.
*   **User Profiles:** Customizable profiles with avatars, bios, and CV uploads.
*   **Student Roster:** A dedicated view for mentors and admins to see all students and their CVs.

### 🤖 AI-Powered Learning Tools
*   **MCQ Generator:** Instantly create multiple-choice quizzes by simply uploading a PDF document.
*   **AI Assistant:** An interactive chatbot powered by the Google Gemini API to answer questions and provide learning support.
*   **AI Weekly Digest:** Admins can automatically generate a summary of the week's top activities and publish it as an announcement.

### 🛡️ Administration & Moderation
*   **Feedback System:** A robust system for users to submit feedback (anonymously or not), which can be reviewed and replied to by the team.
*   **Admin Panel:** A centralized dashboard for moderating feedback and managing platform-wide announcements.

### 🌍 User Experience
*   **Fully Responsive:** A seamless experience across all screen sizes.
*   **Bilingual Support:** Complete internationalization for both English (LTR) and Arabic (RTL) languages.
*   **Modern UI:** A clean, intuitive, and aesthetically pleasing interface designed for usability.
*   **Secure Authentication:** A full authentication flow including sign-in, sign-up, and a secure password reset process.

## 🚀 Technology Stack

*   **Framework:** [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
*   **AI Integration:** [Google Gemini API](https://ai.google.dev/) (`@google/genai`)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (JIT via CDN)
*   **File Handling:**
    *   `pdfjs-dist` for client-side PDF text extraction from uploads.
    *   `docx` for generating and exporting Word documents.
*   **Utilities:** `date-fns` for advanced date formatting and internationalization.
*   **Environment:** Buildless setup using native ES Modules and `importmap` for CDN-based dependency management.

## 📁 Project Structure

The project follows a clean, component-based architecture designed for clarity and maintainability.

```
/
├── components/     # Reusable React components for each view/feature
├── context/        # React Context for global state management (AppContext.tsx)
├── data/           # Mock data for rapid prototyping and development
├── hooks/          # Custom hooks for accessing application context
├── lib/            # Shared libraries, such as translations
├── services/       # Modules for external API calls and file processing
├── index.html      # Main HTML file with importmap and Tailwind CSS setup
├── index.tsx       # The entry point of the React application
├── README.md       # Project documentation (You are here!)
└── types.ts        # Global TypeScript type definitions and enums
```

## ⚙️ Getting Started

### Prerequisites

1.  **A Modern Web Browser:** Chrome, Firefox, Safari, or Edge.
2.  **Gemini API Key:** The application requires a valid Google Gemini API key to power its AI features. The execution environment **must** provide this key as an environment variable named `API_KEY`. The application code assumes this variable is present and does not include any UI for managing keys.

### How to Run

This project is designed to run in a modern web development environment that can serve static files and supports ES Modules with `importmap`.

1.  **Serve the Project:** Use any local web server to serve the project from its root directory.
2.  **Environment Setup:** Ensure the `API_KEY` environment variable is correctly injected and available to the application's JavaScript context as `process.env.API_KEY`.
3.  **Access the Application:** Open your web browser and navigate to the address provided by your local server.