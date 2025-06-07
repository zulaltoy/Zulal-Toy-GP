import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductById, setQuantity } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { FaShoppingCart } from "react-icons/fa";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { product, quantity } = useSelector((state) => state.product);
  const successMessage = useSelector((state) => state.cart.successMessage);

  const errorMessage = useSelector((state) => state.cart.errorMessage);

  const productOutOfStock = product?.inventory <= 0;

  useEffect(() => {
    dispatch(getProductById(productId));
  }, [dispatch, productId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("you need to be logged in to add items to the cart.");
      return;
    }
    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
      alert(successMessage);
    } catch (error) {
      alert(errorMessage, error);
    }
  };

  const handleIncreaseQuantity = () => {
    dispatch(setQuantity(quantity + 1));
  };

  const handleDecreaseQuantity = () => {
    dispatch(setQuantity(Math.max(1, quantity - 1)));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            {product.images.map((img) => (
              <img
                key={img.id}
                src={img.imageUrl}
                alt={product.name}
                className="w-full rounded-lg shadow-md object-cover max-h-[500px]"
              />
            ))}
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <h2 className="text-2xl text-blue-600 font-semibold">
              ${product.price}
            </h2>
            <p className="text-gray-700">{product.description}</p>

            <p
              className={`font-medium ${
                product.inventory > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.inventory > 0 ? "in stock" : "out of stock"}
            </p>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Quantity :
              </label>

              <div className="flex item-center gap-2">
                <button
                  onClick={handleDecreaseQuantity}
                  disabled={productOutOfStock}
                  className="w-10 h-10 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-xl"
                >
                  -
                </button>

                <button
                  onClick={handleIncreaseQuantity}
                  disabled={productOutOfStock}
                  className="w-10 h-10 rounded-^d bg-gray-200 hover:bg-gray-300 disabled: opacity-5"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={handleAddToCart}
                disabled={productOutOfStock}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <FaShoppingCart />
                Add to cart
              </button>
              <button
                disabled={productOutOfStock}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No product found</p>
      )}
    </div>
  );
};

export default ProductDetails;
