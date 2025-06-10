import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ userId }) => {
    const response = await api.post(`/orders/user/${userId}/place-order`);
    console.log("response from order slice :", response.data);
    console.log("response from order slice :", response.data.data);

    return response.data;
  }
);
export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async (userId) => {
    const response = await api.get(`/orders/user/${userId}/orders`);
    console.log("response from order slice :", response.data);
    console.log("response from order slice :", response.data.data);

    return response.data.data;
  }
);

export const createPaymentIntent = createAsyncThunk(
  "order/createPaymentIntent",
  async ({ amount, currency }) => {
    const response = await api.post(`/orders/create-payment-intent`, {
      amount,
      currency,
    });
    console.log("response from order slice :", response.data);
    return response.data;
  }
);

const initialState = {
  orders: [],
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload.order);
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
        state.successMessage = action.payload.message;
      });
  },
});
export default orderSlice.reducer;
