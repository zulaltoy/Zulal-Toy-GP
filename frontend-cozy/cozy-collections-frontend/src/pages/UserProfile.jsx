import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import placeholder from "../assets/images/placeholder.png";
import AddressForm from '../components/AddressForm';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { getUserById, addAddress, deleteAddress, setUserAddress, updateAddress } from '../store/slices/userSlice';
import { getUserOrders } from '../store/slices/orderSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const user = useSelector((state) => state.user.user);
   const orders = useSelector((state) => state.order.orders);

  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    country: "",
    city: "",
    street: "",
    zip: "",
  });

  const handleEditClick = (address) => {
    setNewAddress(address);
    setIsEditing(true);
    setEditingAddressId(address.id);
    setShowForm(true);
  };

  const handleAddAddress = async () => {
    const updateAddressList = [
      ...user.addressList,
      { ...newAddress, id: nanoid() },
    ];

    dispatch(setUserAddress(updateAddressList));
    try {
      await dispatch(addAddress({ address: newAddress, userId })).unwrap();
    } catch (error) {
      console.error(error);
      dispatch(setUserAddress(user.addressList));
    }
  };

  const handleUpdateAddress = async (id) => {
    const updateAddressList = user.addressList.map((address) =>
      address.id === id ? { ...newAddress, id } : address
    );

    dispatch(setUserAddress(updateAddressList));

    try {
      await dispatch(updateAddress({ id, address: newAddress })).unwrap();
      resetForm();
    } catch (error) {
      console.error(error.message);
      dispatch(setUserAddress(user.addressList));
    }
  };

  const handleDeleteAddress = async (id) => {
    const updatedAddressList = user.addressList.filter(
      (address) => address.id !== id
    );
    dispatch(setUserAddress(updatedAddressList));

    try {
      await dispatch(deleteAddress({ id })).unwrap();
    } catch (error) {
      console.error(error.message);
      dispatch(setUserAddress(user.addressList));
    }
  };

  const resetForm = () => {
    setNewAddress({
      country: "",
      city: "",
      street: "",
      zip: "",
    });
    setShowForm(false);
    setIsEditing(false);
    setEditingAddressId(null);
  };

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    dispatch(getUserOrders(userId));
  }, [dispatch, userId]);

 

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">User Dashboard</h2>
      {user ? (
        <div className="grid md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">Personal Information</h3>
            <div className="flex flex-col items-center text-center space-y-3">
              <img
                src={user.photo || placeholder}
                alt="User"
                className="w-24 h-24 rounded-full"
              />
              <p><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>

         
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">Addresses</h3>
            <div className="space-y-4">
              {user.addressList && user.addressList.length > 0 ? (
                user.addressList.map((address) => (
                  <div
                    key={address.id}
                    className="border p-3 rounded flex justify-between items-start"
                  >
                    <div className="text-sm">
                      <p><strong>{address.addressType}:</strong> {address.country}, {address.city}, {address.street}, {address.zip}</p>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleEditClick(address)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No addresses found.</p>
              )}
            </div>

            
            <div className="mt-4">
              <button
                onClick={() => { setShowForm(true); setIsEditing(false); }}
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700"
              >
                <FaPlus /> Add New Address
              </button>

              {showForm && (
                <div className="mt-4">
                  <AddressForm
                    initialValues={newAddress}
                    onSubmit={isEditing ? () => handleUpdateAddress(editingAddressId) : handleAddAddress}
                    onCancel={resetForm}
                    isEditing={isEditing}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">Orders History</h3>
            {Array.isArray(orders) && orders.length === 0 ? (
              <p className="text-gray-600">No orders found at the moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-3 border">Order ID</th>
                      <th className="py-2 px-3 border">Date</th>
                      <th className="py-2 px-3 border">Total Amount</th>
                      <th className="py-2 px-3 border">Order Status</th>
                      <th className="py-2 px-3 border">Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(orders) &&
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td className="py-2 px-3 border">{order?.id}</td>
                          <td className="py-2 px-3 border">
                            {order?.orderDate
                              ? new Date(order.orderDate).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="py-2 px-3 border">€{order?.totalAmount?.toFixed(2)}</td>
                          <td className="py-2 px-3 border">{order?.orderStatus}</td>
                          <td className="py-2 px-3 border">
                            <table className="min-w-full text-xs border">
                              <thead>
                                <tr>
                                  <th className="py-1 px-2 border">Item ID</th>
                                  <th className="py-1 px-2 border">Name</th>
                                
                                  <th className="py-1 px-2 border">Quantity</th>
                                  <th className="py-1 px-2 border">Unit Price</th>
                                  <th className="py-1 px-2 border">Total Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Array.isArray(order?.items) &&
                                  order.items.map((item, idx) => (
                                    <tr key={idx}>
                                      <td className="py-1 px-2 border">{item.productId}</td>
                                      <td className="py-1 px-2 border">{item.productName}</td>
                                    
                                      <td className="py-1 px-2 border">{item.quantity}</td>
                                      <td className="py-1 px-2 border">€{item.price.toFixed(2)}</td>
                                      <td className="py-1 px-2 border">
                                        €{(item.quantity * item.price).toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="mt-4">
                  <a href="/products" className="text-blue-600 hover:underline">
                    Start Shopping
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Loading user data...</p>
      )}
    </div>
  );
};

export default UserProfile;
