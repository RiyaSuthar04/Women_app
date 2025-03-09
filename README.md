# Women Empowerment Network

A MERN-based web application that allows skilled and unskilled women to create profiles, chat with each other, and form empowering groups.

## Features
- User Authentication (Signup/Login)
- Profile Creation & Editing
- Real-time Chat & Group Messaging
- Community Forums & Networking

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, Firebase Auth (optional)
- **Real-time Chat:** WebSockets (Socket.io)

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/women-empowerment-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd women-empowerment-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Database Setup
1. Install MongoDB and Mongoose:
   ```bash
   npm install mongoose dotenv
   ```
2. Create a `.env` file in the backend directory and add:
   ```
   MONGO_URI=your_mongodb_connection_string
   ```
3. MongoDB connection is handled in `index.js`, ensuring the database is properly linked with the application.

## Contributing
Feel free to fork the repository and submit pull requests to improve the platform. 😊
