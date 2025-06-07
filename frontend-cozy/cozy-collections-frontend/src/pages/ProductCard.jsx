import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct } from '../store/slices/productSlice';
import { Link } from 'react-router-dom';
import ProductImage from '../utils/ProductImage';
import StockStatus from '../utils/StockStatus';

const ProductCard = ({products}) => {

    const dispatch = useDispatch();
    const userRoles = useSelector((state)=> state.auth.roles);
    const isAdmin = userRoles.includes("ROLE_ADMIN");

    const [message,setMessage ] = useState(null);
    const [messageType,setMessageType]= useState("success");

    const handleDelete = async (productId) =>{
        try{
            await dispatch(deleteProduct(productId)).unwrap();
            setMessage("product deleted successfully");
            setMessageType("success");

        }catch(error){
            setMessage("error deleting product",error);
            setMessageType("error");
        }
    }


  return (
    <main className='p-4 grip grip-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        {message && (
            <div className={`col-span-full text-center p-2 rounded ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      {products.map((product) => (
        <div key={product.id} 
        className="border rounded-lg shadow hover:shadow-md transition duration-300 p-3 bg-white flex flex-col justify-between"
      >
        <Link to={`/product/${product.id}/details`} className="block mb-2">
        {product.images.length > 0 &&
        (
            <ProductImage productId={product.images[0].id}/>
        )}
        </Link><div className="flex flex-col gap-2 flex-1">
            <p className="text-gray-700 font-semibold">
              {product.name}
            </p>
            <p className="text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>
            <p className="text-lg font-bold text-blue-600">${product.price}</p>

            <StockStatus inventory={product.inventory} />

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {isAdmin && (
                <>
                  <Link
                   to={"#"}
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </Link>
                  <Link
                    //to={`/update-product/${product.id}/update`}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    Edit
                  </Link>
                </>
              )}
              <Link 
              to={`/product/${product.id}/details`}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm ml-auto">
                Add to cart
              </Link>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
};

export default ProductCard