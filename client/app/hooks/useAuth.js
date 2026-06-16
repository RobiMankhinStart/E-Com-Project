import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading } from "@/app/store/authSlice";
import { apiClient } from "@/app/lib/apiClient";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Fetch current user profile using httpOnly cookies
        const response = await apiClient.get("/auth/profile");
        if (response?.data) {
          dispatch(setUser(response.data));
        }
      } catch (error) {
        // User not authenticated, reset state
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (loading) {
      initializeAuth();
    }
  }, [loading, dispatch]);

  return { user, isAuthenticated, loading };
};
