### README for Haya Social Media App

#### Overview
Haya is a full-stack social media application designed to connect users by allowing them to share content, follow each other, and interact through likes and comments. This project includes both a React-based frontend and an Express/MongoDB backend.

#### Features
- User authentication (login/signup)
- Profile creation and editing
- Posting images and updates
- Real-time notifications
- Following and unfollowing users
- Search functionality by usernames or unique names
- Handling follow requests

#### Directory Structure
- **frontend/**
  - **src/**
    - **Pages/**: Contains React components for each page.
    - **Components/**: Reusable components across the application.
- **backend/**
  - **index.js**: Main server file.
  - **Models/**: Mongoose models for user, post, notifications.

#### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/haya-social-media-app.git
   cd haya-social-media-app
   ```

2. **Install Dependencies**
   - For the backend:
     ```bash
     cd backend
     npm install
     ```
   - For the frontend:
     ```bash
     cd frontend
     npm install
     ```

3. **Environment Variables**
   - Ensure MongoDB is running on your local machine.
   - Set up `.env` files in both frontend and backend directories.

4. **Run the Application**
   - Backend:
     ```bash
     npm start
     ```
   - Frontend:
     ```bash
     npm start
     ```

#### Usage
- The application is now running on `localhost:3000` for the frontend and `localhost:4000` for the backend.
- Register a new user account or log in to explore the features.

#### Contributing
- Fork the repository, make changes, and create a pull request to contribute.
- Please ensure to follow existing coding style and add comments for clarity.
