import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

const initialState = {
  isAuthenticated: !!localStorage.getItem("authToken"), //!! means changing something true or false
  token: localStorage.getItem("authToken") || null,
  roles: JSON.parse(localStorage.getItem("userRoles")) || [],
  errorMessage: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.roles = [];
      state.errorMessage = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRoles");
      localStorage.removeItem("userId");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const decodedToken = jwtDecode(action.payload.access_token);

        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        state.roles = decodedToken.roles;

        localStorage.setItem("authToken", action.payload.access_token);
        localStorage.setItem("userRoles", JSON.stringify(decodedToken.roles));
        localStorage.setItem("userId", decodedToken.id);
      })
      .addCase(
        login.rejected,
        (state, action) => {
          state.errorMessage = action.payload?.message;
        }
      );
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;