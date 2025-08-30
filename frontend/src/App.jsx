// src/App.jsx
import './index.css';
import React, { useEffect } from 'react';
import {
  SessionContextProvider,
  useSession,
  useUser,
} from '@supabase/auth-helpers-react';
import { supabase } from './lib/supabaseClient';
import NavBar from './components/ui/NavBar';
import Hero from './components/ui/Hero';
import Footer from './components/ui/Footer';
import AuthForm from './components/AuthForm';
import Dashboard from './admin/Dashboard';
import {BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import UserProfile from './user/UserProfile';
import UserDashboard from './user/UserDashboard';
import UserNavbar from './user/UserNavbar';

function Root() {
  const session = useSession();   // reflects the current auth session
  const user = useUser();         // convenient shortcut to session?.user

  // Optional: keep a listener for auth state changes (helps during SSR)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      // session value updates automatically via the provider
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="flex flex-col min-h-screen">
       
        <main className="flex-grow flex items-center justify-center">
          <AuthForm />
        </main>
       
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-grow">
        <Router>
          <UserNavbar />
          <Routes>
            <Route path="/admin" element={<Dashboard/>} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/dashboard" element={<UserDashboard/>} />
          </Routes>
        </Router>
       
      </main>
      
    </div>
  );
}

// Wrap the whole app with the SessionContextProvider so the hooks work
export default function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Root />
    </SessionContextProvider>
  );
}