import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { CURRENCY } from "../constants";

const STATUS_COLORS = {
  "Order Placed": "bg-blue-100 text-blue-700 border-blue-300",
  Packing: "bg-amber-100 text-amber-700 border-amber-300",
  Shipped: "bg-purple-100 text-purple-700 border-purple-300",
  "Out for Delivery": "bg-orange-100 text-orange-700 border-orange-300",
  Delivered: "bg-green-100 text-green-700 border-green-300",
};

const STATUS_ICONS = {
  "Order Placed": "solar:bag-check-outline",
  Packing: "solar:box-outline",
  Shipped: "solar:delivery-outline",
  "Out for Delivery": "solar:compass-outline",
  Delivered: "solar:check-circle-outline",
};

const OrderDetailDrawer = ({ order, isOpen, onClose, onStatusChange, onPaymentChange }) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatDateTime = (timestamp) =>
    new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const timeline = order.statusHistory?.length
    ? order.statusHistory
    : [{ status: order.status, date: order.date }];

  const allStatuses = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];
  const currentIdx = allStatuses.indexOf(order.status);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 z-50 flex h-full w-[88vw] flex-col bg-white shadow-2xl sm:w-[420px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Order Details</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <Icon icon="solar:close-outline" className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Order ID + Date */}
          <div className="mb-5">
            <p className="text-xs text-gray-400">Order ID</p>
            <p className="truncate font-mono text-sm text-gray-600">{order._id}</p>
            <p className="mt-1 text-xs text-gray-400">
              Placed on {formatDate(order.date)}
            </p>
          </div>

          {/* Status Progress */}
          <div className="mb-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
              Status
            </p>
            <div className="flex items-center gap-1">
              {allStatuses.map((s, i) => (
                <div key={s} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={`flex size-8 items-center justify-center rounded-full border-2 text-sm ${
                      i <= currentIdx
                        ? STATUS_COLORS[s] || "bg-gray-100 text-gray-700 border-gray-300"
                        : "border-gray-200 bg-gray-50 text-gray-300"
                    }`}
                  >
                    <Icon
                      icon={STATUS_ICONS[s] || "solar:circle-outline"}
                      className="text-base"
                    />
                  </div>
                  <span
                    className={`hidden text-center text-[10px] leading-tight sm:block ${
                      i <= currentIdx ? "font-medium text-gray-700" : "text-gray-300"
                    }`}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-5 rounded-lg border border-gray-200 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              Customer
            </p>
            <p className="text-sm font-medium text-gray-800">
              {order.address.firstName} {order.address.lastName}
            </p>
            <p className="mt-1 text-sm text-gray-500">{order.address.phone}</p>
            <p className="mt-0.5 text-sm text-gray-500">{order.address.email}</p>
          </div>

          {/* Address */}
          <div className="mb-5 rounded-lg border border-gray-200 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              Shipping Address
            </p>
            <p className="text-sm text-gray-700">{order.address.street}</p>
            <p className="text-sm text-gray-700">
              {order.address.city}, {order.address.state},{" "}
              {order.address.country}
            </p>
            <p className="text-sm text-gray-700">{order.address.zipcode}</p>
          </div>

          {/* Items */}
          <div className="mb-5 rounded-lg border border-gray-200 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
              Items ({order.items.length})
            </p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      Size: {item.size} &middot; Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-medium text-gray-700 ml-3">
                    {CURRENCY}
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-sm font-medium text-gray-500">Total</span>
              <span className="text-sm font-semibold text-gray-800">
                {CURRENCY}
                {order.amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mb-5 rounded-lg border border-gray-200 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              Payment
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Method</span>
              <span className="font-medium text-gray-700">
                {order.paymentMethod}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span
                className={`font-medium ${
                  order.payment ? "text-green-600" : "text-amber-600"
                }`}
              >
                {order.payment ? "Paid" : "Pending"}
              </span>
            </div>
            {order.paymentMethod === "COD" && (
              <button
                onClick={() => onPaymentChange(order._id, !order.payment)}
                className={`mt-3 w-full cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  order.payment
                    ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                {order.payment ? "Mark as Unpaid" : "Mark as Paid"}
              </button>
            )}
            {order.coupon?.code && (
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-gray-500">Coupon</span>
                <span className="font-medium text-purple-600">
                  {order.coupon.code} (-{order.coupon.discountPercent}%)
                </span>
              </div>
            )}
          </div>

          {/* Status History Timeline */}
          {timeline.length > 0 && (
            <div className="mb-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                Timeline
              </p>
              <div className="space-y-0">
                {timeline.map((entry, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`size-2.5 rounded-full ${
                          i === timeline.length - 1
                            ? "bg-gray-900"
                            : "bg-gray-300"
                        }`}
                      />
                      {i < timeline.length - 1 && (
                        <div className="w-px flex-1 bg-gray-200" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-gray-700">
                        {entry.status}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDateTime(entry.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Status Update */}
        <div className="border-t border-gray-200 px-5 py-4">
          <label className="mb-1 block text-xs font-medium text-gray-400">
            Update Status
          </label>
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            disabled={order.status === "Delivered"}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {allStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default OrderDetailDrawer;
