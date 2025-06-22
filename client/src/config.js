// Configuration for different environments

const dev = {
  apiUrl: 'http://localhost:5000',
  socketUrl: 'http://localhost:5000'
};

const prod = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://hackbox-server.onrender.com',
  socketUrl: process.env.REACT_APP_SOCKET_URL || 'https://hackbox-server.onrender.com'
};

const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default {
  ...config
};