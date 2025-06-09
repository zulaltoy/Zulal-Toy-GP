import React, { useEffect } from 'react'
import { FaFacebookF,FaTwitter, FaInstagram} from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { getAllCategories } from '../store/slices/categorySlice';
import { Link } from 'react-router-dom';

const Footer = () => {
  const dispatch= useDispatch();
  

  useEffect(()=>{
    dispatch(getAllCategories());
  },[dispatch]);

  return (
    <>
    <footer  className="bg-gray-100 border-t mt-10">
    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-2">About Us</h3>
        <p className="text-sm text-gray-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Contact</h3>
        <p className="text-sm text-gray-400">Email: info@.com</p>
        <p className="text-sm text-gray-400">Phone: </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
        <div className="flex space-x-4 mt-2">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </div>

    <div className="text-center text-sm text-gray-500 mt-8">
      <p>&copy; 2025 cozycollections.com. All rights reserved.</p>
    </div>
  </footer>
 
</>
);
}

export default Footer