import React, { useEffect, useState } from "react";
import SellerLayout from "./SellerLayout";
import "./SellerDashboard.css";

const SellerOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/order/all`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <SellerLayout page="Seller-Order">
      <section className="orders py-5">
        <div className="container">
          <h3 className="mb-4">All Orders (Seller)</h3>

          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>User</th>
                  <th>Products</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment ID</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.userId}</td>
                    <td>
                      <ul className="mb-0">
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
                        className={`badge ${
                          order.status === "Pending"
                            ? "bg-warning"
                            : order.status === "Completed"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
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
          )}
        </div>
      </section>
    </SellerLayout>
  );
};

export default SellerOrder;
