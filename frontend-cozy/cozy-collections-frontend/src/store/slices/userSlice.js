import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import  api  from "../../services/api"; 
import axios from "axios";

export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId) => {
    const response = await api.get(`/users/user/${userId}`);
    return response.data.data;
  }
);
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ user, addresses }) => {
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      addressList: addresses,
    };
    const response = await api.post("/users/add", payload);
    return response.data;
  }
);
export const getCountryNames = createAsyncThunk(
    "user/getCountryNames",
    async()=>{
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryNames = response.data.map((country) => country.name.common);
        return countryNames;
    }
);
const initialState = {
  user: null,
  countryNames: [],
  loading: false,
  errorMessage: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state,action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;