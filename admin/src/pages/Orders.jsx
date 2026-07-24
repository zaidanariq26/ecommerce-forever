import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL, CURRENCY } from "../constants/index.js";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { assets } from "../assets/assets.js";
import OrderDetailDrawer from "../components/OrderDetailDrawer";

const STATUSES = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const STATUS_COLORS = {
  "Order Placed": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Packing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Out for Delivery": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState("Order Placed");
  const [bulkLoading, setBulkLoading] = useState(false);

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

  const bulkStatusHandler = async () => {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);

    const ids = [...selectedIds];
    let updated = 0;
    let failed = 0;

    for (const id of ids) {
      const order = orders.find((o) => o._id === id);
      if (order?.status === bulkStatus) {
        updated++;
        continue;
      }
      try {
        const res = await axios.post(
          BACKEND_URL + "/api/order/status",
          { orderId: id, status: bulkStatus },
          { headers: { token } },
        );
        if (res.data.success) updated++;
        else failed++;
      } catch {
        failed++;
      }
    }

    await fetchAllOrders();
    setSelectedIds(new Set());
    setBulkLoading(false);

    if (failed === 0) {
      toast.success(`${updated} order${updated !== 1 ? "s" : ""} updated`);
    } else {
      toast.warn(`${updated} updated, ${failed} failed`);
    }
  };

  const toggleSelect = (orderId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === orders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map((o) => o._id)));
    }
  };

  const openDrawer = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const exportCSV = () => {
    if (orders.length === 0) {
      toast.warn("No orders to export");
      return;
    }

    const headers = [
      "Order ID",
      "Date",
      "Customer",
      "City",
      "Country",
      "Items",
      "Total",
      "Payment Method",
      "Payment Status",
      "Order Status",
    ];

    const rows = orders.map((o) => [
      o._id,
      new Date(o.date).toLocaleDateString(),
      `${o.address.firstName} ${o.address.lastName}`,
      o.address.city,
      o.address.country,
      o.items.map((i) => `${i.name} x${i.quantity}`).join("; "),
      o.amount.toFixed(2),
      o.paymentMethod,
      o.payment ? "Paid" : "Pending",
      o.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Orders exported");
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

  const allSelected = orders.length > 0 && selectedIds.size === orders.length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Orders</h3>
        <button
          onClick={exportCSV}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Icon icon="solar:download-outline" className="text-base" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">{selectedIds.size}</span> order
            {selectedIds.size !== 1 && "s"} selected
          </p>
          <div className="flex items-center gap-2">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-1.5 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={bulkStatusHandler}
              disabled={bulkLoading}
              className="cursor-pointer rounded-lg bg-gray-900 dark:bg-gray-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {bulkLoading ? "Updating..." : "Update Status"}
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Select All */}
      {orders.length > 0 && (
        <label className="mb-3 flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="size-4 cursor-pointer accent-gray-900"
          />
          Select all
        </label>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order._id}
            onClick={() => openDrawer(order)}
            className="cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 transition-colors hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 md:p-5"
          >
            {/* Desktop: side-by-side. Mobile: stacked */}
            <div className="flex flex-col gap-3 md:flex-row md:items-start">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedIds.has(order._id)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => toggleSelect(order._id)}
                className="mt-1 size-4 shrink-0 cursor-pointer accent-gray-900"
              />
              <img
                src={assets.parcel_icon}
                alt=""
                className="mt-1 hidden size-8 md:block"
              />
              <div className="min-w-0 flex-1">
                {/* Items */}
                <div className="mb-2">
                  {order.items.map((item, i) => (
                    <p key={i} className="truncate text-sm text-gray-700 dark:text-gray-300">
                      {item.name} x {item.quantity}{" "}
                      <span className="text-gray-400 dark:text-gray-500">({item.size})</span>
                    </p>
                  ))}
                </div>

                {/* Address */}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {order.address.firstName} {order.address.lastName},{" "}
                  {order.address.city}, {order.address.country}
                </p>

                {/* Meta row */}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                  <span>
                    {order.items.length} item{order.items.length !== 1 && "s"}
                  </span>
                  <span>{order.paymentMethod}</span>
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Right side */}
              <div className="flex flex-row flex-wrap items-center gap-2 md:w-auto md:flex-col md:items-end md:gap-2">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  {CURRENCY}
                  {order.amount.toFixed(2)}
                </p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}
                >
                  {order.status}
                </span>
                <select
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    statusHandler(order._id, e.target.value);
                  }}
                  value={order.status}
                  disabled={order.status === "Delivered"}
                  className={`rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-2 py-1 text-xs ${order.status === "Delivered" ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="py-12 text-center">
            <Icon
              icon="solar:bag-outline"
              className="mx-auto mb-3 text-4xl text-gray-300 dark:text-gray-600"
            />
            <p className="text-sm text-gray-400 dark:text-gray-500">No orders yet</p>
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
