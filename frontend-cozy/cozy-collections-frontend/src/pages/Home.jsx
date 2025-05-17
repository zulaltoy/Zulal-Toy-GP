import React, { useState, useEffect } from "react";
import { useDispatch ,useSelector} from "react-redux";
import { getAllProducts } from "../store/slices/productSlice"; 
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.product.isLoading);
  const products = useSelector((state) => state.product.products || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const uniqueProdutsByName = Array.from(
    new Map(products?.map((p) => [p.name, p])).values()
  );

  const filteredProducts = uniqueProdutsByName.filter((product) => {
    const matchesTerm = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category?.name
        ?.toLowerCase()
        .includes(selectedCategory.toLowerCase());
    return matchesTerm && matchesCategory;
  });

  if (isLoading) {
    return <div className="text-center mt-10 text-blue-600">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
  
  <div className="mb-10 text-center">
    <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
    <p className="text-gray-500 mt-2">Browse and find what you love</p>
  </div>


  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
    />

    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
    >
      <option value={"all"}>All Categories</option>
      {[...new Set(products.map((product) => product.category?.name))].map(
        (category) => (
          <option key={category} value={category.toLowerCase()}>
            {category}
          </option>
        )
      )}
    </select>
  </div>


  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
    {filteredProducts.map((product) => (
      <div
        key={product.id}
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
      >
        <Link to={`/products/${product.name}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-52 object-cover rounded-t-xl"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              {product.category.name}
            </p>
            <p className="text-blue-600 font-bold text-base">
              €{product.price}
            </p>
          </div>
        </Link>
      </div>
    ))}
  </div>
</div>

  );
};
export default Home;
