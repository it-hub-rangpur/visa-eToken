import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import baseApiSlice from "../apis/BaseApiSlice";
import serverApiSlice from "../apis/server/serverApi";

// Basic Redux store configuration
export const store = configureStore({
  reducer: {
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    [serverApiSlice.reducerPath]: serverApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApiSlice.middleware)
      .concat(serverApiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// TypeScript types for type-safe usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
