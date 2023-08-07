import { createSlice } from "@reduxjs/toolkit";

const idToken = localStorage.getItem("token");
const email = localStorage.getItem("email");
const isLoggedIn = !!idToken;

const initialAuthState = {
  idToken: idToken,
  email: email,
  isLoggedIn: isLoggedIn,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action) => {
      state.idToken = action.payload.idToken;
      state.email = action.payload.email;
      state.isLoggedIn = true;
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("token", action.payload.idToken);
    },
    logout: (state) => {
      state.idToken = null;
      state.email = "";
      state.isLoggedIn = false;
      localStorage.removeItem("email");
      localStorage.removeItem("token");
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
