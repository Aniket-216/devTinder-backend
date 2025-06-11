# DevTinder Backend

A Node.js backend application for DevTinder - a platform connecting developers.

## 🚀 Features

-   User Authentication (Signup, Login, Logout)
-   JWT-based authentication
-   Secure password hashing
-   MongoDB database integration
-   Input validation
-   Cookie-based session management

## 📋 Prerequisites

-   Node.js (v14 or higher)
-   MongoDB
-   npm or yarn

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd devtinder
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## 🏃‍♂️ Running the Application

Development mode:

```bash
npm run dev
```

## 📦 Dependencies

-   **express**: Web framework for Node.js
-   **mongoose**: MongoDB object modeling tool
-   **bcrypt**: Password hashing
-   **jsonwebtoken**: JWT authentication
-   **cookie-parser**: Cookie parsing middleware
-   **cors**: Cross-Origin Resource Sharing
-   **dotenv**: Environment variable management
-   **validator**: Input validation

## 🔐 Authentication Endpoints

### Signup

-   **POST** `/auth/signup`
-   Body: `{ firstName, lastName, emailId, password }`
-   Returns: JWT token in cookie and user data

### Login

-   **POST** `/auth/login`
-   Body: `{ emailId, password }`
-   Returns: JWT token in cookie and user data

### Logout

-   **POST** `/auth/logout`
-   Clears authentication cookie

## 🔒 Security Features

-   Password hashing using bcrypt
-   HTTP-only cookies for JWT storage
-   Secure cookie settings in production
-   Input validation for email and other fields
-   CORS protection
-   Environment variable management

## 📁 Project Structure

## 🔧 Environment Variables

-   `MONGODB_URI`: MongoDB connection string
-   `JWT_SECRET`: Secret key for JWT signing
-   `NODE_ENV`: Environment (development/production)

## 📝 License

ISC

## 👨‍💻 Author

Aniket Shinde
