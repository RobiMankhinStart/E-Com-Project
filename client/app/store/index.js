import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setUser, logout, setLoading } from "./authSlice";
import { adminApiService } from "../(admin)/services/api";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [adminApiService.reducerPath]: adminApiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApiService.middleware),
});

setupListeners(store.dispatch);

export { setUser, logout, setLoading };
