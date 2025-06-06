import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import {  getProductsByCategoryId,getAllProducts } from '../store/slices/productSlice';
import { getAllCategories } from '../store/slices/categorySlice';
import { setInitialSearchTerm } from '../store/slices/searchSlice';
import SearchBar from '../components/SearchBar';

import { Link } from 'react-router-dom';

const Products = () => {
  const [filteredProducts, setFilteredProducts]= useState([]);
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products || []);
    
  const {searchTerm,selectedCategory} = useSelector((state)=> state.search);
  const isLoading = useSelector((state) => state.product.isLoading);


  const { name, categoryId } = useParams();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get("search") || name || "";

  useEffect(()=>{
    if(categoryId){
      dispatch(getProductsByCategoryId(categoryId));
    }else{
      dispatch(getAllProducts());
      dispatch(getAllCategories());
    }
  },[dispatch,categoryId]);

  useEffect(()=>{
    dispatch(setInitialSearchTerm(initialSearchTerm));
  },[initialSearchTerm,dispatch]);

 useEffect(() => {
  if(!Array.isArray(products)) return;

    const results = products.filter((product) => {
      const matchesQuery = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category.name
          .toLowerCase()
          .includes(selectedCategory.toLowerCase());

     
      return matchesQuery && matchesCategory;
    });
    setFilteredProducts(results);
  }, [searchTerm, selectedCategory,  products]);

   if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 space-y-4">
    
      <div className="w-full flex justify-center">
        <div className="w-full max-w-md">
          <SearchBar />
        </div>
      </div>

     
      <div className="flex">
       
        <aside className="w-64 p-4 border-r border-gray-300">
          
        </aside>

     
        <main className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow-sm p-4 hover:shadow-md transition duration-300"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
        
              <p className="text-sm text-gray-700">{product.category.name}</p>
              <p className="text-green-600 font-bold mt-1">${product.price}</p>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Products;