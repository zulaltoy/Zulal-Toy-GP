import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import StockStatus from "../utils/StockStatus";
import ProductImage from "../utils/ProductImage";
import { getDistinctProductsByName } from "../store/slices/productSlice";

const Home = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.product.isLoading);
  const products = useSelector((state) => state.product.products || []);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { searchTerm, selectedCategory } = useSelector((state) => state.search);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(getDistinctProductsByName());
  }, [dispatch]);

  useEffect(() => {
    const results = products.filter((product) => {
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

    setFilteredProducts(results);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, products]);

  const indexLastProduct = currentPage * itemsPerPage;
  const indexFirstProduct = indexLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexFirstProduct, indexLastProduct);

    if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      <Hero />

      <div className="flex flex-wrap justify-center gap-6 p-6">
        {currentProducts &&
          currentProducts.map((product) => (
            <div
              key={product.id}
              className="w-full sm:w-[300px] border border-gray-200 rounded-lg shadow hover:shadow-lg transition duration-300"
            >
              <Link to={`/products/${product.name}`}>
                <div className="h-48 overflow-hidden flex justify-center items-center bg-gray-100 rounded-t-lg">
                  {product.images.length > 0 && (
                    <ProductImage productId={product.images[0].id} />
                  )}
                </div>
              </Link>
              <div className="p-4 space-y-2">
                <p className="text-lg font-medium text-gray-800">
                  {product.name}
                </p>
                <p className="text-sm text-gray-600">{product.description}</p>
                <h4 className="text-blue-600 font-semibold">${product.price}</h4>
                <StockStatus inventory={product.inventory} />
                <Link
                  to={`/products/${product.name}`}
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                >
                  Shop now
                </Link>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {filteredProducts.length > itemsPerPage && (
        <div className="flex justify-center space-x-2 mt-8 mb-12">
          {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded border ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                } transition`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}
    </>
  );
};

export default Home;
