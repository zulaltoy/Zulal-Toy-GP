import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-blue-600 sticky top-0 z-50 shadow-md">
    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
      
      <Link to="/" className="text-white text-xl font-bold">
        cozycollections.com
      </Link>

     
      <div className="hidden md:flex space-x-6">
        <Link
          to="/products"
          className="text-white hover:text-gray-200 transition"
        >
          All Products
        </Link>
        <Link
          to="#"
          className="text-white hover:text-gray-200 transition"
        >
          Manage Products
        </Link>
      </div>

      <div className="relative group">
        <button className="text-white focus:outline-none">Account ▾</button>
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-200 z-50">
          <Link
            to="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            My Account
          </Link>
          <hr className="border-gray-200" />
          <Link
            to="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            My Orders
          </Link>
          <hr className="border-gray-200" />
          <Link
            to="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </Link>
          <hr className="border-gray-200" />
          <Link
            to="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  </nav>
);
};


export default Navbar