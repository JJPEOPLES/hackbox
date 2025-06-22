# HackBox - Web-based Terminal Application

HackBox is a web application that provides a GUI interface to connect to a terminal environment. It allows users to access a command-line interface through their browser without installing anything locally.

## Features

- **Web-based Terminal**: Access a full terminal directly in your browser
- **User-friendly Interface**: Clean, modern UI built with React and Material-UI
- **Real-time Connection**: Terminal sessions use Socket.IO for real-time communication
- **Resource Efficient**: Server automatically scales based on usage

## Project Structure

```
hackbox-web/
├── server/             # Node.js Express backend
└── client/             # React frontend
```

## Prerequisites

- Node.js (v14+)
- npm or yarn
- Render.com account (for deployment)

## Setup Instructions

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 2. Frontend Setup

```bash
cd client
npm install
```

### 3. Run the Application Locally

Start the backend:

```bash
cd server
npm start
```

Start the frontend (in a new terminal):

```bash
cd client
npm start
```

The application will be available at http://localhost:3000

## Usage

1. Open the application in your browser
2. Navigate to the Terminal page
3. Connect to the terminal
4. Use standard commands to interact with the terminal

## Deployment to Render.com

### Backend Deployment

1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: hackbox-server
   - **Environment**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node server.js`
   - **Environment Variables**:
     - `NODE_ENV`: production
     - `CLIENT_URL`: https://your-frontend-url.onrender.com

### Frontend Deployment

1. Create a new Static Site on Render.com
2. Connect your GitHub repository
3. Configure the site:
   - **Name**: hackbox-client
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`
   - **Environment Variables**:
     - `REACT_APP_API_URL`: https://your-backend-url.onrender.com
     - `REACT_APP_SOCKET_URL`: https://your-backend-url.onrender.com

## Security Considerations

- User sessions are limited to prevent resource abuse
- The server has minimal permissions for security

## License

MIT

## Acknowledgements

- This project was inspired by platforms like Hack The Box and TryHackMe
- Built with React, Node.js, and Render.com