import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api, privateApi } from "../../services/api";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }) => {
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("quantity", quantity);
    const response = await privateApi.post("/cartItems/cartItem/add", formData);
   
    return {
      data: response.data.data,
      message: response.data.message,
    };
  }
);
export const getUserCart = createAsyncThunk(
  "cart/getUserCart",
  async (userId) => {
    const response = await api.get(`/carts/user/${userId}/cart`);
    return response.data.data;
  }
);
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ cartId, cartItemId, newQuantity }) => {
    await api.put(
      `/cartItems/cart/${cartId}/cartItem/${cartItemId}/update?quantity=${newQuantity}`
    );
    return { cartItemId, newQuantity };
  }
);
export const deleteItemFromCart = createAsyncThunk(
  "cart/deleteItemFromCart",
  async ({ cartId, cartItemId }) => {
    await api.delete(`/cartItems/cart/${cartId}/cartItem/${cartItemId}/delete`);
    return cartItemId;
  }
);
const initialState = {
  cartItems: [],
  cartId: null,
  totalAmount: 0,
  isLoading: true,
  errorMessage: null,
  successMessage: null,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        if (action.payload && action.payload.data) {
          state.cartItems.push(action.payload.data);
        }
        state.successMessage = action.payload?.message;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      })
      .addCase(getUserCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        const cart = action.payload || {};
        state.cartItems = cart.cartItems || [];
        state.cartId = cart.cartId || null;
        state.totalAmount = cart.totalAmount || 0;
        state.isLoading = false;
        state.errorMessage = null;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.errorMessage = action.error.message;
        state.isLoading = false;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const { cartItemId, newQuantity } = action.payload;
        const cartItem = state.cartItems.find(
          (cartItem) => cartItem.product.id === cartItemId
        );
        if (cartItem) {
          cartItem.quantity = newQuantity;
          cartItem.totalAmount = cartItem.product.price * newQuantity;
        }
        state.totalAmount = state.cartItems.reduce(
          (total, cartItem) => total + cartItem.totalAmount,
          0
        );
      })
      .addCase(deleteItemFromCart.fulfilled, (state, action) => {
        const cartItemId = action.payload;
        state.cartItems = state.cartItems.filter(
          (cartItem) => cartItem.product.id !== cartItemId
        );
        state.totalAmount = state.cartItems.reduce(
          (total, cartItem) => total + cartItem.totalAmount,
          0
        );
      });
  },
});
export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
