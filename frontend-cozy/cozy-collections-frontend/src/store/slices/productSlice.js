import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {api, privateApi} from "../../services/api"; 

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
        const response= await privateApi.post("/products/add", product);
        return response.data.data;
    }
);
export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async({productId,updatedProduct}) => {
        const response = await privateApi.put(`products/${productId}/update`, updatedProduct);
 
        return response.data.data;
        
    }
);
export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (productId) => {
        const response = await privateApi.delete(`products/${productId}/delete`);
        return response.productId;
    }
);

 
export const getAllProductsByBrand = createAsyncThunk(
    "product/getAllProductsByBrand",
    async (brandName) => {
        const response = await api.get("/products/by-brand"
            ,{params: {brandName},
        });
        return response.data.data;
    }
);
export const getProductsByCategory = createAsyncThunk(
    "product/getProductsByCategory",
     async (category) => {
    const response = await api.get(`/products/by-category/${category}`);
    return response.data.data;
  }
);
export const getAllProductsByBrandAndName = createAsyncThunk(
    "product/getAllProductsByBrandAndName",
    async({brandName,productName}) => {
        const response= await api.get("/products/by/brand-and-name",{
            params: {brandName,productName},
        });
        return response.data.data;
    }
);
export const getProductsByCategoryAndBrand = createAsyncThunk(
    "product/getProductsByCategoryAndBrand",
    async({categoryName,brandName}) => {
        const response = await api.get("/products/by/category-and-brand",{
            params: {categoryName,brandName},
        });
        return response.data.data;
    }
);

export const getProductsByName= createAsyncThunk(
    "product/getProductsByName",
        async (productName) => {
            const response= await api.get(`/products/by-name/${productName}`);
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

   

const initialState={
    products: [],
    product:null,
    selectedProduct: null,
    selectedBrands: [],
    brands: [],
    quantity:1,
    isLoading: false,
    errorMessage: null,
    successMessage: null,
}

const productSlice = createSlice({
    name:"product",
    initialState,
reducers: {
    filterByBrands: (state, action) => {
        const {brand,isChecked} = action.payload;
        if(isChecked){
            state.brands.push(brand);
        }else{
            state.selectedBrands = state.brands.filter((b) => b !== brand);
        }
    },
    setQuantity: (state, action) => {
        state.quantity = action.payload;
    },
    addBrand: (state, action) => {
       
            state.brands.push(action.payload);
        }
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
        .addCase(getAllProductsByBrand.fulfilled, (state, action) => {
            state.isLoading = false;
            state.brands = action.payload;
        })
        .addCase(getAllProductsByBrandAndName.fulfilled, (state, action) => {
            state.products = action.payload;
            state.isLoading = false;
        })
        .addCase(getProductsByCategory.fulfilled, (state, action) => {
            state.products = action.payload;
            state.isLoading = false;
            state.errorMessage=null;
        })
        .addCase(getProductsByCategoryAndBrand.fulfilled, (state, action) => {
            state.products = action.payload;
            state.isLoading = false;
        })
         .addCase(getProductsByName.fulfilled, (state, action) => {
            state.products = action.payload;
            state.isLoading = false;
            state.errorMessage=null;
        })
        .addCase(addNewProduct.fulfilled, (state, action) => {
            state.products.push(action.payload);
            state.successMessage = "Product added successfully";
            state.isLoading = false;
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
            const updatedProduct = action.payload.data;
            const index= state.products.findIndex((p)=>p.id === updatedProduct.id);
            if(index!== -1){
                state.products[index] = updatedProduct;
            }
            state.product = updatedProduct;
            state.successMessage = "Product updated successfully";
            state.isLoading = false;
        })
        .addCase(deleteProduct.fulfilled,(state,action) => {
            const deletedId = action.payload.data;
        state.products = state.products.filter((product)=> product.id !== deletedId);
        state.successMessage = "Product deleted successfully";
        state.isLoading = false;
        });
    },




});

export const { filterByBrands,setQuantity,addBrand } = productSlice.actions;
export default productSlice.reducer;
