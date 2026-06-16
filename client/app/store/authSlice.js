import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // { _id, email, fullName, role }
  isAuthenticated: false,
  loading: true,
  status: "idle", // 'idle' | 'loading' | 'authenticated' | 'guest'
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = "authenticated";
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "guest";
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "guest";
    },
    setAuthStatus: (state, action) => {
      state.status = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, logout, setAuthStatus, setLoading } =
  authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectUserRole = (state) => state.auth.user?.role;
