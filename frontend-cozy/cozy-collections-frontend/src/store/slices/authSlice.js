import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import {jwtDecode } from "jwt-decode";


export const login = createAsyncThunk(
    "auth/login",
    async (email,password) => {
        const response = await api.post("/auth/login", {email,password});
        return response.data;
    }
);
const initialState ={
    isAuthenticated: !!localStorage.getItem("authToken"),  //!! means changing something true or false
    token: localStorage.getItem("authToken") || null,
    roles: JSON.parse(localStorage.getItem("userRoles")) || [],
    errorMessage:null,
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        logout:(state)=>{
            state.isAuthenticated= false;
            state.token =null;
            state.roles=[];
            state.errorMessage =null;
            localStorage.removeItem("authToken");
            localStorage.removeItem("userRoles");
            localStorage.removeItem("userId");
        },
       
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            const decodedToken = jwtDecode(action.payload.accessToken);

            state.isAuthenticated = true;
            state.token = action.payload.accessToken;
            state.roles = decodedToken.roles;

            localStorage.setItem("authToken", action.payload.accessToken);
            localStorage.setItem("userRoles", JSON.stringify(decodedToken.roles));
            localStorage.setItem("userId", decodedToken.id);
        }
        )
        .addCase(login.rejected,(state,action)=>{
            state.errorMessage = action.error.message;
        }
        );
}
,
});
export const {logout} = authSlice.actions;
export default authSlice.reducer;