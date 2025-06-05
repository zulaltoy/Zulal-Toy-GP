import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserCart } from "../store/slices/cartSlice";
import { logout } from "../store/slices/authSlice";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (userId) {
      dispatch(getUserCart(userId));
    }
  }, [dispatch, userId]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-700 tracking-tight">
          Cozy Collections
        </Link>

        {/* Menu Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/products"
            className="text-base font-medium text-gray-700 hover:text-blue-600 transition"
          >
            All Products
          </Link>

          {/* Cart */}
          {userId && (
            <Link
              to={`/user/${userId}/my-cart`}
              className="relative flex items-center text-gray-700 hover:text-blue-600"
            >
              <FaShoppingCart className="text-2xl" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.cartItems.length > 0 ? cart.cartItems.length : 0}
              </span>
            </Link>
          )}

          {/* Dropdown */}
          <div className="relative group">
            <button className="text-gray-800 font-medium focus:outline-none">
              Account ▾
            </button>
            <div className="absolute right-0 hidden group-hover:block bg-white shadow-lg rounded mt-2 w-44 z-10">
              {userId ? (
                <>
                  <Link
                    to={`/user-profile/${userId}/profile`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
