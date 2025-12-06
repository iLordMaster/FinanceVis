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

        console.log('[UserContext] Initializing user session...');

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          const parsedToken = JSON.parse(storedToken);

          // Check if token is expired
          const now = Date.now();
          const timeUntilExpiry = parsedToken.expiry - now;
          const hoursUntilExpiry = (timeUntilExpiry / (1000 * 60 * 60)).toFixed(2);
          
          console.log(`[UserContext] Token expires in ${hoursUntilExpiry} hours`);

          if (parsedToken.expiry && now < parsedToken.expiry) {
            // Set initial state from localStorage FIRST
            // This ensures the user stays logged in even if profile fetch fails
            setToken(parsedToken.token);
            setUser(parsedUser);
            setIsAuthenticated(true);
            
            console.log('[UserContext] User authenticated from localStorage');
            
            // Fetch full user profile to get latest data (like profile picture)
            // This is a non-critical operation - if it fails, we keep the cached user
            try {
              const userId = parsedUser.id || parsedUser._id;
              if (userId) {
                console.log('[UserContext] Fetching fresh user profile...');
                const fullUserProfile = await UserApi.getUser(userId);
                setUser(fullUserProfile);
                localStorage.setItem('user', JSON.stringify(fullUserProfile));
                console.log('[UserContext] User profile updated successfully');
              } else {
                console.warn("[UserContext] User ID not found in stored user data");
              }
            } catch (fetchError) {
              // DON'T logout on profile fetch failure - just log and continue with cached data
              console.warn("[UserContext] Failed to fetch fresh profile, using cached data:", fetchError.message);
              // User is still authenticated with cached data
            }
          } else {
            // Token expired, clear storage
            console.log('[UserContext] Token expired, logging out');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log('[UserContext] No stored session found');
        }
      } catch (error) {
        // Only logout if there's a critical error parsing the stored data
        // Network errors should NOT trigger logout
        console.error('[UserContext] Critical error initializing user:', error);
        
        // Check if this is a JSON parse error (corrupted localStorage)
        if (error instanceof SyntaxError) {
          console.error('[UserContext] Corrupted session data detected, clearing storage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        } else {
          // For other errors, log but don't clear session
          console.warn('[UserContext] Non-critical error during initialization, session preserved');
        }
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const getProfile = async () => {
    return await UserApi.getUser(user.id);
  };

  // Debug utility to check session status
  const debugSession = () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!storedToken || !storedUser) {
      console.log('[Session Debug] No session found');
      return;
    }
    
    try {
      const tokenObj = JSON.parse(storedToken);
      const userObj = JSON.parse(storedUser);
      const now = Date.now();
      const timeUntilExpiry = tokenObj.expiry - now;
      const hoursUntilExpiry = (timeUntilExpiry / (1000 * 60 * 60)).toFixed(2);
      const isExpired = now >= tokenObj.expiry;
      
      console.log('=== Session Debug Info ===');
      console.log('User:', userObj.name || userObj.email);
      console.log('Token expires in:', hoursUntilExpiry, 'hours');
      console.log('Is expired:', isExpired);
      console.log('Expiry date:', new Date(tokenObj.expiry).toLocaleString());
      console.log('Current state - isAuthenticated:', isAuthenticated);
      console.log('=========================');
    } catch (error) {
      console.error('[Session Debug] Error parsing session data:', error);
    }
  };

  // Login function
  const login = async (email, password, rememberMe = false) => {
    try {
      console.log('[UserContext] Attempting login...');
      const response = await AuthApi.login({ email, password });

      if (response.token && response.user) {
        const now = Date.now();
        const expiry = rememberMe
          ? now + 7 * 24 * 60 * 60 * 1000 // 1 week
          : now + 24 * 60 * 60 * 1000; // 24 hours

        const hoursUntilExpiry = ((expiry - now) / (1000 * 60 * 60)).toFixed(2);
        console.log(`[UserContext] Token will expire in ${hoursUntilExpiry} hours (Remember me: ${rememberMe})`);

        const tokenObj = {
          token: response.token,
          expiry,
        };

        // Store token first so UserApi can use it
        localStorage.setItem('token', JSON.stringify(tokenObj));
        
        // Fetch full user profile to get profile picture
        let fullUser = response.user;
        try {
           console.log('[UserContext] Fetching full user profile after login...');
           fullUser = await UserApi.getUser(response.user.id);
           console.log('[UserContext] Full profile fetched successfully');
        } catch (fetchError) {
           console.warn("[UserContext] Failed to fetch full profile after login, using basic user data:", fetchError.message);
           // Fallback to response.user if fetch fails
        }

        // Store full user in localStorage
        localStorage.setItem('user', JSON.stringify(fullUser));

        // Update state
        setUser(fullUser);
        setToken(response.token);
        setIsAuthenticated(true);

        console.log('[UserContext] Login successful');
        return { success: true, user: fullUser };
      }

      console.error('[UserContext] Invalid response from server');
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      console.error('[UserContext] Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      console.log('[UserContext] Attempting registration...');
      const response = await AuthApi.register({ name, email, password });

      if (response.token && response.user) {
        const now = Date.now();
        const expiry = now + 24 * 60 * 60 * 1000; // 24 hours

        console.log('[UserContext] Registration successful, token expires in 24 hours');

        const tokenObj = {
          token: response.token,
          expiry,
        };

        // Store token first so UserApi can use it
        localStorage.setItem('token', JSON.stringify(tokenObj));
        
        // Fetch full user profile to get profile picture (though new users might not have one yet, it's good for consistency)
        let fullUser = response.user;
        try {
           console.log('[UserContext] Fetching full user profile after registration...');
           fullUser = await UserApi.getUser(response.user.id);
           console.log('[UserContext] Full profile fetched successfully');
        } catch (fetchError) {
           console.warn("[UserContext] Failed to fetch full profile after registration, using basic user data:", fetchError.message);
        }

        // Store full user in localStorage
        localStorage.setItem('user', JSON.stringify(fullUser));

        // Update state
        setUser(fullUser);
        setToken(response.token);
        setIsAuthenticated(true);

        return { success: true, user: fullUser };
      }

      console.error('[UserContext] Invalid response from server');
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      console.error('[UserContext] Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  // Logout function
  const logout = () => {
    console.log('[UserContext] User logged out');
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
    debugSession,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
