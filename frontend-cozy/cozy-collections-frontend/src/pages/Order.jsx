import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getUserOrders } from "../store/slices/orderSlice";

const Order = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const orders = useSelector((state) => state.order.orders);
  const loading = useSelector((state) => state.order.loading);

  useEffect(() => {
    dispatch(getUserOrders(userId))
      .then(() => {
        alert("Orders fetched successfully!");
      })
      .catch(() => {
        alert("Failed to fetch orders.");
      });
  }, [dispatch, userId]);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">My Order History</h3>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found at the moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 border border-gray-300 rounded-md">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3 border">Order ID</th>
                <th className="px-4 py-3 border">Date</th>
                <th className="px-4 py-3 border">Total Amount</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="bg-white border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border">{order.id}</td>
                  <td className="px-4 py-2 border">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{order.status}</td>
                  <td className="px-4 py-2 border">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border border-gray-200">
                        <thead className="bg-gray-50 text-gray-600">
                          <tr>
                            <th className="px-2 py-1 border">Item ID</th>
                            <th className="px-2 py-1 border">Name</th>
                            <th className="px-2 py-1 border">Quantity</th>
                            <th className="px-2 py-1 border">Unit Price</th>
                            <th className="px-2 py-1 border">Total Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, i) => (
                            <tr key={i} className="bg-white">
                              <td className="px-2 py-1 border">{item.productId}</td>
                              <td className="px-2 py-1 border">{item.productName}</td>
                              <td className="px-2 py-1 border">{item.quantity}</td>
                              <td className="px-2 py-1 border">${item.price.toFixed(2)}</td>
                              <td className="px-2 py-1 border">
                                ${(item.quantity * item.price).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
};

export default Order;
