import { axiosInstance } from "../../api/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "/auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/register", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth", 
  initialState: {
    successMessage:null,
    isLoading: false,
    error: null,
    user:null,
    token:null,
    id:null,
    role:null
  },

  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.successMessage = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message; 
      });
  },
});

export const { clearSuccessMessage } = authSlice.actions;
export default authSlice.reducer;
