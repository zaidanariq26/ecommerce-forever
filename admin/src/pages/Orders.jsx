import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL, CURRENCY } from "../constants/index.js";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { assets } from "../assets/assets.js";
import OrderDetailDrawer from "../components/OrderDetailDrawer";

const STATUS_COLORS = {
  "Order Placed": "bg-blue-100 text-blue-700",
  Packing: "bg-amber-100 text-amber-700",
  Shipped: "bg-purple-100 text-purple-700",
  "Out for Delivery": "bg-orange-100 text-orange-700",
  Delivered: "bg-green-100 text-green-700",
};

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        BACKEND_URL + "/api/order/list",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const statusHandler = async (orderId, newStatus) => {
    const order = orders.find((o) => o._id === orderId);
    if (order?.status === newStatus) return;

    try {
      const response = await axios.post(
        BACKEND_URL + "/api/order/status",
        { orderId, status: newStatus },
        { headers: { token } },
      );

      if (response.data.success) {
        await fetchAllOrders();
        // Update selected order in drawer
        setSelectedOrder((prev) =>
          prev?._id === orderId ? { ...prev, status: newStatus } : prev,
        );
        toast.success("Status updated");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const paymentHandler = async (orderId, payment) => {
    try {
      const response = await axios.post(
        BACKEND_URL + "/api/order/payment",
        { orderId, payment },
        { headers: { token } },
      );

      if (response.data.success) {
        await fetchAllOrders();
        setSelectedOrder((prev) =>
          prev?._id === orderId ? { ...prev, payment } : prev,
        );
        toast.success(payment ? "Marked as Paid" : "Marked as Unpaid");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const openDrawer = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Update selectedOrder when orders list refreshes
  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find((o) => o._id === selectedOrder._id);
      if (updated) setSelectedOrder(updated);
    }
  }, [orders]);

  return (
    <div>
      <h3 className="mb-4 text-lg font-medium text-gray-800">Orders</h3>
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order._id}
            onClick={() => openDrawer(order)}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 md:p-5"
          >
            {/* Desktop: side-by-side. Mobile: stacked */}
            <div className="flex flex-col gap-3 md:flex-row md:items-start">
              <img
                src={assets.parcel_icon}
                alt=""
                className="mt-1 hidden size-8 md:block"
              />
              <div className="min-w-0 flex-1">
                {/* Items */}
                <div className="mb-2">
                  {order.items.map((item, i) => (
                    <p key={i} className="truncate text-sm text-gray-700">
                      {item.name} x {item.quantity}{" "}
                      <span className="text-gray-400">({item.size})</span>
                    </p>
                  ))}
                </div>

                {/* Address */}
                <p className="text-xs text-gray-500">
                  {order.address.firstName} {order.address.lastName},{" "}
                  {order.address.city}, {order.address.country}
                </p>

                {/* Meta row */}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span>
                    {order.items.length} item{order.items.length !== 1 && "s"}
                  </span>
                  <span>{order.paymentMethod}</span>
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Right side: price + status + select. Mobile: full width row. md+: right-aligned column. */}
              <div className="flex flex-row flex-wrap items-center gap-2 md:w-auto md:flex-col md:items-end md:gap-2">
                <p className="text-sm font-semibold text-gray-800">
                  {CURRENCY}
                  {order.amount.toFixed(2)}
                </p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}
                >
                  {order.status}
                </span>
                {/* Status select — stops propagation so it doesn't open drawer */}
                <select
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    statusHandler(order._id, e.target.value);
                  }}
                  value={order.status}
                  disabled={order.status === "Delivered"}
                  className={`rounded border border-gray-300 px-2 py-1 text-xs ${order.status === "Delivered" ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="py-12 text-center">
            <Icon
              icon="solar:bag-outline"
              className="mx-auto mb-3 text-4xl text-gray-300"
            />
            <p className="text-sm text-gray-400">No orders yet</p>
          </div>
        )}
      </div>

      <OrderDetailDrawer
        order={selectedOrder}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={statusHandler}
        onPaymentChange={paymentHandler}
      />
    </div>
  );
};

export default Orders;
