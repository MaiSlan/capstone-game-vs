import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Check if the JWT token exists in the browser's storage
  const token = localStorage.getItem('game_token');

  if (!token) {
    // If no token is found, kick them back to the login page immediately
    return <Navigate to="/auth" replace />;
  }

  // If the token exists, allow them to view the requested page
  return children;
}