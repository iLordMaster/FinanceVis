import { createContext, useContext, useState, useEffect } from 'react';
import { AuthApi } from '../api/authApi';
import { UserApi } from '../api/userApi';

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          const parsedToken = JSON.parse(storedToken);

          // Check if token is expired
          const now = Date.now();
          if (parsedToken.expiry && now < parsedToken.expiry) {
            // Set initial state from localStorage
            setToken(parsedToken.token);
            setIsAuthenticated(true);
            
            // Fetch full user profile to get latest data (like profile picture)
            try {
              const userId = parsedUser.id || parsedUser._id;
              if (userId) {
                const fullUserProfile = await UserApi.getUser(userId);
                setUser(fullUserProfile);
                localStorage.setItem('user', JSON.stringify(fullUserProfile));
              } else {
                console.warn("User ID not found in stored user data");
                setUser(parsedUser);
              }
            } catch (fetchError) {
              console.error("Failed to fetch full profile, using stored data", fetchError);
              setUser(parsedUser);
            }
          } else {
            // Token expired, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const getProfile = async () => {
    return await UserApi.getUser(user.id);
  };

  // Login function
  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await AuthApi.login({ email, password });

      if (response.token && response.user) {
        const now = Date.now();
        const expiry = rememberMe
          ? now + 7 * 24 * 60 * 60 * 1000 // 1 week
          : now + 24 * 60 * 60 * 1000; // 24 hours

        const tokenObj = {
          token: response.token,
          expiry,
        };

        // Store token first so UserApi can use it
        localStorage.setItem('token', JSON.stringify(tokenObj));
        
        // Fetch full user profile to get profile picture
        let fullUser = response.user;
        try {
           // We need to temporarily set the token for this request if it's not yet in localStorage (it is now)
           fullUser = await UserApi.getUser(response.user.id);
        } catch (fetchError) {
           console.error("Failed to fetch full profile after login", fetchError);
           // Fallback to response.user if fetch fails
        }

        // Store full user in localStorage
        localStorage.setItem('user', JSON.stringify(fullUser));

        // Update state
        setUser(fullUser);
        setToken(response.token);
        setIsAuthenticated(true);

        return { success: true, user: fullUser };
      }

      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await AuthApi.register({ name, email, password });

      if (response.token && response.user) {
        const now = Date.now();
        const expiry = now + 24 * 60 * 60 * 1000; // 24 hours

        const tokenObj = {
          token: response.token,
          expiry,
        };

        // Store token first so UserApi can use it
        localStorage.setItem('token', JSON.stringify(tokenObj));
        
        // Fetch full user profile to get profile picture (though new users might not have one yet, it's good for consistency)
        let fullUser = response.user;
        try {
           fullUser = await UserApi.getUser(response.user.id);
        } catch (fetchError) {
           console.error("Failed to fetch full profile after registration", fetchError);
        }

        // Store full user in localStorage
        localStorage.setItem('user', JSON.stringify(fullUser));

        // Update state
        setUser(fullUser);
        setToken(response.token);
        setIsAuthenticated(true);

        return { success: true, user: fullUser };
      }

      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // Update user data (for profile updates, etc.)
  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Refresh user data from server
  const refreshUser = async () => {
    if (!user?.id) return;

    try {
      const freshUserData = await UserApi.getUser(user.id);
      updateUser(freshUserData);
      return { success: true, user: freshUserData };
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // If we get a 401, the user will be logged out automatically by UserApi
      return { success: false, message: error.message };
    }
  };

  // Check if token is still valid
  const isTokenValid = () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) return false;

      const parsedToken = JSON.parse(storedToken);
      const now = Date.now();
      return parsedToken.expiry && now < parsedToken.expiry;
    } catch (error) {
      return false;
    }
  };



  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    isTokenValid,
    getProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
