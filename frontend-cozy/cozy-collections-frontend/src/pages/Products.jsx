import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import {
  getProductsByCategoryId,
  getAllProducts,
} from "../store/slices/productSlice";

import { setInitialSearchTerm } from "../store/slices/searchSlice";
import SearchBar from "../components/SearchBar";
import ProductCard from "../pages/ProductCard";


const Products = () => {
 const [filteredProducts, setFilteredProducts] = useState([]);

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product.products || []);
  const isLoading = useSelector((state) => state.product.isLoading);
  const { searchTerm, selectedCategory } = useSelector((state) => state.search);

  const { name, categoryId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get("search") || name || "";

  useEffect(() => {
    if (categoryId) {
      dispatch(getProductsByCategoryId(categoryId));
    } else {
      dispatch(getAllProducts());
    }
  }, [dispatch, categoryId]);

  useEffect(() => {
    dispatch(setInitialSearchTerm(initialSearchTerm));
  }, [initialSearchTerm, dispatch]);

  useEffect(() => {
    if (!Array.isArray(products)) return;
    const results = products.filter((product) => {
      const matchesQuery = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.name
          ?.toLowerCase()
          .includes(selectedCategory.toLowerCase());

      return matchesQuery && matchesCategory;
    });

    setFilteredProducts(results);
  }, [searchTerm, selectedCategory, products]);

  if (isLoading) {
   return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <ProductCard products={filteredProducts} />
      </div>
    </div>
  );
};

export default Products;
