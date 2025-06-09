import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearCart,
  deleteItemFromCart,
  getUserCart,
  updateQuantity,
} from "../store/slices/cartSlice";
import { placeOrder } from "../store/slices/orderSlice";
import ProductImage from "../utils/ProductImage";
import { Link } from "react-router-dom";

const Cart = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const cartId = useSelector((state) => state.cart.cartId);
  const isLoading = useSelector((state) => state.cart.isLoading);
  //const { successMessage, errorMessage } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getUserCart(userId));
  }, [dispatch, userId]);

  const handleIncreaseQuantity = (cartItemId) => {
    const item = cart.cartItems.find((item) => item.cartItemId === cartItemId);
    if (item && cartId) {
      dispatch(
        updateQuantity({
          cartId,
          cartItemId,
          newQuantity: item.quantity + 1,
        })
      );
    }
  };

  const handleDecreaseQuantity = (cartItemId) => {
    const item = cart.cartItems.find((item) => item.cartItemId === cartItemId); // DÜZELTİLDİ
    if (item && item.quantity > 1) {
      dispatch(
        updateQuantity({
          cartId,
          cartItemId,
          newQuantity: item.quantity - 1,
        })
      );
    }
  };

  const handleDeleteItem = (cartItemId) => {
    dispatch(deleteItemFromCart({ cartId, cartItemId }));
    alert("Item removed from the cart");
  };

  const handlePlaceOrder = async () => {
    if (cart.cartItems.length > 0) {
      try {
        const result = await dispatch(placeOrder(userId)).unwrap();
        dispatch(clearCart());
        alert(result.message);
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("Cannot place order on empty cart");
    }
  };
  if (isLoading) {
    return (
      <div className="flex justifi-center items-center h-screen">
        <div className="flex-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 mt-10">
      {cart.cartItems.length === 0 ? (
        <h3 className="text-2xl font-semibold mb-4">Your cart is empty</h3>
      ) : (
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold mb-6"> My shopping Cart</h3>
          <div className="grid grid-cols-7 font-bold border-b pb-2 mb-4 text-center text-sm">
            <div>Image</div>
            <div>Name</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Total Price</div>
            <div>Action</div>
          </div>

          {cart.cartItems.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-7 gap-2 items-center text-center border p-4 rounded-lg shadow-sm mb-4"
            >
              <Link to="#">
                <div className="w-16 h-16 mx-auto">
                  {item.product.images.length > 0 && (
                    <ProductImage productId={item.product.images[0].id} />
                  )}
                </div>
              </Link>

              <div>{item.product.name}</div>
             
              <div>${item.product.price.toFixed(2)}</div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDecreaseQuantity(item.cartItemId)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() => handleIncreaseQuantity(item.cartItemId)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
                >
                  +
                </button>
              </div>
              <div>${item.totalPrice.toFixed(2)}</div>
              <div>
                <button
                  onClick={() => handleDeleteItem(item.cartItemId)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between mt-6">
            <h4 className="text-xl font-semibold">
              Total: ${cart.totalAmount.toFixed(2)}
            </h4>
            <div className="space-x-4">
              <Link
                to="/products"
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Continue Shopping
              </Link>
              <button
                onClick={handlePlaceOrder}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
