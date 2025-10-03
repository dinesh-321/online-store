import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import "./AdminDashboard.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/getOrderList`);
        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // pagination calculations
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout page="Admin-Order">
      <section className="orders py-5">
        <div className="container">
          <h3 className="mb-4">All Orders</h3>

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <>
              <table className="classic-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Products</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment ID</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{order.userId}</td>
                      <td>
                        <ul style={{ margin: 0, paddingLeft: "18px" }}>
                          {order.products.map((p, idx) => (
                            <li key={idx}>
                              {p.name} × {p.quantity} (₹{p.price})
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>₹{order.amount}</td>
                      <td>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            color: "white",
                            backgroundColor:
                              order.status === "Pending"
                                ? "#f0ad4e"
                                : order.status === "Completed"
                                ? "#28a745"
                                : "#dc3545",
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>{order.paymentId || "N/A"}</td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, page) => (
                  <button
                    key={page + 1}
                    className={currentPage === page + 1 ? "active" : ""}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </AdminLayout>
  );
};

export default OrderList;
