import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { jwtDecode } from "jwt-decode";
import 'react-toastify/dist/ReactToastify.css';
const isAuthenticatedAndValidToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false; 
  }

  try {
    const decodedToken = jwtDecode(token);
    const tokenExp = decodedToken.exp;
    const currentTime = Date.now() / 1000;
    return tokenExp > currentTime;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return false;
  }
}

function App() {
  return (
    <Routes>
      <Route
        path="/dashboard/*"
        element={isAuthenticatedAndValidToken() ? <Dashboard /> : <Navigate to="/auth/sign-in" replace />}
      />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/tasks" replace />} />
    </Routes>
  );
}

export default App;
