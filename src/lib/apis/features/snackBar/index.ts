import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum SnackbarType {
  SUCCESS,
  ERROR,
}

export interface SnackbarState {
  isOpen: boolean;
  type: "error" | "success";
  message: string;
}

export interface SnackbarOpenPayload {
  type: "error" | "success";
  message: string;
}

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: {
    isOpen: false,
    type: "error",
    message: "",
  },
  reducers: {
    close(state) {
      state.isOpen = false;
    },
    open(state, action: PayloadAction<SnackbarOpenPayload>) {
      state.isOpen = true;
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
  },
});

// Actions
export const snackbarSliceActions = snackbarSlice.actions;

// Reducer
const snackbarReducer = snackbarSlice.reducer;
export default snackbarReducer;
