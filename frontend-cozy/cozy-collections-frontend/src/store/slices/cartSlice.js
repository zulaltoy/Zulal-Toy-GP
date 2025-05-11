import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {api,privateApi} from "../../services/api";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }) => {
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("quantity", quantity);
    const response = await privateApi.post("/cartItems/item/add", formData);
    return response.data.data;
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
      `/cartItems/cart/${cartId}/item/${cartItemId}/update?quantity=${newQuantity}`
    );
    return { cartItemId, newQuantity };
  }
);
export const deleteItemFromCart = createAsyncThunk(
  "cart/deleteItemFromCart",
  async ({ cartId, cartItemId }) => {
    await api.delete(`/cartItems/cart/${cartId}/item/${cartItemId}/delete`);
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
        state.cartItems.push(action.payload.data);
        state.successMessage = action.payload.message;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
        state.cartId = action.payload.cartId;
        state.totalAmount = action.payload.totalAmount;
        state.isLoading = false;
        state.errorMessage = null;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.errorMessage = action.error.message;
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
