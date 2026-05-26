import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If token exists, fetch user profile
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const res = await fetch('/api/auth/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            // Token invalid or expired
            logout();
          }
        } catch (error) {
          console.error('Error fetching user profile', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.token);
        setUser(data);
        localStorage.setItem('token', data.token);
        
        // Redirect based on role
        if (data.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/patient/chat');
        }
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error', error);
      return { success: false, message: 'Server error' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.token);
        setUser(data);
        localStorage.setItem('token', data.token);
        
        if (data.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/patient/chat');
        }
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error', error);
      return { success: false, message: 'Server error' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
