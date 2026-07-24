import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './contexts/SocketContext';
import LandingPage from './components/LandingPage';
import SessionWorkspace from './pages/SessionWorkspace';
import './App.css';

// Direct room entry route /session/:code
function DirectSessionRoute() {
  const { code } = useParams();
  return <SessionWorkspace defaultCode={code} />;
}

function App() {
  return (
    <SocketProvider initialSessionCode="CS101" role="STUDENT">
      {/* Toast Notifications Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E293B',
            color: '#F8FAFC',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600'
          }
        }}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gateway" element={<SessionWorkspace />} />
        <Route path="/workspace" element={<SessionWorkspace />} />
        <Route path="/session/:code" element={<DirectSessionRoute />} />
        <Route path="/login" element={<SessionWorkspace initialTab="AUTH" initialAuthMode="LOGIN" />} />
        <Route path="/register" element={<SessionWorkspace initialTab="AUTH" initialAuthMode="REGISTER" />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;