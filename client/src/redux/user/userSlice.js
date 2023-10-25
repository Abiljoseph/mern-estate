import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = null;
    },
    userDeleteAccountStart: (state) => {
      state.loading = true;
    },
    userDeleteAccountSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    userDeleteAccountError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutAccountStart: (state) => {
      state.loading = true;
    },
    signOutAccountSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutAccountError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  userDeleteAccountStart,
  userDeleteAccountSuccess,
  userDeleteAccountError,
  signOutAccountStart,
  signOutAccountSuccess,
  signOutAccountError,
} = userSlice.actions;

export default userSlice.reducer;
