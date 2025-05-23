import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: localStorage.getItem("userData") ? true : false, 
  userData: localStorage.getItem("userData") 
    ? JSON.parse(localStorage.getItem("userData")) 
    : null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.status = true;
      state.userData = action.payload.userData;
      localStorage.setItem("userData", JSON.stringify(action.payload.userData)); 
    },
    logout(state) {
      state.status = false;
      state.userData = null;
      localStorage.removeItem("userData"); 
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
