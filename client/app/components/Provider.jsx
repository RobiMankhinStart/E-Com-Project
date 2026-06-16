"use client"; // This is REQUIRED for Redux and Context providers

import { useEffect } from "react";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { store } from "@/app/store";
import { Toaster } from "sonner";
import { setUser, setLoading } from "@/app/store/authSlice";
import { apiClient } from "@/app/lib/apiClient";

// Separate component to handle auth initialization
function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only fetch profile if user is not already in Redux and we're still loading
    if (loading && !user) {
      const initAuth = async () => {
        try {
          // Fetch user profile using httpOnly cookies
          const response = await apiClient.get("/auth/profile");
          if (response?.data) {
            dispatch(setUser(response.data));
          }
        } catch (error) {
          // User not authenticated, this is fine
          console.log("User not authenticated on app load");
          dispatch(setUser(null));
        } finally {
          dispatch(setLoading(false));
        }
      };

      initAuth();
    } else if (loading && user) {
      // If user is already in Redux, just set loading to false
      dispatch(setLoading(false));
    }
  }, [loading, user, dispatch]);

  return children;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
        <Toaster position="top-center" richColors />
      </AuthInitializer>
    </Provider>
  );
}
