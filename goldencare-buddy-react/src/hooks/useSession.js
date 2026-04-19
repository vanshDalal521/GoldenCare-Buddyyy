import { useState, useEffect, useCallback } from 'react';
import { createContext } from 'react';

// Session management hook
export const useSession = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const patientSession = localStorage.getItem('gc_patient_session');
        const doctorSession = localStorage.getItem('gc_doctor_session');
        const adminSession = localStorage.getItem('gc_admin_session');
        
        if (patientSession) {
          const parsedSession = JSON.parse(patientSession);
          // Check if session is still valid (24 hours)
          const sessionAge = Date.now() - parsedSession.loginTime;
          const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          
          if (sessionAge < maxSessionAge) {
            setUser({
              ...parsedSession,
              role: 'patient'
            });
            setIsAuthenticated(true);
          } else {
            // Session expired, clear it
            localStorage.removeItem('gc_patient_session');
          }
        } else if (doctorSession) {
          const parsedSession = JSON.parse(doctorSession);
          const sessionAge = Date.now() - parsedSession.loginTime;
          const maxSessionAge = 24 * 60 * 60 * 1000;
          
          if (sessionAge < maxSessionAge) {
            setUser({
              ...parsedSession,
              role: 'doctor'
            });
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('gc_doctor_session');
          }
        } else if (adminSession) {
          const parsedSession = JSON.parse(adminSession);
          const sessionAge = Date.now() - parsedSession.loginTime;
          const maxSessionAge = 24 * 60 * 60 * 1000;
          
          if (sessionAge < maxSessionAge) {
            setUser({
              ...parsedSession,
              role: 'admin'
            });
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('gc_admin_session');
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // Login function
  const login = useCallback((userData, role) => {
    try {
      const sessionData = {
        ...userData,
        role,
        loginTime: Date.now()
      };
      
      const sessionKey = `gc_${role}_session`;
      localStorage.setItem(sessionKey, JSON.stringify(sessionData));
      
      setUser(sessionData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    try {
      // Clear all session data
      localStorage.removeItem('gc_patient_session');
      localStorage.removeItem('gc_doctor_session');
      localStorage.removeItem('gc_admin_session');
      localStorage.removeItem('gc_last_registered_patient_id');
      
      // Clear any temporary data
      sessionStorage.clear();
      
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login page
      window.location.href = '/login';
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Clear session without redirect
  const clearSession = useCallback(() => {
    localStorage.removeItem('gc_patient_session');
    localStorage.removeItem('gc_doctor_session');
    localStorage.removeItem('gc_admin_session');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.role);
  }, [user]);

  // Get authentication token
  const getToken = useCallback(() => {
    return user?.token;
  }, [user]);

  // Refresh session (extend expiration)
  const refreshSession = useCallback(() => {
    if (user && isAuthenticated) {
      const sessionKey = `gc_${user.role}_session`;
      const updatedSession = {
        ...user,
        loginTime: Date.now()
      };
      
      localStorage.setItem(sessionKey, JSON.stringify(updatedSession));
      setUser(updatedSession);
    }
  }, [user, isAuthenticated]);

  // Check session validity
  const isSessionValid = useCallback(() => {
    if (!user || !isAuthenticated) return false;
    
    const sessionAge = Date.now() - user.loginTime;
    const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
    
    return sessionAge < maxSessionAge;
  }, [user, isAuthenticated]);

  // Auto-refresh session periodically
  useEffect(() => {
    if (isAuthenticated && user) {
      const interval = setInterval(() => {
        if (!isSessionValid()) {
          console.log('Session expired, logging out');
          logout();
        }
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user, isSessionValid, logout]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    clearSession,
    hasRole,
    hasAnyRole,
    getToken,
    refreshSession,
    isSessionValid
  };
};

// Protected route hook
export const useProtectedRoute = (allowedRoles = []) => {
  const { isAuthenticated, hasAnyRole, isLoading } = useSession();
  
  const isAllowed = useCallback(() => {
    if (!isAuthenticated) return false;
    if (allowedRoles.length === 0) return true;
    return hasAnyRole(allowedRoles);
  }, [isAuthenticated, hasAnyRole, allowedRoles]);

  return {
    isAuthenticated,
    isAllowed,
    isLoading
  };
};

// Session context provider component
export const SessionProvider = ({ children }) => {
  const session = useSession();
  
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

// Session context
export const SessionContext = createContext(null);