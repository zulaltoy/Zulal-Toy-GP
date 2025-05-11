import React from 'react'
import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './slices/searchSlice'
import categoryReducer from './slices/categorySlice'
import authReducer from './slices/authSlice'
import productReducer from './slices/productSlice'
import cartReducer from './slices/cartSlice'
import orderReducer from './slices/orderSlice'
import userReducer from './slices/userSlice'


const store = configureStore( {
  reducer:{
    search: searchReducer,
    category: categoryReducer,
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    user: userReducer,
    

  },
})

export default store;