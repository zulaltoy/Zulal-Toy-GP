import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    searchTerm: "",
    selectedCategory: "all"
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        resetSearch: (state) => {
            state.searchTerm = "";
            state.selectedCategory = "all";
        },
        setInitialSearchTerm :(state,action)=>{
            state.searchTerm = action.payload;
        }
    }
});
export const { setSearchTerm, setSelectedCategory, resetSearch,setInitialSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;