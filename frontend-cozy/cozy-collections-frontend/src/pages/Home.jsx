import React, { useState, useEffect } from "react";
import { useDispatch ,useSelector} from "react-redux";
import { getAllProducts } from "../store/slices/productSlice"; 

const Home = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.product.isLoading);
  const products = useSelector((state) => state.product.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);
  const uniqueProdutsByName = Array.from(
    new Map(products.map((p) => [p.name, p])).values()
  );

  const filteredProducts = uniqueProdutsByName.filter((product) => {
    const matcesTerm = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const mathesCategory =
      selectedCategory === "all" ||
      product.category.name
        .toLowerCase()
        .includes(selectedCategory.toLowerCase());
    return matcesTerm && mathesCategory;
  });

  if (isLoading) {
    return <div className="text-center mt-10 text-blue-600">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={"all"}>All Categories</option>
          {[...new Set(products.map((product) => product.category.name))].map(
            (category) => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            )
          )}
        </select>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Link to={`/products/${product.name}`}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    {product.category.name}
                  </p>
                  <p className="text-blue-600 font-bold mt-2">
                    €{product.price}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
