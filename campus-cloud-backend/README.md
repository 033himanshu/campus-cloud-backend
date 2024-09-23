# Campus Cloud Backend

Campus Cloud Backend is a Node.js-based backend system designed to manage a campus web application. This backend provides various functionalities for handling users (students, teachers, admins), courses, departments, classes, resources, and more. It integrates with MongoDB for database operations and Cloudinary for file uploads. Below is an overview of the main features and setup instructions.

## Table of Contents

- Features
- Technologies
- Setup Instructions
- Environment Variables
- Error Handling
- License

## Features
1. User Authentication & Role Management
Login: Users (students, teachers, admins) can log in using their credentials.
Role-Based Access Control (RBAC): Different routes are accessible based on the user’s role (Admin, Teacher, Student).
JWT Token-Based Authentication: Secure authentication with JSON Web Tokens (JWT).
2. Student Management
Register Students: Admin can register students to specific courses and assign them a semester.
Fetch Assigned Subjects: Students can retrieve subjects based on their attendance records.
3. Teacher Management
Assign Teacher to Subject: Head of Department (HoD) can assign teachers to a specific subject within the department.
Upload Study Materials: Teachers can upload materials (videos, PDFs, etc.) for a class to Cloudinary.
4. Course & Department Management
Course Creation: Admin can create and manage courses.
Department Management: Admin and HoD can manage department-specific information.
5. Class Management
Create Class: Admin can create classes with specific course and teacher assignments.
Assign Students to Classes: Students are auto-assigned to classes based on their course and semester.
6. Notifications
Send Notifications: Notifications are sent to users (e.g., for announcements).
Retrieve Notifications: Users can fetch unread and read notifications.
Mark Notifications as Read: When a user views a notification, it is marked as read.
7. Resource Management
Upload and Delete Files: Files such as videos and PDFs are uploaded to Cloudinary and managed accordingly.
Cloudinary Integration: Automatically upload files to Cloudinary and remove temporary local files.
8. Error Handling
Custom error handling with meaningful error messages and status codes using ApiError.
Technologies
Node.js: Backend runtime environment.
Express.js: Web framework for building the API.
MongoDB: NoSQL database for data storage.
Mongoose: ODM library for MongoDB.
Cloudinary: For file uploads.
JWT: JSON Web Tokens for authentication.
Multer: Middleware for handling file uploads.
Dotenv: For environment variable management.
Bcrypt.js: For password hashing.

## Setup Instructions
1. Clone the Repository
   ``` bash
   git clone https://github.com/033himanshu/campus-cloud-backend.git
   cd campus-cloud-backend

2. Install Dependencies
    ``` bash
    npm install
3. Configure Environment Variables
    Create a .env file in the root directory and add the following:

    ```bash
    # MongoDB
    MONGO_URI=your_mongo_connection_string

    # JWT Secret Key
    JWT_SECRET=your_secret_key

    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # Server Port
    PORT=7999
4. Run the Application Start the development server:
   ```bash
    npm run dev
