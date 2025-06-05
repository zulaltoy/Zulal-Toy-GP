import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, privateApi } from "../../services/api";

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async () => {
    const response = await api.get("/products/all");
    return response.data.data;
  }
);
export const addNewProduct = createAsyncThunk(
  "product/addNewProduct",
  async (product) => {
    const response = await privateApi.post("/products/add", product);
    return response.data.data;
  }
);
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ productId, updatedProduct }) => {
    const response = await privateApi.put(
      `products/${productId}/update`,
      updatedProduct
    );

    return response;
  }
);
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId) => {
    const response = await privateApi.delete(`products/${productId}/delete`);
    return response.data;
  }
);

export const getProductsByCategoryId = createAsyncThunk(
  "product/getProductByCategoryId",
  async (categoryId) => {
    const response = await api.get(`/products/category/${categoryId}/products`);
    return response.data.data;
  }
);

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data.data;
  }
);


export const getDistinctProductsByName = createAsyncThunk(
  "product/getDistinctProductsByName",
  async () => {
    const response = await api.get("/products/distinct/products");
    return response.data.data;
  }
);

const initialState = {
  products: [],
  product: null,
  selectedProduct: null,
  quantity: 1,
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setQuantity: (state, action) => {
      state.quantity = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.errorMessage = null;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.product = action.payload;
        state.isLoading = false;
      })

      .addCase(getProductsByCategoryId.fulfilled, (state, action) => {
        state.products = action.payload;
        state.isLoading = false;
        state.errorMessage = null;
      })

      .addCase(getDistinctProductsByName.fulfilled, (state, action) => {
        state.products = action.payload;
        state.isLoading = false;
        state.errorMessage = null;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.successMessage = "Product added successfully";
        state.isLoading = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload.data;
        const index = state.products.findIndex(
          (p) => p.id === updatedProduct.id
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
        state.product = updatedProduct;
        state.successMessage = "Product updated successfully";
        state.isLoading = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const deletedId = action.payload.data;
        state.products = state.products.filter(
          (product) => product.id !== deletedId
        );
        state.successMessage = "Product deleted successfully";
        state.isLoading = false;
      });
  },
});

export const { setQuantity } = productSlice.actions;
export default productSlice.reducer;
