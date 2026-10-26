import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter basename="/t3_act8_eq6">
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage onLogin={setUser} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/" 
          element={user ? <DashboardPage user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;