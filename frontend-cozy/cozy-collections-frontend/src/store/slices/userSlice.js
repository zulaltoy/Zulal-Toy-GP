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
  async (values) => {
    const response = await api.post("/users/add", values); // <-- sadece values gönder!
    return response.data;
  }
);
export const getCountryNames = createAsyncThunk(
    "user/getCountryNames",
    async()=>{
        const response = await axios.get("https://restcountries.com/v3.1/all?fields=name,cca2");
        const countryNames = response.data.map((country) => country.name.common);
        return countryNames;
    }
);
export const addAddress = createAsyncThunk(
  "user/addAddress",
  async({address,userId})=>{
    const response = await api.post(`/addresses/${userId}/add`,[address]);
    return response.data;
  }
);
export const fetchAddresses = createAsyncThunk(
  "user/fetchAddresses",
  async(userId) =>{
    const response = await api.get(`/addresses/${userId}/address`);
    return response.data;
  }
);
export const updateAddress = createAsyncThunk(
  "user/updateAddress",
  async({id,address}) =>{
    const response = await api.put(`/addresses/${id}/update`,address);
    return response.data;
  }
);
export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async({id}) =>{
    const response = await api.delete(`/addresses/${id}/delete`);
    return response.data;
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
    setUserAddress(state,action){
      state.user.addressList = action.payload;
    }
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

export const { setUser, setUserAddress } = userSlice.actions;
export default userSlice.reducer;