import { createAsyncThunk ,createSlice} from "@reduxjs/toolkit";
import { api } from "../../services/api";

export const getAllCategories = createAsyncThunk(
    "category/getAllCategories",
    async()=>{
        const response = await api.get("/categories/all");
        return response.data.data;
    }
);

const initialState = {
    categories: [],
    isLoading: false,
    errorMessage: null,
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        addCategory: (state, action) => {
            state.categories.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});
export const { addCategory } = categorySlice.actions;
export default categorySlice.reducer;