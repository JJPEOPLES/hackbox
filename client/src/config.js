// Configuration for different environments

const dev = {
  apiUrl: 'http://localhost:5000',
  socketUrl: 'http://localhost:5000'
};

const prod = {
  // Use the same domain for both API and socket
  // This works when frontend and backend are deployed together
  apiUrl: process.env.REACT_APP_API_URL || window.location.origin,
  socketUrl: process.env.REACT_APP_SOCKET_URL || window.location.origin
};

const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default {
  ...config
};