import { createSlice } from "@reduxjs/toolkit";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  companyId: string;
  updatedAt: Date;
}

const initialState = {
  user: {} as IUser,
};

const serverSlice = createSlice({
  name: "auth/user",
  initialState,
  reducers: {
    setLoggedInUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setLoggedInUser } = serverSlice.actions;

export default serverSlice.reducer;
