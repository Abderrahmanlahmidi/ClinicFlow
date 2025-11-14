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

export const loginUser = createAsyncThunk("/auth/loginUser",async (formData, {rejectWithValue}) => {
  try{
    const response = await axiosInstance.post("/auth/login", formData);

    console.log(response.data);

    return response.data;
  }catch(error){
    return rejectWithValue(error.response?.data?.message)
  }
})


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

    // LOGIN
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true,
      state.error = null
    }).addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false,
      state.error = null,
      state.user = action.payload.user,
      state.token = action.payload.accessToken,
      state.successMessage = action.payload.message,
      state.id = action.payload.user.id
      state.role = action.payload.role
      localStorage.setItem("accessToken", action.payload.accessToken)
      localStorage.setItem("userId", action.payload.user.id)
      localStorage.setItem("role", action.payload.user.role)
    }).addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false,
      state.error = action.payload
    })
  },
});

export default authSlice.reducer;
