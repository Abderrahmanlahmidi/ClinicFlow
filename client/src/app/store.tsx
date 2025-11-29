import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import isOpenCloseReducer from "./slices/isOpenCloseSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    isOpenClose: isOpenCloseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
 